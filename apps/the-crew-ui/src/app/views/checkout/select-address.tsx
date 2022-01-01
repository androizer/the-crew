import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { CartSessionService, PaymentApi } from '../../services';
import { useAppDispatch, useAppSelector } from '../../store';
import { authSelector, cartSelectors, userAddressSelectors } from '../../store/slices';
import { userAddressThunks } from '../../store/thunks';
import { AddressDTO } from '../../types';
import { AddAddressForm } from '../user-address/user-address';
import style from './checkout.module.scss';
import SavedAddress from './saved-addresses';

import type { UserAddress, uuid } from '@the-crew/common';

interface ISelectAddresses {
  setDialogTitle?: (value: string) => void;
}

const SelectAddress: React.FC<ISelectAddresses> = props => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  const addressState = useAppSelector(state => state.userAddresses);
  const authState = useAppSelector(authSelector);
  const savedAddresses = useAppSelector(state =>
    userAddressSelectors.selectAll(state.userAddresses),
  );
  const cartItems = useAppSelector(state => cartSelectors.selectAll(state.cart));
  const [selectedAddress, setSelectedAddress] = useState<uuid>(null);
  const [isAddressValid, setAddressValid] = useState(false);

  useEffect(() => {
    props.setDialogTitle?.('Addresses');
  }, []);

  useEffect(() => {
    savedAddresses.some(address => {
      if (address.isDefault) {
        setSelectedAddress(address.id);
        return true;
      }
      return false;
    });
  }, [savedAddresses]);

  const handlePayment = () => {
    CartSessionService.setCartItems(cartItems);
    const dto = {
      cartItems: cartItems.map(({ quantity, id }) => ({ serviceId: id, quantity })),
    };
    PaymentApi.createPaymentSession(dto).then(res => {
      window.location.href = res.url;
    });
  };

  return (
    <>
      <DialogContent dividers className={style['dialog-content']}>
        {savedAddresses?.length ? (
          <RadioGroup
            value={selectedAddress}
            onChange={e => {
              setSelectedAddress(e.target.value);
            }}
          >
            {savedAddresses.map((address, index) => (
              <SavedAddress key={index} address={address} />
            ))}
          </RadioGroup>
        ) : (
          <Grid container flexDirection="column" justifyContent="center" alignItems="center">
            <HomeWorkIcon color="disabled" style={{ fontSize: '96px' }} />
            <Typography variant="h6">No Addresses Found</Typography>
          </Grid>
        )}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography>Add New Address</Typography>
              <LoadingButton
                loading={addressState.loading}
                variant="outlined"
                color="primary"
                onClick={evt => {
                  evt.stopPropagation();
                  const addressDto = ref.current.getValue() as Partial<UserAddress>;
                  addressDto.userId = authState.user.id;
                  if (!savedAddresses.length) {
                    addressDto.isDefault = true;
                  }
                  dispatch(userAddressThunks.createUserAddress({ payload: addressDto }))
                    .unwrap()
                    .then(() => {
                      ref.current.formik.resetForm?.();
                    });
                }}
                endIcon={<SaveIcon />}
                disabled={!isAddressValid}
              >
                Save
              </LoadingButton>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <AddAddressForm
              ref={ref}
              initialValues={new AddressDTO(savedAddresses.length ? {} : { isDefault: true })}
              isEmbedded={true}
              onValidChange={isValid => {
                setAddressValid(isValid);
              }}
            ></AddAddressForm>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedAddress === null}
          onClick={() => {
            if (!authState.user) {
              history.push('/login');
            } else {
              handlePayment();
            }
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
};

export default SelectAddress;
