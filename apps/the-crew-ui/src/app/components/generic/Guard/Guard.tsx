import { Navigate, Route, RouteProps } from 'react-router-dom';

interface IGuard extends RouteProps {
  canActivate: () => boolean;
  fallbackRoute: () => string;
}

/**
 *
 * @param param
 * @returns React.FC
 * @deprecated This wrapper doesn't work with `react-router` v6+
 */
const Guard: React.FC<IGuard> = ({
  element: Component,
  canActivate,
  fallbackRoute,
  path,
  ...routeProps
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <Route
      {...routeProps}
      element={canActivate() ? Component : <Navigate to={{ pathname: fallbackRoute() }} />}
    />
  );
};

export default Guard;
