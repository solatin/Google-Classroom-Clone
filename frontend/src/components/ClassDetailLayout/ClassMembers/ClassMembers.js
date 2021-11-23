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
    const [classData, setClassData] = React.useState({});
    const { id } = useParams();

    const fetch = async () => {
        const rs = await authAxios.get(`/class-details/${id}/members`);
        console.log(rs);
        setClassData(rs);
    }

    React.useEffect(() => {
        fetch();
    }, []);

    // const teachers = classData.map((data) => {
    //     <Teachers key={uuidv4()} value={data.name} />
    // })

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

            <Teachers />
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
            <Students />
            <Students />
            <Students />
            <FormInviteModal open={openTeacherForm} handleCloseForm={() => setOpenTeacherForm(false)} teacher={true} classId={id} />
            <FormInviteModal open={openStudentForm} handleCloseForm={() => setOpenStudentForm(false)} teacher={false} classId={id} />
        </div >
    );
}

export default ClassMembers;