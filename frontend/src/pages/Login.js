import LockIcon from '@mui/icons-material/Lock';
import { Box, Button, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import * as AuthActions from 'src/actions/auth';
import axiosClient from 'src/utils/axios';
import { useNotify } from 'src/hooks/useNotify';

export const Login = () => {
	const navigate = useNavigate();
	const { error, success } = useNotify();
	const { register, handleSubmit, formState: { errors } } = useForm();
	const dispatch = useDispatch();
	const onSubmit = async (form) => {
		try {
			await dispatch(AuthActions.loginRequest(form));
			navigate('/');
		} catch (e) {
			console.log(e);
			error(e.message);
		}
	};

	const handleLogin = async (googleData) => {
		console.log('google data', googleData);
		try {
			const rs = await axiosClient.post('/auth/google', {
				token: googleData.tokenId
			});
			localStorage.setItem('access-token', rs.jwtAccessToken);
			localStorage.setItem('refresh-token', rs.jwtRefreshToken);
			dispatch(AuthActions.loginSuccess(rs));
			navigate('/');
		} catch (e) {
			console.log(e);
			error(e.message);
		}
	};
	return (
		<>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px' }}>
					<LockIcon color="primary" fontSize="large" />
					<Typography variant="h4" sx={{ mb: 3 }}>
						Login
					</Typography>
					<FormControl error={!!errors.email} variant="standard" fullWidth sx={{ mb: 2 }}>
						<TextField error={!!errors.email} fullWidth label="Email" variant="outlined" {...register('email', { required: 'Email is required' })} sx={{ mb: 0 }} />
						<FormHelperText>{errors.email?.message}</FormHelperText>
					</FormControl>

					<FormControl error={!!errors.password} variant="standard" fullWidth sx={{ mb: 2 }}>
						<TextField error={!!errors.password} type="password" fullWidth label="Password" variant="outlined" {...register('password', { required: 'Password is required' })} sx={{ mb: 0 }} />
						<FormHelperText>{errors.password?.message}</FormHelperText>
					</FormControl>
					<Button variant="contained" onClick={handleSubmit(onSubmit)}>
						Login
					</Button>
					or
					<GoogleLogin
						clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
						buttonText="Log in with Google"
						onSuccess={handleLogin}
						onFailure={handleLogin}
						cookiePolicy={'single_host_origin'}
					/>
					<Box component="span" sx={{ mt: 2 }}>
						Don&apos;t have an account yet?
						<Link to="/register" style={{ marginLeft: '5px' }}>
							Register
						</Link>
					</Box>
					<Box sx={{ mt: 2 }}>
						Do you forgot your password?
					</Box>
					<Link to="/forgotPassword" style={{ marginLeft: '5px' }}>
						Forgot Password
					</Link>
				</Box>
			</Box>
		</>
	);
};
