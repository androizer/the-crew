import { Abc, Apartment, LocationCity, Phone, PinDrop, Traffic } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AnyObject } from '@the-crew/common';
import { ServiceLocation } from '@the-crew/common/enums';
import { isBoolean, isNumber } from 'class-validator';
import { useFormik } from 'formik';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { number, object, string } from 'yup';

import { NumberInput } from '../../components';
import { authSelector } from '../../store/slices';
import { AddressDTO, RegisterAsProfessionalDTO } from '../../types';
import style from '../login/login.module.scss';

interface IUserAddressForm {
  initialValues: RegisterAsProfessionalDTO['address'];
  onClose?: (initialValues: RegisterAsProfessionalDTO['address']) => void;
  /**
   * Either use this element as standalone view component, or embedded component.
   */
  isEmbedded?: boolean;
  onValidChange?: (value: boolean) => void;
}

const UserAddressWrapper: React.FC<IUserAddressForm> = props => {
  const authState = useSelector(authSelector);
  const navigate = useNavigate();

  if (authState.user) {
    navigate('/services');
  }

  return (
    <div className={style.root}>
      <AddAddressForm initialValues={props.initialValues} isEmbedded={false} />
    </div>
  );
};

export const AddAddressForm = forwardRef<unknown, IUserAddressForm>((props, ref) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, resetForm } =
    useFormik({
      initialValues: props.initialValues ?? ({} as AddressDTO),
      validationSchema: validationSchema,
      onSubmit: evt => {
        if (!props.isEmbedded) {
          // TODO: logic need to be added
          console.log(evt);
        }
      },
    });
  const stateRef = useRef(null);
  stateRef.current = values;

  useImperativeHandle(ref, () => {
    return {
      isValidated: () => {
        handleSubmit();
        const isValid = validationSchema.isValidSync(values);
        return isValid;
      },
      getValue: () => {
        const value: RegisterAsProfessionalDTO['address'] = stateRef.current;
        value.phone = `+91-${value.phone}`;
        return value;
      },
      formik: {
        resetForm,
      },
    };
  });

  useEffect(() => {
    return () => {
      props.onClose?.(stateRef.current);
    };
  }, []);

  useEffect(() => {
    const anyTouched = Object.values(touched).some(bool => bool);
    props.onValidChange?.(anyTouched && isValid);
  }, [isValid]);

  return (
    <form
      noValidate
      style={{ flex: 1 }}
      onSubmit={evt => {
        evt.preventDefault();
        handleSubmit();
      }}
    >
      <Grid container direction="column" spacing={4}>
        {!props.isEmbedded && (
          <Grid item xs={1}>
            <Typography align="center" variant="h6">
              Enter Address Details
            </Typography>
          </Grid>
        )}
        <Grid item container spacing={2} xs={12}>
          {isBoolean(values.isDefault) ? (
            <Grid item xs={12}>
              <FormControl focused={false}>
                <FormControlLabel
                  control={<Switch />}
                  label="Set as default"
                  checked={values.isDefault}
                  onChange={evt => {
                    evt.persist();
                    handleChange({
                      ...evt,
                      target: { name: 'isDefault', value: (evt.target as any).checked },
                    });
                  }}
                ></FormControlLabel>
              </FormControl>
            </Grid>
          ) : null}
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.fullName && touched.fullName}>
              <OutlinedInput
                name="fullName"
                placeholder="Full Name"
                type="text"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" tabIndex={-1}>
                      <Abc />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.fullName && touched.fullName ? errors.fullName : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.phone && touched.phone}>
              <TextField
                label="Mobile"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" tabIndex={-1}>
                        <Phone />
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputComponent: PhoneTextField,
                  inputProps: {
                    prefix: '+91',
                  },
                }}
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.phone && touched.phone ? errors.phone : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.flat && touched.flat}>
              <OutlinedInput
                name="flat"
                placeholder="Apartment No:"
                type="text"
                value={values.flat}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" tabIndex={-1}>
                      <Apartment />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.flat && touched.flat ? errors.flat : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.street && touched.street}>
              <OutlinedInput
                name="street"
                placeholder="Street/Colony"
                type="text"
                value={values.street}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" tabIndex={-1}>
                      <Traffic />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.street && touched.street ? errors.street : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.city && touched.city}>
              <OutlinedInput
                name="city"
                placeholder="City"
                type="text"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" tabIndex={-1}>
                      <LocationCity />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.city && touched.city ? errors.city : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.state && touched.state}>
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                required
                label="State"
                value={values.state ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {Object.values(ServiceLocation)
                  .sort()
                  .map((loc, index) => {
                    return (
                      <MenuItem key={index} value={loc}>
                        {loc}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.state && touched.state ? errors.state : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.pinCode && touched.pinCode}>
              <TextField
                name="pinCode"
                placeholder="Pincode"
                type="text"
                value={values.pinCode}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" tabIndex={-1}>
                        <PinDrop />
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputComponent: PriceTextField,
                }}
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.pinCode && touched.pinCode ? errors.pinCode : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        {!props.isEmbedded && (
          <Grid item>
            <Button variant="contained" color="secondary" fullWidth={true}>
              Submit
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
});

const PriceTextField = forwardRef((props, ref) => {
  return <NumberInput {...props} getInputRef={ref} format="######" />;
});

const PhoneTextField = forwardRef<unknown, AnyObject>((props, ref) => {
  return (
    <NumberInput
      {...props}
      getInputRef={ref}
      format={`(${props.prefix}) #####-#####`}
      mask="_"
    ></NumberInput>
  );
});

export default UserAddressWrapper;

const validationSchema = object().shape({
  fullName: string().required().label('Full Name'),
  phone: string()
    .label('Mobile')
    .required()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      { message: 'Enter a valid mobile number' },
    ),
  flat: string().required().label('Flat'),
  street: string().required().label('Street'),
  city: string().required().label('City'),
  state: string().required().label('State'),
  pinCode: number()
    .required()
    .label('Pin Code')
    .test('len', 'Please enter a valid pin code', value =>
      isNumber(value) ? value.toString().length === 6 : false,
    ),
});
