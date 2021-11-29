import * as React from 'react';
import authAxios from '../../../../utils/authAxios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditGradeStructureDialog({ open, handleCloseDialog, curTitle, curGrade, gradeId, loadData }) {
    const [title, setTitle] = React.useState(curTitle);
    const [grade, setGrade] = React.useState(curGrade);

    const handleEditDialog = async () => {
        await authAxios.post('/updateGradeStructure', { 'gradeStructure': { 'title': title, 'grade': grade, 'Id': gradeId } })
        handleCloseDialog();
        loadData()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Grade"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleEditDialog}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
