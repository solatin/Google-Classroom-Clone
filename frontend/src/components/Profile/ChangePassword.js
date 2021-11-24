import React from 'react';
import authAxios from "src/utils/authAxios";
import { useNavigate } from 'react-router-dom';

import './ChangePassword.css'

const ChangePassword = () => {
    const navigate = useNavigate();
    const handleClick = async () => {
    	const oldPass = document.getElementById("oldPass").value;
    	const newPass = document.getElementById('newPass').value;
    	const info = {
        	'oldPass': oldPass,
        	'newPass': newPass,
    	}

    	await authAxios.post("/changePassword", info);
    	navigate('/classes');
    }
    return (
        <>
            <div className="container2">
                <input className="input1" id="oldPass" placeholder="Nhập mật khẩu cũ"></input>
                <input className="input1" id="newPass" placeholder="Nhập mật khẩu mới"></input>

                <button className="button2" onClick={handleClick}>Đổi mật khẩu</button>
            </div>
        </>

    )
}

export default ChangePassword;