
import authAxios from 'src/utils/authAxios';
import { useParams } from "react-router-dom";
import { Dialog, DialogActions, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

const ActivateAccount = () => {
    const { id } = useParams();
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCalled, setIsCalled] = useState(false);
    const navigate = useNavigate();


    const activateAccount = async () => {
        setLoading(true);
        await authAxios.get(`/auth/activate?id=${id}`);
        setOpenForm(true);
        setLoading(false);
    }
    useEffect(() => {
        if (!isCalled) {
            activateAccount();
            setIsCalled(true);
        }
    })

    const handleClose = () => {
        setOpenForm(false);
        navigate('/classes');
    }

    return (
        <Box sx={{ margin: "auto", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            {loading && <ReactLoading type="spinningBubbles" color='#b6d7a8' height={100} width={100} />}
            <Dialog open={openForm} maxWidth="lg" onClose={handleClose} className='form__dialog'>
                <div className="class__title">
                    Thành công
                </div>
                <div className="class__content">
                    Bạn đã kích hoạt tài khoản thành công.
                </div>
                <DialogActions>
                    <Button color='primary' onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ActivateAccount