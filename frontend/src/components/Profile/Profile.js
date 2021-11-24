import React from 'react';
import { Navigate  } from 'react-router'
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";
import { useNavigate } from 'react-router-dom';

import './Profile.css'

const Profile = () => {
    const [profileData, setProfileData] = React.useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const fetch = async() => {
        const rs = await authAxios.get(`/profile`);
        console.log(rs);
        setProfileData(rs);
    }

    React.useEffect(() => {
        fetch();
      }, []);

    const handleClick = () => {
        navigate('/changePassword');
    }

    return(
        <>
            <div class="container">
                <h1>Profile</h1>
                <img src="https://i.ibb.co/pdJfzx9/profile-picture.jpg" alt="profile-picture" border="0" />
                <h4></h4>
                <h4>Họ và tên: {profileData.display_name}</h4> 
                <h4>Email: {profileData.email}</h4>
                <button className="button" onClick={handleClick}>Change Password</button>
            </div>
        </>
    )
}

export default Profile;