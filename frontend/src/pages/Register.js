import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axiosClient from 'src/utils/axios';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';

export const Register = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();
	const onSubmit = async (form) => {
		try {
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
					<LockIcon color="primary" fontSize="large" />
					<Typography variant="h4" sx={{ mb: 3 }}>
						Register
					</Typography>
					<FormControl error={!!errors.email} variant="standard" fullWidth sx={{ mb: 2 }}>
						<TextField
							error={!!errors.email}
							fullWidth
							label="Email"
							variant="outlined"
							{...register('email', { required: 'Email is required' })}
							sx={{ mb: 0 }}
						/>
						<FormHelperText>{errors.email?.message}</FormHelperText>
					</FormControl>
					<FormControl error={!!errors.password} variant="standard" fullWidth sx={{ mb: 2 }}>
						<TextField
							error={!!errors.password}
							fullWidth
							label="Password"
							variant="outlined"
							{...register('password', { required: 'Password is required' })}
							sx={{ mb: 0 }}
						/>
						<FormHelperText>{errors.password?.message}</FormHelperText>
					</FormControl>
					<FormControl sx={{ m: 1, minWidth: 80, width: '100%' }}>
						<InputLabel id="demo-simple-select-autowidth-label">Role</InputLabel>
						<Select defaultValue="teacher" fullWidth label="Role" {...register('role')} sx={{ mb: 2 }}>
							<MenuItem value="teacher">Teacher</MenuItem>
							<MenuItem value="student">Student</MenuItem>
						</Select>
					</FormControl>
					<FormControl error={!!errors.display_name} variant="standard" fullWidth sx={{ mb: 2 }}>
						<TextField
							error={!!errors.display_name}
							fullWidth
							label="Name"
							variant="outlined"
							{...register('display_name', { required: 'Name is required' })}
							sx={{ mb: 0 }}
						/>
						<FormHelperText>{errors.display_name?.message}</FormHelperText>
					</FormControl>
					<Button variant="contained" onClick={handleSubmit(onSubmit)}>
						Register
					</Button>
					or
					<Link to="/login">Back to login page</Link>
				</Box>
			</Box>
		</>
	);
};
