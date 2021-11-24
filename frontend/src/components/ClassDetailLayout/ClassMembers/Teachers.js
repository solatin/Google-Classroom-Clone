import React from 'react';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

import "./Members.css"

const Teachers = ({teacher_name}) => {
    return (
        <div className="members">
            <span className="avatar">
                <img src="/static/avatar1.jpg" aria-hidden="true" height="30px" width="30px" alt="" />
            </span>
            <span className="name">{teacher_name}</span>
        </div>
    );
}

export default Teachers;