import React from 'react';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

import './ChangePassword.css'

const handleClick = () => {
    //to do
}

const ChangePassword = () => {
    return (
        <>
            <div className="container2">
                <input className="input1" placeholder="Nhập mật khẩu cũ"></input>
                <input className="input1" placeholder="Nhập mật khẩu mới"></input>
                <input className="input1" placeholder="Nhập lại mật khẩu mới"></input>
                <button className="button2" onClick={handleClick}>Đổi mật khẩu</button>
            </div>
        </>
        
    )
}

export default ChangePassword;