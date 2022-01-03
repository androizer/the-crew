import { Cart, User } from '.';

export class PaymentIntentPayload {
  services: Cart[];
  user: User;
}
