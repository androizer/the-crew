import { Role, ServiceRequestType } from '@the-crew/common/enums';

/**
 * Register Professional DTO
 */
export class RegisterProDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role[];

  constructor(data: Partial<RegisterProDTO> = {}) {
    this.firstName = data.firstName ?? '';
    this.lastName = data.lastName ?? '';
    this.email = data.email ?? '';
    this.phone = data.phone ?? '';
    this.password = data.password ?? '';
    this.confirmPassword = data.confirmPassword ?? '';
    this.role = [Role.PROFESSIONAL];
  }
}

export class ServiceDTO {
  type: ServiceRequestType;
  title: string;
  description: string;
  price: number;
  included: string[];
  excluded: string[];

  constructor(data: Partial<ServiceDTO> = {}) {
    this.type = data.type;
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.price = data.price;
    this.excluded = data.excluded ?? [''];
    this.included = data.included ?? [''];
  }
}

export class AddressDTO {
  fullName: string;
  phone: string;
  flat: string;
  street: string;
  city: string;
  state: string;
  pinCode: number;
  isDefault: boolean; // don't assign any fallback value. it's on purpose.

  constructor(data: Partial<AddressDTO> = {}) {
    this.fullName = data.fullName ?? '';
    this.phone = data.phone ?? '';
    this.flat = data.flat ?? '';
    this.street = data.street ?? '';
    this.city = data.city ?? '';
    this.state = data.state ?? '';
    this.pinCode = data.pinCode;
    this.isDefault = data.isDefault;
  }
}

export class RegisterAsProfessionalDTO {
  user: RegisterProDTO;
  address: AddressDTO;
  service: ServiceDTO;

  constructor() {
    this.user = new RegisterProDTO();
    this.address = new AddressDTO();
    this.service = new ServiceDTO();
  }
}
