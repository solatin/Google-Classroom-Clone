import {
    Button,
    FormControl,
    FormHelperText,
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
import { useNotify } from 'src/hooks/useNotify';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { error, success } = useNotify();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const onSubmit = async (form) => {
        try {
            await axiosClient.post('/auth/forgotPassword', form);
            success('Go to your email to reset password.')
            navigate('/login');
        } catch (e) {
            console.log(e);
            error(e !== undefined ? e.message : 'Process Failed');
        }
    };
    return (
        <>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px' }}>
                    <LockIcon color="primary" fontSize="large" />
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Forgot Password
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
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        Send Email
                    </Button>
                    or
                    <Link to="/login">Back to login page</Link>
                </Box>
            </Box>
        </>
    );
};
