import type { IServiceRequest } from '.';

export interface ICart extends IServiceRequest {
  quantity: number;
}
