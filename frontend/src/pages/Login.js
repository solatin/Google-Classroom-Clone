import { Box, Button, TextField, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import * as AuthActions from 'src/actions/auth';
import axiosClient from 'src/utils/axios';
import LockIcon from '@mui/icons-material/Lock';

export const Login = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const dispatch = useDispatch();
	const onSubmit = async (form) => {
		try {
			await dispatch(AuthActions.loginRequest(form));
			navigate('/');
		} catch (e) {
			console.log(e);
		}
	};

	const handleLogin = async (googleData) => {
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
		}
	};

	return (
		<>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px' }}>
          <LockIcon color="primary" fontSize="large"/>
          <Typography variant="h4" sx={{mb: 3}}>Login</Typography>
					<TextField fullWidth label="Email" variant="outlined" {...register('email')} sx={{ mb: 2 }} />
					<TextField fullWidth label="Password" variant="outlined" {...register('password')} sx={{ mb: 2 }} />
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
						<Link to="/register" style={{marginLeft: '5px'}}>Register</Link>
					</Box>
				</Box>
			</Box>
		</>
	);
};
