import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axiosClient from 'src/utils/axios';

export const Register = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const onSubmit = async (form) => {
    try{
		  await axiosClient.post('/auth/register', form);
			navigate('/login');
    } catch (e) {
      console.log(e);
    }
	};
	return (
		<>
			<Helmet>
				<title>Register</title>
			</Helmet>
			<Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px' }}>
					<TextField fullWidth label="Email" variant="outlined" {...register('email')} sx={{ mb: 2 }} />
					<TextField fullWidth label="Password" variant="outlined" {...register('password')} sx={{ mb: 2 }} />
					<FormControl sx={{ m: 1, minWidth: 80, width: '100%' }}>
						<InputLabel id="demo-simple-select-autowidth-label">Role</InputLabel>
						<Select fullWidth label="Role" {...register('role')} sx={{ mb: 2 }}>
							<MenuItem value="teacher">Teacher</MenuItem>
							<MenuItem value="student">Student</MenuItem>
						</Select>
					</FormControl>
					<Button variant="contained" onClick={handleSubmit(onSubmit)}>
						Register
					</Button>
				</Box>
			</Box>
		</>
	);
};
