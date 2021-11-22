import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as AuthActions from 'src/actions/auth';

export const Login = () => {
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (form) => {
    try{
      await dispatch(AuthActions.loginRequest(form));
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  } 
  return (
    <>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px'}}>
        <TextField fullWidth  label="Email" variant="outlined" {...register('email')} sx={{mb: 2}}/>
				<TextField fullWidth label="Password" variant="outlined" {...register('password')} sx={{mb: 2}} />
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>Login</Button>
        </Box>
			</Box>
		</>
  );
}