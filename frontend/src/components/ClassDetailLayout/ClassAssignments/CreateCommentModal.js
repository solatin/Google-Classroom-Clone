import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth } from 'src/hooks/useAuth';
import authAxios from 'src/utils/authAxios';
import { useNotify } from 'src/hooks/useNotify';
import React, { useEffect, useState } from 'react';
import { common } from '@mui/material/colors';

const CreateCommentModal = ({ open, handleClose, assignment, reFetch }) => {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const user = useAuth();
    const { error, success } = useNotify();

    const onSubmit = async (data) => {
        setLoading(true);
        await authAxios.post(`/gradeReview/comment`, { id: assignment?.review._id, comment: data.comment });
        console.log(assignment?.gradeStructure._id);
        success('Upload comment success');
        setLoading(false);
        reFetch();
    }
    console.log(assignment);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h5" textAlign="center">Comment on {assignment?.gradeStructure.title} </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Assignment: {assignment?.gradeStructure.title}</Typography>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Current Grade: {assignment?.studentGrade}</Typography>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Expected Grade: {assignment?.review?.student_grade}</Typography>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Explanation: {assignment?.review?.comment[0]?.comment}</Typography>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Comment: </Typography>
                {assignment?.review?.comment?.map((cmt) => <Typography sx={{ display: 'block', mb: 1 }}>{cmt?.user?.display_name}({cmt?.user?.role}): {cmt?.comment} </Typography>)}
                <TextField fullWidth color="secondary" label="Comment" variant="outlined" {...register('comment')} sx={{ display: 'block', mb: 2 }} />

            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={() => {
                        handleClose();
                        handleSubmit(onSubmit)();
                    }}
                    variant="contained"
                >
                    Submit
                </Button>
                <Button onClick={handleClose} autoFocus variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default CreateCommentModal;
