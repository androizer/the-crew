import { Role } from '../enums';

import type { IOwnerTimestamp, IServiceRequest, IUserAddress, uuid } from '.';

export type UserMeta = {
  googleId: string;
  imgUrl: string;
};

export interface IUser extends IOwnerTimestamp {
  id: uuid;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string | null;
  phone: string | null;
  role: Role[];
  addresses: IUserAddress[];
  services: IServiceRequest[];
  meta: Partial<UserMeta>;
}
