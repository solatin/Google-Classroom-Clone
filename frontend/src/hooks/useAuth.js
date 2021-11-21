import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as AuthActions from 'src/actions';
import * as UserSelectors from 'src/selectors/user';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(UserSelectors.getAuthUser);
  const loading = useSelector(UserSelectors.getAuthLoading);
  const error = useSelector(UserSelectors.getAuthError);

  const onLogin = useCallback(
    async (formData) => {
      try {
        const rs = await dispatch(AuthActions.loginRequest(formData));
        dispatch(AuthActions.loginSuccess(rs));
        navigate('/app/dashboard', { replace: true });
      } catch (e) {
        dispatch(AuthActions.loginFailure(e.message));
      }
    },
    [dispatch, navigate]
  );

  const onLogout = useCallback(() => {
    dispatch(AuthActions.logoutRequest());
  }, [dispatch]);

  return {
    user,
    error,
    loading,
    onLogin,
    onLogout
  };
};

export const requireAuth = (NewComponent) => (props) => {
  const navigate = useNavigate();
  const user = useSelector(UserSelectors.getAuthUser);

  console.log('user:', user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  return !!user && <NewComponent {...props} />;
};
