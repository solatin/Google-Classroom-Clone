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
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useNotify } from 'src/hooks/useNotify';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { error, success } = useNotify();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const { id } = useParams();
    const onSubmit = async (form) => {
        try {
            await axiosClient.post('/auth/resetPassword', { newPassword: form.password, id });
            success('Your password has been changed.')
            navigate('/login');
        } catch (e) {
            console.log(e);
            error(e !== undefined ? e.message : 'Reset Failed');
        }
    };
    return (
        <>
            <Helmet>
                <title>Reset Your Password</title>
            </Helmet>
            <Box sx={{ mx: 'auto', my: 'auto', width: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', mt: '100px' }}>
                    <LockIcon color="primary" fontSize="large" />
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Reset Password
                    </Typography>
                    <FormControl error={!!errors.password} variant="standard" fullWidth sx={{ mb: 2 }}>
                        <TextField
                            error={!!errors.password}
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            sx={{ mb: 0 }}
                        />
                        <FormHelperText>{errors.password?.message}</FormHelperText>
                    </FormControl>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        Reset Password
                    </Button>
                    or
                    <Link to="/login">Back to login page</Link>
                </Box>
            </Box>
        </>
    );
};
