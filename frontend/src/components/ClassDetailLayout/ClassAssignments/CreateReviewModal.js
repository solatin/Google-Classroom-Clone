import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth } from 'src/hooks/useAuth';
import authAxios from 'src/utils/authAxios';
import { useNotify } from 'src/hooks/useNotify';
import React, { useEffect, useState } from 'react';

const CreateReviewModal = ({ open, handleClose, assignment, reFetch }) => {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const user = useAuth();
    const { error, success } = useNotify();

    const onSubmit = async (data) => {
        setLoading(true);
        await authAxios.post(`/gradeReview/add`, { gradeStructureId: assignment?.gradeStructure._id, grade: data.grade, explanation: data.explain, classId: assignment?.gradeStructure.class_id });
        console.log(assignment?.gradeStructure._id);
        success('Upload review success');
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
                <Typography variant="h5" textAlign="center">Create new grade review</Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Assignment: {assignment?.gradeStructure.title}</Typography>
                <Typography variant="h6" textAlign="left" sx={{ display: 'block', mb: 1 }}>Current Grade: {assignment?.studentGrade}</Typography>
                <TextField fullWidth color="secondary" label="Expected Grade" variant="outlined" {...register('grade')} sx={{ display: 'block', mb: 2 }} />
                <TextField fullWidth color="secondary" label="Explanation" variant="outlined" {...register('explain')} sx={{ display: 'block', mb: 2 }} />
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
        </Dialog>
    );
};

export default CreateReviewModal;
