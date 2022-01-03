import { Redirect, Route, RouteProps } from 'react-router-dom';

interface IGuard extends RouteProps {
  canActivate: () => boolean;
  fallbackRoute: () => string;
}

const Guard: React.FC<IGuard> = ({
  component: Component,
  canActivate,
  fallbackRoute,
  path,
  ...routeProps
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <Route
      {...routeProps}
      render={props =>
        canActivate() ? <Component {...props} /> : <Redirect to={{ pathname: fallbackRoute() }} />
      }
    />
  );
};

export default Guard;
