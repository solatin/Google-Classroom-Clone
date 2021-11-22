import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import './style.css'
import { TextField, Grid, DialogActions, Button } from '@mui/material';
import { ReactComponent as CopySvg } from '../Icons/copy_icon.svg'



const FormInviteModal = ({ open, handleCloseForm }) => {
    const [email, setEmail] = useState("");
    const linkUrl = "Link copy to url"
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(linkUrl);
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
                    <Button color='primary' disabled={email.length === 0}>Tạo</Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default FormInviteModal
