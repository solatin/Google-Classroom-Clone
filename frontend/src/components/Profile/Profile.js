import React from 'react';
import { Navigate  } from 'react-router'
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

import './Profile.css'

const handleClick = () => {
    // <Navigate to="/changePassword"/>
}

const Profile = () => {
    const [profileData, setProfileData] = React.useState({});
    const { id } = useParams();

    // const fetch = async() => {
    //     const rs = await authAxios.get(`/profile`);
    //     console.log(rs);
    //     setProfileData(rs);
    // }

    // React.useEffect(() => {
    //     fetch();
    //   }, []);

    return(
        <>
            <div class="container">
                <h1>Profile</h1>
                <img src="https://i.ibb.co/pdJfzx9/profile-picture.jpg" alt="profile-picture" border="0" />
                <h4></h4>
                <h4>Họ và tên: Trần Thanh Quang</h4> 
                <h4>Email: queng@gmail.com</h4>
                <h4>Mã số sinh viên: 18120230</h4> 
                {/* {profileData.display_name}
                {profileData.email}
                {profileData.mssv} */}
                <button className="button" onClick={handleClick}>Change Password</button>
            </div>
        </>
    )
}

export default Profile;