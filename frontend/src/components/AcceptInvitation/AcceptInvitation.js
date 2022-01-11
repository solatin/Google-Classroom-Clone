
import authAxios from 'src/utils/authAxios';
import { useParams } from "react-router-dom";
import { Dialog, DialogActions, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireAuth } from 'src/hooks/useAuth';

const AcceptInvite = () => {
    const { id } = useParams();
    const [openForm, setOpenForm] = useState(true);
    const navigate = useNavigate();


    const acceptInvite = async () => {
        const classID = { 'classId': id };
        await authAxios.post('/class/acceptInvite/', classID);
    }
    useEffect(() => {
        acceptInvite();
    })

    const handleClose = () => {
        setOpenForm(false);
        navigate('/classes');
    }

    return (
        <Dialog open={openForm} maxWidth="lg" onClose={handleClose} className='form__dialog'>
            <div className="class__title">
                Thành công
            </div>
            <div className="class__content">
                Bạn đã tham gia vào lớp học thành công.
            </div>
            <DialogActions>
                <Button color='primary' onClick={handleClose}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}

export default requireAuth(AcceptInvite)