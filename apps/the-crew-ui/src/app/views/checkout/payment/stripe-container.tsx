import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from './payment-form';

const stripeTestPromise = loadStripe(process.env.NX_STRIPE_PUBLIC_KEY);

interface IPaymentProps {
  clientSecret: string;
  onClose: (e) => void;
}

const StripeContainer: React.FC<IPaymentProps> = props => {
  const options = {
    clientSecret: props.clientSecret,
  };
  return (
    <Elements stripe={stripeTestPromise} options={options}>
      <PaymentForm
        clientSecret={props.clientSecret}
        onClose={_paymentStatus => props.onClose(_paymentStatus)}
      />
    </Elements>
  );
};
export default StripeContainer;
