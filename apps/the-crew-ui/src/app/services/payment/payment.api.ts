import { axiosInstance } from '../../core/services';

const basePath = 'payment';
const instance = axiosInstance;

function CreatePaymentIntent(data) {
  const url = `${basePath}/create-payment-intent`;
  return instance.post(url, data);
}

export const PaymentService = {
  CreatePaymentIntent,
};

export { CreatePaymentIntent };
