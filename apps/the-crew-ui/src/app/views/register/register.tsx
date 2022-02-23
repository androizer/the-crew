import { Abc, Email, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { AnyObject } from 'immer/dist/internal';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { object, ref, string } from 'yup';
import { NumberInput } from '../../components';

import { authSelector } from '../../store/slices';
import { RegisterAsProfessionalDTO, RegisterProDTO } from '../../types';
import style from '../login/login.module.scss';

interface IRegisterForm {
  initialValues: RegisterAsProfessionalDTO['user'];
  onClose?: (initialValues: RegisterAsProfessionalDTO['user']) => void;
  /**
   * Either use this element as standalone view component, or embedded component.
   */
  isEmbedded?: boolean;
}

export default function Register() {
  const authState = useSelector(authSelector);
  const navigate = useNavigate();
  const [userDto] = useState(new RegisterProDTO());

  if (authState.user) {
    navigate('/services');
  }

  return (
    <div className={style.root}>
      <Paper
        elevation={16}
        className={style['root-paper']}
        style={{
          height: '500px',
          width: '600px',
        }}
      >
        <RegisterForm initialValues={userDto} isEmbedded={false} />
      </Paper>
    </div>
  );
}

export const RegisterForm = forwardRef((props: IRegisterForm, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: props.initialValues ?? ({} as RegisterProDTO),
    validationSchema,
    onSubmit: evt => {
      if (!props.isEmbedded) {
        // TODO: logic need to be added
        console.log(evt);
      }
    },
  });
  const stateRef = useRef<RegisterProDTO>(null);
  stateRef.current = values;

  useImperativeHandle(ref, () => {
    return {
      isValidated: () => {
        handleSubmit();
        const isValid = validationSchema.isValidSync(values);
        return isValid;
      },
      getValue: () => {
        const value: RegisterAsProfessionalDTO['user'] = stateRef.current;
        value.phone = `+91-${value.phone}`;
        return value;
      },
    };
  });

  useEffect(() => {
    return () => {
      props.onClose?.(stateRef.current);
    };
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      style={{ flex: 1 }}
      noValidate
      onSubmit={evt => {
        evt.preventDefault();
        handleSubmit();
      }}
    >
      <Grid container direction="column" rowSpacing={4}>
        {!props.isEmbedded && (
          <Grid item xs={1}>
            <Typography align="center" variant="h6">
              Register
            </Typography>
          </Grid>
        )}
        <Grid item container spacing={2} xs={11}>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.firstName && touched.firstName}>
              <OutlinedInput
                name="firstName"
                placeholder="First Name"
                type="text"
                value={values.firstName}
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
                {errors.firstName && touched.firstName ? errors.firstName : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.lastName && touched.lastName}>
              <OutlinedInput
                name="lastName"
                placeholder="Last Name"
                type="text"
                value={values.lastName}
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
                {errors.lastName && touched.lastName ? errors.lastName : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth focused={false} error={errors.email && touched.email}>
              <OutlinedInput
                name="email"
                placeholder="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" tabIndex={-1}>
                      <Email />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.email && touched.email ? errors.email : ' '}
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
            <FormControl fullWidth focused={false} error={errors.password && touched.password}>
              <OutlinedInput
                name="password"
                placeholder="Password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.password && touched.password ? errors.password : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              focused={false}
              error={errors.confirmPassword && touched.confirmPassword}
            >
              <OutlinedInput
                name="confirmPassword"
                placeholder="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{ paddingLeft: '8px' }}>
                {errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ' '}
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

const validationSchema = object().shape({
  firstName: string().label('First Name').required(),
  lastName: string().label('Last Name').required(),
  email: string().label('Email').required().email(),
  phone: string()
    .label('Mobile')
    .required()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      { message: 'Enter a valid mobile number' },
    ),
  password: string().label('Password').required(),
  confirmPassword: string()
    .label('Confirm Password')
    .required()
    .oneOf([ref('password'), null], 'Passwords must match'),
});
