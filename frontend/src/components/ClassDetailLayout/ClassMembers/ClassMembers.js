import React from 'react';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";
import { v4 as uuidv4 } from 'uuid';

import "./ClassMember.css"

import Teachers from "./Teachers"
import Students from "./Students"

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
    const [classData, setClassData] = React.useState({});
    const { id } = useParams();

    const fetch = async() => {
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

    return(
        <div className="container">
            <h2 className="title">
                Giáo viên
                <ColoredLine color="#1967d2" />
            </h2>
            <Teachers />

            <h2 className="title">
                Bạn học
                <ColoredLine color="#1967d2" />
            </h2>
            <Students />
            <Students />
            <Students />
        </div>
    );
}

export default ClassMembers;