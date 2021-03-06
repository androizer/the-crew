import { Email, Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material';
import { Role } from '@the-crew/common/enums';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { object, string } from 'yup';

import { loginBanner } from '../../../assets/images/login';
import { environment } from '../../../environments/environment';
import { useAppDispatch } from '../../store';
import { authSelector } from '../../store/slices';
import { googleLogin, login } from '../../store/thunks';
import style from './login.module.scss';

import type { LoginGoogleUserDTO } from '@the-crew/common';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [guestLogging, setGuestLogging] = useState(false);
  const authState = useSelector(authSelector);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user) {
      navigate('/');
    }
  }, [authState.user]);

  const onGoogleLoginSuccess = (resp: GoogleLoginResponse) => {
    const { profileObj } = resp;
    const payload: LoginGoogleUserDTO = {
      email: profileObj.email,
      firstName: profileObj.givenName,
      lastName: profileObj.familyName,
      role: [Role.USER],
      meta: {
        googleId: profileObj.googleId,
        imgUrl: profileObj.imageUrl,
      },
    };
    dispatch(googleLogin(payload))
      .unwrap()
      .catch(err => {
        enqueueSnackbar(err.message ?? 'Something went wrong!', { variant: 'error' });
      });
  };

  const onGoogleLoginFailure = error => {
    enqueueSnackbar(error.message ?? 'Something went wrong!', { variant: 'error' });
  };

  const loginAsGuest = () => {
    setGuestLogging(true);
    dispatch(login({ email: environment.guestUsername, password: environment.guestPassword }))
      .unwrap()
      .catch(() => {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      })
      .finally(() => setGuestLogging(false));
  };

  return (
    <div className={style.root} style={{ backgroundImage: `url(${loginBanner})` }}>
      <Paper elevation={16} className={style['root-paper']}>
        <Grid container direction="column" rowSpacing={2}>
          <Grid item style={{ textAlign: 'center' }}>
            <Typography variant="h6">Login</Typography>
          </Grid>
          <Grid item>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={values => {
                dispatch(login(values))
                  .unwrap()
                  .catch(err => {
                    if (err.status === 401) {
                      enqueueSnackbar('Invalid Credentials!', {
                        variant: 'error',
                      });
                    }
                  });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form
                  noValidate
                  onSubmit={evt => {
                    evt.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <FormControl
                        fullWidth
                        focused={true}
                        error={errors.email && touched.email && !guestLogging}
                      >
                        <OutlinedInput
                          fullWidth
                          required
                          name="email"
                          placeholder="Email"
                          autoFocus={true}
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={authState.isLoading}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton edge="end" tabIndex={-1}>
                                <Email />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText style={{ paddingLeft: '8px' }}>
                          {errors.email && touched.email && !guestLogging ? errors.email : ' '}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl
                        fullWidth
                        focused={false}
                        error={errors.password && touched.password && !guestLogging}
                      >
                        <OutlinedInput
                          fullWidth
                          required
                          name="password"
                          placeholder="Password"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={authState.isLoading}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText style={{ paddingLeft: '8px' }}>
                          {errors.password && touched.password && !guestLogging
                            ? errors.password
                            : ' '}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      {authState.isLoading && !guestLogging ? (
                        <LoadingButton
                          fullWidth
                          loadingPosition="end"
                          variant="contained"
                          loading={true}
                          endIcon={<LoginIcon />}
                        >
                          Logging..
                        </LoadingButton>
                      ) : (
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          color="secondary"
                          disabled={!!(errors.email || errors.password)}
                          endIcon={<LoginIcon />}
                        >
                          Submit
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
          {environment.guestUsername && environment.guestPassword ? (
            <>
              <Grid item>
                <Typography variant="body2" textAlign="center">
                  or
                </Typography>
              </Grid>
              <Grid item>
                <LoadingButton
                  fullWidth
                  disabled={authState.isLoading}
                  type="button"
                  variant="contained"
                  color="info"
                  endIcon={<SupervisedUserCircleIcon />}
                  loading={guestLogging}
                  loadingPosition="end"
                  onClick={loginAsGuest}
                >
                  Login as Guest
                </LoadingButton>
              </Grid>
            </>
          ) : null}
          <Grid item>
            <Divider />
          </Grid>
          <Grid item alignSelf="center" width="100%">
            <GoogleLogin
              disabled={authState.isLoading}
              clientId={environment.googleClientId}
              className={style['google-login-btn']}
              buttonText="Sign in with Google"
              cookiePolicy="single_host_origin"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFailure}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

const loginSchema = object().shape({
  email: string().label('Email').required().email(),
  password: string().label('Password').required(),
});
