import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TokenService } from '../../../services';
import { useAppDispatch, useAppSelector } from '../../../store';
import { AuthThunks } from '../../../store/thunks';
import { OverlayLoading } from '../../generic';

const Startup = props => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector(state => state.generic.loader);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    if (accessToken || refreshToken) {
      setTimeout(() => {
        dispatch(AuthThunks.whoAmI())
          .unwrap()
          .catch(() => {
            navigate('/login');
            TokenService.clearTokenPayload();
          })
          .finally(() => {
            setLoading(false);
          });
      }, 10);
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {loading ? (
        <OverlayLoading open={loading} />
      ) : (
        <>
          {props.children}
          <OverlayLoading open={isLoading} />
        </>
      )}
    </>
  );
};

export default Startup;
