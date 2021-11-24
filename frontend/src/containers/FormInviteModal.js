import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import './style.css'
import { TextField, Grid, DialogActions, Button } from '@mui/material';
import { ReactComponent as CopySvg } from '../Icons/copy_icon.svg'
import authAxios from 'src/utils/authAxios';



const FormInviteModal = ({ open, handleCloseForm, teacher, classId }) => {
    const [email, setEmail] = useState("");
    const linkUrl = "http://localhost:3000/acceptInvite/" + classId
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(linkUrl);
    }

    const sendInvitation = async () => {
        handleCloseForm();
        const invitation = { 'email': email, 'classId': classId }
        await authAxios.post('/sendInvite', invitation);
    }
    return (
        <Dialog open={open} maxWidth="lg" onClose={handleCloseForm} className="form__dialog" aria-labelledby="customized-dialog-title">
            <div className="form">
                <div className="class__title">
                    Mời học viên
                </div>
                <div className="class__content">
                    <div className="content__title">
                        Đường liên kết mời
                    </div>
                    <Grid container>
                        <Grid item xs='11' className="class__text">
                            {linkUrl}
                        </Grid>
                        <Grid item xs='1' className="class__icon">
                            <CopySvg width={20} height={20} onClick={() => copyToClipBoard()}></CopySvg>
                        </Grid>
                    </Grid>
                </div>
                <div className="form__inputs">
                    <TextField id="filled-basic"
                        label='Email (required)'
                        className="form__input"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </TextField>
                </div>
                <DialogActions>
                    <Button onClick={handleCloseForm}>Hủy</Button>
                    <Button color='primary' disabled={email.length === 0} onClick={sendInvitation}>Tạo</Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default FormInviteModal
