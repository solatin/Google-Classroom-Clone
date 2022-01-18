import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	TextField,
	Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth } from 'src/hooks/useAuth';
import authAxios from 'src/utils/authAxios';
import { useNotify } from 'src/hooks/useNotify';
import React, { useEffect, useState, useRef } from 'react';
import { common } from '@mui/material/colors';

export const TeacherReviewModal = ({ open, handleClose, assignmentName, id, refetch }) => {
	const ref = useRef(null);
	const [review, setReview] = useState(null);
	const onSubmit = async () => {
		await authAxios.get(`/gradeReview/markAsDone?id=${id}`);
		handleClose();
		refetch();
	};

	const onSendComment = async (data) => {
		await authAxios.post(`/gradeReview/comment`, { id, comment: ref.current.value });
		ref.current.value = '';
		fetch();
	};
	const fetch = async () => {
		const rs = await authAxios.get(`/gradeReview/detail?id=${id}`);
		setReview(rs);
	};
	useEffect(() => {
		fetch();
	}, [id]);
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				<Typography variant="h5" textAlign="center">
					Request review of {review?.comment[0].user.display_name}
				</Typography>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>
					Assignment: {assignmentName}
				</Typography>
				<Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>
					Current Grade: {review?.current_grade}
				</Typography>
				<Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>
					Expected Grade: {review?.student_expect_grade}
				</Typography>
				<Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>
					Explanation:{review?.comment[0].comment}
				</Typography>
				<Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>
					Comment:
				</Typography>
				{review?.comment?.map((cmt) => (
					<Typography sx={{ display: 'block', mb: 1 }}>
						{cmt?.user?.display_name}({cmt?.user?.role}): {cmt?.comment}{' '}
					</Typography>
				))}
				<TextField
					inputRef={ref}
					fullWidth
					color="secondary"
					label="Comment"
					variant="outlined"
					InputProps={{
						endAdornment: (
							<IconButton onClick={() => onSendComment()}>
								<SendIcon />
							</IconButton>
						)
					}}
					sx={{ display: 'block', mb: 2 }}
				/>
			</DialogContent>
			<DialogActions sx={{ p: 3, pt: 0 }}>
				<Button onClick={() => onSubmit()} variant="contained">
					Resolve review
				</Button>
				<Button onClick={handleClose} autoFocus variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
