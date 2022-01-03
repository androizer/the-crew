import { useMediaQuery, useTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import style from './app.module.scss';
import { Header, Main, Startup } from './components';
import { SnackbarUtilsConfigurator } from './core/services/snackbar-config.service';
import store from './store';

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
            <Main />
            {/* Footer  included in Main component itself */}
          </Startup>
        </Provider>
      </div>
    </SnackbarProvider>
  );
}

export default App;
