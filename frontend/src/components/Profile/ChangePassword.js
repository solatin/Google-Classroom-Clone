import React from 'react';

import './ChangePassword.css'

const handleClick = () => {
    //to do
}

const ChangePassword = () => {
    return (
        <>
            <div className="container">
                <br/>
                <input placeholder="Nhập mật khẩu cũ"></input>
                <input placeholder="Nhập mật khẩu mới"></input>
                <input placeholder="Nhập lại mật khẩu mới"></input>
                <button className="button" onClick={handleClick}>Đổi mật khẩu</button>
            </div>
        </>
        
    )
}

export default ChangePassword;