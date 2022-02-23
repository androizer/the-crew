import { UsbOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerBanner } from '../../../assets/images/register';
import { authApi, serviceApi, userAddressApi } from '../../services';
import { RegisterForm } from '../register/register';
import { getInitialState } from '../register/register.helper';
import { CreateServiceForm } from '../service-create/service-create';
import { AddAddressForm } from '../user-address/user-address';
import style from './register-as-professional.module.scss';

import type { RegisterAsProfessionalDTO, ServiceDTO } from '../../types';

const steps = ['Professional Details', 'Address Details', 'Service Details'];

export default function RegisterAsProfessional() {
  const theme = useTheme();
  const smView = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [registerDetails, setRegisterDetails] = useState<RegisterAsProfessionalDTO>(
    getInitialState(),
  );
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const ref = useRef(null);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleComplete = async () => {
    if (activeStep === totalSteps() - 1) {
      // call backend api's
      try {
        setLoading(true);
        const { user, address } = registerDetails;
        const service = ref.current.getValue() as ServiceDTO;
        const { data: userPayload } = await authApi.register(user);
        const addressDTO = { ...address, userId: userPayload.id, isDefault: true };
        const serviceDTO = {
          ...service,
          providerId: userPayload.id,
          type: [service.type],
          included: service.included.filter(value => !!value),
          excluded: service.excluded.filter(value => !!value),
        };
        await Promise.all([userAddressApi.createOne(addressDTO), serviceApi.createOne(serviceDTO)]);
        setLoading(false);
        navigate('/login');
      } catch (error) {
        if (error.message) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    } else {
      if (ref.current.isValidated()) {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
      }
    }
  };

  const renderActiveComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <RegisterForm
            ref={ref}
            isEmbedded={true}
            initialValues={registerDetails.user}
            onClose={payload => {
              registerDetails.user = payload;
              setRegisterDetails(registerDetails);
            }}
          />
        );
      case 1:
        return (
          <AddAddressForm
            ref={ref}
            isEmbedded={true}
            initialValues={Object.assign({}, registerDetails.address, { isDefault: true })}
            onClose={payload => {
              registerDetails.address = payload;
              setRegisterDetails(registerDetails);
            }}
          />
        );
      default:
        return (
          <CreateServiceForm
            ref={ref}
            isEmbedded={true}
            initialValues={registerDetails.service}
            onClose={payload => {
              registerDetails.service = payload;
              setRegisterDetails(registerDetails);
            }}
          />
        );
    }
  };

  return (
    <Grid container flex={1} flexDirection={smView ? 'column' : 'row'}>
      <Grid
        item
        container
        xs
        justifyContent="center"
        alignItems="center"
        padding={2}
        className={style['login-banner']}
        style={{ backgroundImage: `url(${registerBanner})` }}
      >
        <Typography variant={!smView ? 'h2' : 'h4'} color="white">
          Register as Professional
        </Typography>
      </Grid>
      <Grid item container xs flexDirection="column" rowSpacing={3} padding={2} margin={0}>
        <Stepper alternativeLabel activeStep={activeStep} style={{ width: '100%' }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid item container flexDirection="column" flex={1}>
          {renderActiveComponent()}
          <Box
            sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between' }}
          >
            <Button
              color="inherit"
              disabled={isLoading || activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {!isLoading ? (
              <Button color="secondary" onClick={handleComplete}>
                {activeStep === totalSteps() - 1 ? 'Submit' : 'Next'}
              </Button>
            ) : (
              <LoadingButton loading={true} loadingPosition="end" endIcon={<UsbOff />}>
                Submit
              </LoadingButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
