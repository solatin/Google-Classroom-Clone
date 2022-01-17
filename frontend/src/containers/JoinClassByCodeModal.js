import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormHelperText,
	TextField,
	Typography
} from '@mui/material';
import * as ClassListActions from 'src/actions/classList';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import authAxios from 'src/utils/authAxios';
import { useDispatch } from 'react-redux';
import './style.css';

const JoinClassByCodeModal = ({ open, handleClose }) => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	const onSubmit = async (form) => {
		handleClose();
		await authAxios.post('/class/joinByCode', { code: form.classCode });
		dispatch(ClassListActions.fetchRequest());
	};

	useEffect(() => {
		reset();
	}, [open]);
	return (
		<Dialog open={open} maxWidth="sm" fullWidth onClose={handleClose}>
			<DialogTitle id="alert-dialog-title">
				<Typography variant="h5" textAlign="center">
					Join New Class
				</Typography>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<FormControl error={!!errors.classCode} fullWidth>
					<TextField
						error={!!errors.classCode}
						fullWidth
						label="Class Code"
						variant="outlined"
						{...register('classCode', { required: 'Code is required' })}
						sx={{ display: 'block', mb: 2 }}
					/>
					<FormHelperText>{errors.classCode?.message}</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions sx={{ p: 3, pt: 0 }}>
				<Button onClick={handleSubmit(onSubmit)} variant="contained">
					Join
				</Button>
				<Button onClick={handleClose} autoFocus variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default JoinClassByCodeModal;
