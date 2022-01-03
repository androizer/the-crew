import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import { ServiceRequestType } from '@the-crew/common/enums';
import { useState } from 'react';
import CheckoutSummary from './checkout-summary';

import style from './checkout.module.scss';
import SelectAddress from './select-address';

interface ICheckOutProps {
  open: boolean;
  onClose: () => void;
  professionType: ServiceRequestType;
}

const CheckOut: React.FC<ICheckOutProps> = props => {
  const [openDialog, setOpenDialog] = useState(props.open);
  const [showAddresses, setShowAddresses] = useState(false);

  return (
    <Dialog open={openDialog} maxWidth="md" fullWidth={true}>
      <DialogTitle className={style.dialogTitle}>
        <div className={style['dialog-header']}>
          <Typography variant="h6" lineHeight={2}>
            {props.professionType}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              setOpenDialog(false);
              props.onClose();
            }}
          >
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      {!showAddresses && (
        <CheckoutSummary
          proceedToAddressCallback={() => {
            setShowAddresses(true);
          }}
        />
      )}
      {showAddresses && (
        <SelectAddress
          onClose={paid => {
            setOpenDialog(!paid);
          }}
        />
      )}
    </Dialog>
  );
};

export default CheckOut;
