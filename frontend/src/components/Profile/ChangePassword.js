import React from 'react';

import './ChangePassword.css'

const handleClick = () => {
    //to do
}

const ChangePassword = () => {
    return (
        <>
            <div className="container2">
                <br/>
                <input placeholder="Nhập mật khẩu cũ"></input>
                <input placeholder="Nhập mật khẩu mới"></input>
                <input placeholder="Nhập lại mật khẩu mới"></input>
                <button className="button2" onClick={handleClick}>Đổi mật khẩu</button>
            </div>
        </>
        
    )
}

export default ChangePassword;