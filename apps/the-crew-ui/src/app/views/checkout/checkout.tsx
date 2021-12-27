import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import { ServiceRequestType } from '@the-crew/common/enums';
import { camelCase, startCase } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import { cartSelectors } from '../../store/slices';

import CheckoutSummary from './checkout-summary';
import style from './checkout.module.scss';
import SelectAddress from './select-address';

enum ViewIndex {
  CHECKOUT = 1,
  SELECT_ADDRESS,
}

interface ICheckOutProps {
  open: boolean;
  onClose: () => void;
  professionType: ServiceRequestType;
}

const CheckOut: React.FC<ICheckOutProps> = props => {
  const [openDialog, setOpenDialog] = useState(props.open);
  const [dialogTitle, setDialogTitle] = useState<string>(props.professionType);
  const [viewIndex, setViewIndex] = useState(ViewIndex.CHECKOUT);
  const cartItems = useAppSelector(state => cartSelectors.selectAll(state.cart));

  useEffect(() => {
    if (viewIndex === ViewIndex.CHECKOUT) {
      setDialogTitle(props.professionType);
    }
  }, [viewIndex]);

  useEffect(() => {
    if (!cartItems.length) {
      closeDialog();
    }
  }, [cartItems]);

  const closeDialog = () => {
    setOpenDialog(false);
    props.onClose();
  };

  return (
    <Dialog open={openDialog} maxWidth="sm" fullWidth={true}>
      <DialogTitle className={style.dialogTitle}>
        <div className={style['dialog-header']}>
          <Typography variant="h6" lineHeight={2}>
            {startCase(camelCase(dialogTitle))}
          </Typography>
          <IconButton color="inherit" onClick={closeDialog}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      {viewIndex === ViewIndex.SELECT_ADDRESS ? (
        <SelectAddress setDialogTitle={setDialogTitle} />
      ) : (
        <CheckoutSummary
          proceedToAddressCallback={() => {
            setViewIndex(ViewIndex.SELECT_ADDRESS);
          }}
        />
      )}
    </Dialog>
  );
};

export default CheckOut;
