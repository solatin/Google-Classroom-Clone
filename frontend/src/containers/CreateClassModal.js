import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as ClassListActions from 'src/actions/classList';

export const CreateClassModal = ({ open, handleClose }) => {
	const { register, handleSubmit } = useForm();
	const dispatch = useDispatch();
	const onSubmit = (newClass) => {
		dispatch(ClassListActions.createRequest(newClass));
	}
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
				<TextField fullWidth  color="secondary" label="Class Name" variant="outlined" {...register('name')} sx={{display: 'block', mb: 2}}/>
				<TextField fullWidth color="secondary" label="Teacher Name" variant="outlined" {...register('teacher_name')} />
			</DialogContent>
			<DialogActions sx={{p: 3, pt: 0}}>
				<Button
					onClick={() => {
						handleClose();
						handleSubmit(onSubmit)();
					}}
          variant="contained"
				>
					Create
				</Button>
				<Button onClick={handleClose} autoFocus variant="outlined">
					Cancle
				</Button>
			</DialogActions>
		</Dialog>
	);
};
