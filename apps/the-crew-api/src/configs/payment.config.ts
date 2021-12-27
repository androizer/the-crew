import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  stripeSecretKey: process.env.NX_STRIPE_PRIVATE_KEY,
}));
