import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AnyObject, User } from '@the-crew/common';
import { compare } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { isNotEmptyObject } from 'class-validator';
import ms from 'ms';
import { Repository } from 'typeorm';

import AuthConfig from '../../../configs/auth.config';
import { UserService } from '../../user/services';
import { LoginGoogleUserDTO, UserToken } from '../models/dto';
import { RefreshTokenEntity } from '../models/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
    @Inject(AuthConfig.KEY) private authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  /**
   * Validate if the user credentials exists & match in the system while logging
   * @param email email address
   * @param pwd password
   * @returns User | null
   */
  public async validateUser(email: string, pwd: string): Promise<UserToken | null> {
    const user = await this.userService.findOne({
      where: { email },
    });
    if (user) {
      if (user.meta.googleId) {
        throw new UnauthorizedException('Email already exists via Google OAuth');
      }
      const matched = await compare(pwd, user.password);
      if (matched) {
        return plainToClass(UserToken, user, { excludeExtraneousValues: true });
      }
    }
    return null;
  }

  /**
   * Generate accessToken & refreshToken while logging in
   * @param user User extracted from request object.
   * @returns Access Token and Refresh Token
   */
  public async login(user: Express.User) {
    const { accessTokenExp } = this.authConfig;
    return {
      accessToken: this.generateAccessToken(user as UserToken),
      refreshToken: await this.generateRefreshToken(user as UserToken),
      expiresAt: new Date(new Date().getTime() + ms(accessTokenExp)).getTime(),
    };
  }

  /**
   * Generate accessToke and refreshToken for google login
   * @param user LoginGoogleUserDTO
   * @returns Access Token and Refresh Token
   */
  public async loginGoogleOAuth(userDTO: LoginGoogleUserDTO) {
    if (!userDTO.meta.googleId) {
      throw new BadRequestException('Google ID is missing!');
    }
    // check if the user exists or not
    let user = await this.userService.findOne({
      where: { email: userDTO.email },
      select: ['meta'],
    });
    // if null/undefined returned, then this will add the user and generate tokens and return
    if (!user) {
      user = this.userService.userRepo.create(userDTO);
    }
    // if user exists, then:
    else {
      // if googleId in meta object is missing, return error 401 (user already registered with same email but via local strategy)
      if (!isNotEmptyObject(user.meta)) {
        throw new UnauthorizedException();
      }
      // if googleId in meta object is found, update the details and generate tokens and return
      const { meta } = user;
      user = this.userService.userRepo.create({
        ...userDTO,
        meta: {
          ...meta,
          ...userDTO.meta,
        },
      });
    }
    await this.userService.userRepo.upsert(user, ['email']);
    const { accessTokenExp } = this.authConfig;
    return {
      accessToken: this.generateAccessToken(user as UserToken),
      refreshToken: await this.generateRefreshToken(user as UserToken),
      expiresAt: new Date(new Date().getTime() + ms(accessTokenExp)).getTime(),
    };
  }

  /**
   * Logout the user by deleting its refresh token entity
   * @param user User extracted from request object.
   */
  public async logout(user: User) {
    // delete token entity
    await this.refreshRepo.softDelete({ userId: user.id });
  }

  /**
   * Check if user already exists in the system while registering.
   * @param userDto RegisterDTO
   * @returns User | ConflictException
   */
  public async register(userDto: Partial<User>) {
    const isUserExist = await this.userService.findOne({
      where: { email: userDto.email },
    });
    if (isUserExist) {
      throw new ConflictException('User Already Exists!');
    }
    const user = this.userService.userRepo.create(userDto);
    return this.userService.userRepo.save(user);
  }

  /**
   * Create AccessToken and RefreshToken from existing RefreshToken
   * @param refreshToken encoded token string
   * @returns
   */
  public async createAccessAndRefreshToken(oldRefreshToken: string) {
    const { user, accessToken } = await this.generateAccessTokenFromRefreshToken(oldRefreshToken);
    const refreshToken = await this.generateRefreshToken(user);
    const { accessTokenExp } = this.authConfig;
    return {
      accessToken,
      refreshToken,
      expiresIn: new Date(new Date().getTime() + ms(accessTokenExp)).getTime(),
    };
  }

  protected generateAccessToken(user: UserToken): string {
    // sign options
    const config: JwtSignOptions = {
      subject: user.id,
    };
    // create jwt and return
    return this.jwtService.sign({ user }, config);
  }

  protected async generateRefreshToken(
    user: UserToken,
    expiresIn = this.authConfig.refreshTokenExp,
  ) {
    // Check if token entity exists on the basis of user_id.
    let tokenEntity = await this.refreshRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    // if not then create a new one.
    if (!tokenEntity) {
      const entity = this.refreshRepo.create();
      entity.user = plainToClass(User, { id: user.id });
      tokenEntity = await this.refreshRepo.save(entity);
    }
    // Sign the options
    const config: JwtSignOptions = {
      jwtid: tokenEntity.id,
      subject: user.id,
      expiresIn,
    };
    // create jwt and return
    return this.jwtService.signAsync({}, config);
  }

  protected async generateAccessTokenFromRefreshToken(encoded: string) {
    // resolve refresh token  (eg. if token is revoked? etc.)
    const { user } = await this.resolveRefreshToken(encoded);
    // generate accessToken
    const accessToken = this.generateAccessToken(user);
    return { user, accessToken };
  }

  protected async resolveRefreshToken(encodedRefreshToken: string) {
    // decode the token
    const refreshToken = (await this.jwtService.decode(encodedRefreshToken)) as AnyObject;
    // If refresh token not found
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token Malformed');
    }
    if (Math.floor(Date.now() / 1000) > refreshToken.exp) {
      throw new UnauthorizedException('Refresh Token Expired');
    }
    // find token entity
    const tokenId = refreshToken.jti;
    const token = await this.refreshRepo.findOne(tokenId, {
      relations: ['user'],
    });
    if (!token) {
      throw new UnauthorizedException('Refresh Token Not Found');
    }
    // if revoked, return unauthorized 401
    if (token.isRevoked) {
      throw new UnauthorizedException('Refresh Token Revoked');
    }
    const user = plainToClass(UserToken, token.user, { excludeExtraneousValues: true });
    return { user, token };
  }
}
