import React from 'react';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

import "./ClassMember.css"
import Teachers from "./Teachers"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Students from "./Students"
import { Grid } from '@mui/material';
import FormInviteModal from 'src/containers/FormInviteModal';
import { useState } from 'react';

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 2,
            width: 500
        }}
    />
);

const ClassMembers = () => {
    const [openTeacherForm, setOpenTeacherForm] = useState(false);
    const [openStudentForm, setOpenStudentForm] = useState(false);
    const [classTeacherData, setClassTeacherData] = React.useState([]);
    const [classStudentData, setClassStudentData] = React.useState([]);
    const { id } = useParams();

    const fetch = async () => {
        const classID = { 'classId': id };
        const rs = await authAxios.post(`/class-details/members`, classID);
        console.log(rs.listStudent)
        setClassTeacherData(rs.listTeacher);
        setClassStudentData(rs.listStudent);
    }



    React.useEffect(() => {
        fetch();
    }, []);

    return (
        <div className="container">
            <Grid container className="contain">
                <Grid item xs='11' className="title">
                    Giáo viên
                </Grid>
                <Grid item xs='1' className="class__icon">
                    <IconButton sx={{ mr: 2 }} onClick={() => setOpenTeacherForm(true)}>
                        <AddIcon />
                    </IconButton>
                </Grid>
                <ColoredLine color="#1967d2" />
            </Grid>
            {classTeacherData.map(item => <Teachers teacher_name={item.display_name} />)}

            <Grid container className="contain">
                <Grid item xs='11' className="title">
                    Bạn học
                </Grid>
                <Grid item xs='1' className="class__icon">
                    <IconButton sx={{ mr: 2 }} onClick={() => setOpenStudentForm(true)}>
                        <AddIcon />
                    </IconButton>
                </Grid>

                <ColoredLine color="#1967d2" />
            </Grid>
            {classStudentData.map((item) => (<Students name={item.display_name} classId={id} studentClassId={item.student_class_id} canChange={item.can_change} />))}
            <FormInviteModal open={openTeacherForm} handleCloseForm={() => setOpenTeacherForm(false)} teacher={true} classId={id} />
            <FormInviteModal open={openStudentForm} handleCloseForm={() => setOpenStudentForm(false)} teacher={false} classId={id} />
        </div >
    );
}

export default ClassMembers;