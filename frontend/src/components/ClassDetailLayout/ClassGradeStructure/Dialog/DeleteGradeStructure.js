import * as React from 'react';
import authAxios from '../../../../utils/authAxios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useParams } from "react-router-dom";

export default function DeleteGradeStructureDialog({ open, handleCloseDialog, gradeId, loadData }) {
    const { id } = useParams();
    const handleAcceptDialog = async () => {
        await authAxios.post('/gradeStructure/delete', { 'gradeStructureId': gradeId, 'classId': id })
        handleCloseDialog();
        loadData();
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete this part?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAcceptDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
