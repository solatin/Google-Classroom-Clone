import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import "./Members.css"
import authAxios from "src/utils/authAxios";

import { useNotify } from 'src/hooks/useNotify';

const Students = ({ name, classId, studentClassId, canChange, accountId }) => {
    const [studentClassID, setStudentClassID] = useState(studentClassId);
    const { error, success } = useNotify();
    const submitField = async () => {
        try {
            const infoChange = { 'classId': classId, 'studentClassID': studentClassID, 'accountId': accountId };
            await authAxios.post(`/studentClass/ChangeStudentClassID`, infoChange);
            success('Change ID success');
        } catch (e) {
            error('Change ID failed');
        }
    }
    return (
        <div className='student'>
            <div className="members">
                <span className="avatar">
                    <img src="/static/avatar1.jpg" aria-hidden="true" height="30px" width="30px" alt="" />
                </span>
                <span className="name">{name}</span>
            </div>
            {canChange === true ? (<div className="submitField">
                <TextField
                    id="standard-basic"
                    className='textField'
                    label='MSSV'
                    value={studentClassID}
                    variant="standard"
                    size="small"
                    onChange={(e) => setStudentClassID(e.target.value)}>
                </TextField>
                <Button color='primary' onClick={submitField}>OK</Button>
            </div>) : <div>MSSV - {studentClassID} </div>}

        </div>

    );
}

export default Students;