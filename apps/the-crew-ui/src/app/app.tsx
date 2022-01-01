import { useMediaQuery, useTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import style from './app.module.scss';
import { Footer, Header, Main, Startup } from './components';
import { SnackbarUtilsConfigurator } from './core/services/snackbar-config.service';
import store from './store';
import {
  AboutUs,
  Bookings,
  Home,
  Login,
  NotFound404,
  Register,
  RegisterAsProfessional,
  SearchService,
  ServiceList,
} from './views';

export function App() {
  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        horizontal: xsView ? 'center' : 'right',
        vertical: xsView ? 'bottom' : 'top',
      }}
      autoHideDuration={3000}
    >
      <SnackbarUtilsConfigurator />
      <div className={style.root}>
        <Provider store={store}>
          <Startup>
            <Header />
            <Main>
              <Switch>
                {/* make a protected route hoc */}
                <Route path="/" exact render={() => <Home />} />
                <Route path="/login" exact render={() => <Login />} />
                <Route path="/register" exact render={() => <Register />} />
                <Route
                  path="/register-as-professional"
                  exact
                  render={() => <RegisterAsProfessional />}
                />
                <Route path="/search" exact render={() => <SearchService />} />
                <Route path="/services" exact render={() => <ServiceList />} />
                <Route path="/bookings" exact render={() => <Bookings />} />
                <Route path="/about-us" exact render={() => <AboutUs />} />
                <Route render={() => <NotFound404 />} />
              </Switch>
              <Footer />
            </Main>
          </Startup>
        </Provider>
      </div>
    </SnackbarProvider>
  );
}

export default App;
