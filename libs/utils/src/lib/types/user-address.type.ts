import { IOwnerTimestamp } from '.';
import { User } from '../models';
import { uuid } from './util.types';

export type IUserAddress = {
  id: uuid;
  fullName: string;
  phone: string;
  flat: string;
  street: string;
  city: string;
  pinCode: number;
  isDefault: boolean;
  user?: User;
  userId: uuid;
} & IOwnerTimestamp;
