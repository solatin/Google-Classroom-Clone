import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormHelperText, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import * as ClassListActions from 'src/actions/classList';

export const CreateClassModal = ({ open, handleClose }) => {
	const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
	const dispatch = useDispatch();
	const onSubmit = (newClass) => {
		dispatch(ClassListActions.createRequest(newClass));
		handleClose();
		clearErrors();
	}
	useEffect(() => {
		clearErrors();
	}, [open]);
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				<Typography variant="h5" textAlign="center">Create new class</Typography>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<TextField fullWidth label="Class Name" variant="outlined" {...register('name', { required: 'Name is required' })} sx={{ display: 'block', mb: 2 }} />
				<FormHelperText error>{errors.name?.message}</FormHelperText>
				{/* <TextField fullWidth color="secondary" label="Teacher Name" variant="outlined" {...register('teacher_name')} /> */}
			</DialogContent>
			<DialogActions sx={{ p: 3, pt: 0 }}>
				<Button
					onClick={() => {
						handleSubmit(onSubmit)();
					}}
					variant="contained"
				>
					Create
				</Button>
				<Button onClick={handleClose} autoFocus variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
