import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  RadioGroup,
  Typography,
} from '@mui/material';
import { uuid } from '@the-crew/common/types';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { CartSessionService } from '../../services';
import { useAppDispatch, useAppSelector } from '../../store';
import { authSelector, cartSelectors, userAddressSelectors } from '../../store/slices';
import { CreatePaymentSession } from '../../store/thunks';
import { userAddressThunks } from '../../store/thunks/user-address.thunk';
import style from './checkout.module.scss';
import StripeContainer from './payment/stripe-container';
import SavedAddress from './saved-addresses';

interface IAddressProps {
  onClose: (e) => void;
}

const SelectAddress: React.FC<IAddressProps> = props => {
  const [selectedAddress, setSelectedAddress] = useState<uuid>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const savedAddresses = useAppSelector(state =>
    userAddressSelectors.selectAll(state.userAddresses),
  );
  const loading = useAppSelector(state => state.userAddresses.loading);
  const authState = useAppSelector(authSelector);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => cartSelectors.selectAll(state.cart));

  const handlePayment = () => {
    CartSessionService.setCartItems(cartItems);
    dispatch(CreatePaymentSession({ services: cartItems, user: authState.user }))
      .then(res => {
        setClientSecret(res.payload['client_secret']);
        console.log(res.payload['client_secret']);
      })
      .then(() => setShowPaymentDialog(true));
  };
  useEffect(() => {
    dispatch(
      userAddressThunks.getUserAddresses({
        join: [{ field: 'user' }],
        filter: [
          {
            field: 'userId',
            operator: '$eq',
            value: `{${authState.user.id}}`,
          },
        ],
      }),
    );
  }, [authState.user.id, dispatch]);

  const onClose = (paid: boolean) => {
    setShowPaymentDialog(!paid);
    props.onClose(paid);
  };

  return (
    <>
      <Typography variant="h6" textAlign="center">
        Select Address
      </Typography>
      <DialogContent dividers className={style['dialog-content']}>
        <RadioGroup
          value={selectedAddress}
          onChange={e => {
            setSelectedAddress(e.target.value);
          }}
        >
          {savedAddresses.map((item, index) => (
            <SavedAddress key={index} address={item} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          color="primary"
          disabled={selectedAddress !== null}
          onClick={() => {
            //handleCreateNewAddress();
            console.log();
          }}
        >
          Add New Address
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedAddress === null}
          onClick={() => {
            handlePayment();
            //setShowPaymentDialog(true);
          }}
        >
          Next
        </Button>
        <Dialog open={showPaymentDialog} maxWidth="md" fullWidth={true}>
          <DialogTitle className={style.dialogTitle}>
            <div className={style['dialog-header']}>
              <Typography variant="h6" lineHeight={2}>
                Pay Amount
              </Typography>
              <IconButton
                color="inherit"
                onClick={() => {
                  onClose(true);
                }}
              >
                <Close />
              </IconButton>
            </div>
          </DialogTitle>
          <StripeContainer
            clientSecret={clientSecret}
            onClose={_paymentStatus => onClose(_paymentStatus)}
          />
        </Dialog>
      </DialogActions>
    </>
  );
};
export default SelectAddress;
