import React from 'react';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

import "./Members.css"

const Teachers = () => {
    const [classData, setClassData] = React.useState({});
    const { id } = useParams();

    const fetch = async() => {
        const rs = await authAxios.get(`/class-details/${id}/feed`);
        console.log(rs);
        setClassData(rs);
      }
    
    React.useEffect(() => {
    fetch();
    }, []);

   

    return(
        <div className="teachers">
            <span className="avatar">
                <img src="/static/avatar1.jpg" aria-hidden="true" height="30px" width="30px" alt="" />
            </span>
            <span className="name">{classData.teacher_name}</span>
        </div>
    );
}

export default Teachers;