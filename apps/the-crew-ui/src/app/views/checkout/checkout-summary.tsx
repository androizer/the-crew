import { Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

import { environment } from '../../../environments/environment';
import { useAppSelector } from '../../store';
import { authSelector, cartSelectors } from '../../store/slices';
import style from './checkout.module.scss';
import SelectedItem from './selected-item';

interface ICheckoutSummary {
  proceedToAddressCallback: () => void;
}

const CheckoutSummary: React.FC<ICheckoutSummary> = props => {
  const cartItems = useAppSelector(state => cartSelectors.selectAll(state.cart));
  const authState = useAppSelector(authSelector);
  const navigate = useNavigate();

  return (
    <>
      <DialogContent dividers className={style['dialog-content']}>
        {cartItems.map((item, index) => (
          <SelectedItem key={index} data={item} />
        ))}
        <div className={style.dividerThick}></div>
        <div className={style.itemSummaryRoot}>
          <div className={style.itemSummary}>
            <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
              Item total
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ₹{' '}
              {cartItems.reduce((acc, item) => {
                acc += item.quantity * item.price;
                return acc;
              }, 0)}
            </Typography>
          </div>
          <div className={style.itemSummary}>
            <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
              Convenience Fees
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ₹ {environment.convenienceFee}
            </Typography>
          </div>
          <Divider />
          <div className={style.itemSummary}>
            <Typography variant="subtitle1" style={{ flexGrow: 1 }}>
              Total
            </Typography>
            <Typography variant="body1">
              ₹{' '}
              {cartItems.reduce((acc, item) => {
                acc += item.quantity * item.price;
                return acc;
              }, environment.convenienceFee)}
            </Typography>
          </div>
        </div>
        <div className={style.dividerThick}></div>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!authState.user) {
              navigate('/login');
            } else {
              props.proceedToAddressCallback();
            }
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
};

export default CheckoutSummary;
