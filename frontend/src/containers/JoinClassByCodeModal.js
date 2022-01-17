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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './style.css';

const JoinClassByCodeModal = ({ open, handleClose }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	const onSubmit = async (form) => {
		handleClose();
		console.log('join class code: ', form.classCode);
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
