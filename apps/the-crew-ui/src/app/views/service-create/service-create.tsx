import { AddCircleOutline, CurrencyRupee, RemoveCircleOutline } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { ServiceRequestType } from '@the-crew/common/enums';
import { FieldArray, Formik, FormikProps } from 'formik';
import { camelCase, startCase } from 'lodash-es';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { array, number, object, string } from 'yup';
import { NumberInput } from '../../components';

import { RegisterAsProfessionalDTO, ServiceDTO } from '../../types';

interface ICreateServiceForm {
  initialValues: RegisterAsProfessionalDTO['service'];
  onClose?: (initialValues: RegisterAsProfessionalDTO['service']) => void;
  /**
   * Either use this element as standalone view component, or embedded component.
   */
  isEmbedded?: boolean;
}

export const CreateServiceForm = forwardRef((props: ICreateServiceForm, ref) => {
  const formikRef = useRef<FormikProps<ServiceDTO>>(null);
  const stateRef = useRef(null);
  stateRef.current = formikRef.current?.values;

  useImperativeHandle(ref, () => {
    return {
      isValidated: () => {
        formikRef.current.handleSubmit();
        const isValid = validationSchema.isValidSync(stateRef.current);
        return isValid;
      },
      getValue: () => {
        return stateRef.current;
      },
    };
  });

  useEffect(() => {
    return () => {
      props.onClose?.(stateRef.current);
    };
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={props.initialValues}
      validationSchema={validationSchema}
      onSubmit={evt => {
        if (!props.isEmbedded) {
          // TODO: logic need to be added
          console.log(evt);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
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
                <Grid item>
                  <Typography align="center" variant="h6">
                    Create new Service
                  </Typography>
                </Grid>
              )}
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth focused={false} error={errors.type && touched.type}>
                    <TextField
                      name="type"
                      select
                      label="Select Type"
                      value={values.type ?? ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {Object.values(ServiceRequestType).map((type, index) => {
                        return (
                          <MenuItem key={index} value={type}>
                            {startCase(camelCase(type))}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <FormHelperText style={{ paddingLeft: '8px' }}>
                      {errors.type && touched.type ? errors.type : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth focused={false} error={errors.title && touched.title}>
                    <OutlinedInput
                      name="title"
                      placeholder="Service Title"
                      type="text"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormHelperText style={{ paddingLeft: '8px' }}>
                      {errors.title && touched.title ? errors.title : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    focused={false}
                    error={errors.description && touched.description}
                  >
                    <OutlinedInput
                      name="description"
                      placeholder="Service description"
                      type="text"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormHelperText style={{ paddingLeft: '8px' }}>
                      {errors.description && touched.description ? errors.description : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item container>
                  <Grid item xs>
                    <Typography variant="body1" marginLeft={1}>
                      Services Included
                    </Typography>
                    <FormGroup>
                      <FieldArray name="included">
                        {({ push, remove }) => {
                          return (
                            <>
                              {values.included.map((item, index) => {
                                return (
                                  <FormControl key={index} fullWidth focused={false}>
                                    <div style={{ display: 'flex', margin: '4px' }}>
                                      <OutlinedInput
                                        fullWidth
                                        name={`included[${index}]`}
                                        placeholder="services included"
                                        value={item}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {index === 0 && (
                                        <IconButton color="primary" onClick={() => push('')}>
                                          <AddCircleOutline />
                                        </IconButton>
                                      )}
                                      {index > 0 && (
                                        <IconButton color="primary" onClick={() => remove(index)}>
                                          <RemoveCircleOutline />
                                        </IconButton>
                                      )}
                                    </div>
                                  </FormControl>
                                );
                              })}
                            </>
                          );
                        }}
                      </FieldArray>
                    </FormGroup>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1" marginLeft={1}>
                      Services Excluded
                    </Typography>
                    <FormGroup>
                      <FieldArray name="excluded">
                        {({ push, remove }) => {
                          return (
                            <>
                              {values.excluded.map((item, index) => {
                                return (
                                  <FormControl key={index} fullWidth focused={false}>
                                    <div style={{ display: 'flex', margin: '4px' }}>
                                      <OutlinedInput
                                        fullWidth
                                        name={`excluded[${index}]`}
                                        placeholder="services excluded"
                                        value={item}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {index === 0 && (
                                        <IconButton color="primary" onClick={() => push('')}>
                                          <AddCircleOutline />
                                        </IconButton>
                                      )}
                                      {index > 0 && (
                                        <IconButton color="primary" onClick={() => remove(index)}>
                                          <RemoveCircleOutline />
                                        </IconButton>
                                      )}
                                    </div>
                                  </FormControl>
                                );
                              })}
                            </>
                          );
                        }}
                      </FieldArray>
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth focused={false} error={errors.price && touched.price}>
                    <TextField
                      name="price"
                      placeholder="Service price"
                      type="text"
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton tabIndex={-1}>
                              <CurrencyRupee />
                            </IconButton>
                          </InputAdornment>
                        ),
                        inputComponent: PriceTextField,
                      }}
                    />
                    <FormHelperText style={{ paddingLeft: '8px' }}>
                      {errors.price && touched.price ? errors.price : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              {!props.isEmbedded && (
                <Grid item>
                  <Button type="submit" variant="contained" color="secondary" fullWidth={true}>
                    Submit
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
});

const PriceTextField = forwardRef((props, ref) => {
  return <NumberInput {...props} getInputRef={ref} />;
});

export default CreateServiceForm;

const validationSchema = object().shape({
  title: string().label('Title').required(),
  description: string().label('Description').required(),
  type: string().label('Service Type').required().oneOf(Object.values(ServiceRequestType)),
  price: number().label('Price').required().integer().positive(),
  included: array().of(string()),
  excluded: array().of(string()),
});
