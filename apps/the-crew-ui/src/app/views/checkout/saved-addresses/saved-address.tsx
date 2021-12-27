import { Delete } from '@mui/icons-material';
import { Grid, IconButton, Paper, Radio, Typography } from '@mui/material';
import { UserAddress } from '@the-crew/common';
import { memo } from 'react';

import { useAppSelector } from '../../../store';

interface ISavedAddress {
  address: UserAddress;
}

const SavedAddress: React.FC<ISavedAddress> = ({ address }) => {
  const currentUser = useAppSelector(state => state.auth.user);
  return (
    <Paper variant="outlined">
      <Grid container padding="16px">
        <Grid item>
          <Radio value={address.id} />
        </Grid>
        <Grid item xs sx={{ paddingLeft: 1 }}>
          <Typography variant="body1">{currentUser.fullName}</Typography>
          <Typography variant="body2" color="GrayText">
            {address.flat}
          </Typography>
          <Typography variant="body2" color="GrayText">
            {address.street + (address.city ? `, ${address.city}` : '')}
          </Typography>
          <Typography variant="subtitle2" color="GrayText">
            {address.pinCode}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton color="warning" disabled>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default memo(SavedAddress);
