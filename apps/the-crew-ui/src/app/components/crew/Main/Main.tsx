import { Role } from '@the-crew/common/enums';
import { Route, Switch } from 'react-router-dom';

import { Footer } from '..';
import { Guard } from '../..';
import { useAppSelector } from '../../../store';
import { authSelector } from '../../../store/slices';
import {
  AboutUs,
  Bookings,
  Dashboard,
  Home,
  Login,
  NotFound404,
  RegisterAsProfessional,
  SearchService,
  ServiceList,
} from '../../../views';

const Main: React.FC = () => {
  const { user: currentUser } = useAppSelector(authSelector);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Switch>
        <Guard
          canActivate={() => {
            return currentUser ? !currentUser.role.includes(Role.PROFESSIONAL) : true;
          }}
          fallbackRoute={() => {
            return '/dashboard';
          }}
          exact
          path="/"
          component={Home}
        />
        <Route path="/" exact render={() => <Home />} />
        <Route path="/login" exact render={() => <Login />} />
        {/* <Route path="/register" exact render={() => <Register />} /> */}
        <Route path="/register-as-professional" exact render={() => <RegisterAsProfessional />} />
        <Route path="/search" exact render={() => <SearchService />} />
        <Route path="/services" exact render={() => <ServiceList />} />
        <Guard
          canActivate={() => {
            return !!currentUser;
          }}
          fallbackRoute={() => '/'}
          exact
          path="/bookings"
          component={Bookings}
        />
        {/* <Route path="" exact render={() => <Bookings />} /> */}
        <Route path="/about-us" exact render={() => <AboutUs />} />
        <Guard
          canActivate={() => {
            return currentUser?.role.includes(Role.PROFESSIONAL);
          }}
          fallbackRoute={() => {
            return '/';
          }}
          exact
          component={Dashboard}
          path="/dashboard"
        />
        <Route render={() => <NotFound404 />} />
      </Switch>
      <Footer />
    </div>
  );
};

export default Main;
