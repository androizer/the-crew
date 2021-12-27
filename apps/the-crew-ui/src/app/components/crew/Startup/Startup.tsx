import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';

import { TokenService } from '../../../services';
import { useAppDispatch } from '../../../store';
import { loadTokensAtStartup } from '../../../store/slices';
import { AuthThunks } from '../../../store/thunks';
import { OverlayLoading } from '../../generic';

const Startup = withRouter(props => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // check for token
  useEffect(() => {
    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    if (accessToken || refreshToken) {
      dispatch(loadTokensAtStartup({ accessToken, refreshToken }));
      setTimeout(() => {
        setLoading(true);
        dispatch(AuthThunks.whoAmI())
          .unwrap()
          .then(() => {
            setLoading(false);
          });
      }, 10);
    } else {
      setLoading(false);
    }
  }, [dispatch]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{loading ? <OverlayLoading open={loading} /> : props.children}</>
  );
});

export default Startup;
