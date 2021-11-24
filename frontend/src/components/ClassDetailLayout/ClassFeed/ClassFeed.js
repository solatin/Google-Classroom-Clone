import { IconButton } from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
// import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";
import Announcement from "./Announcement";
// import { auth, db } from "../firebase";
import "./ClassFeed.css";

const handlePostAnnouncement = () => {
  // to do
}

function ClassFeed() {
  const [classData, setClassData] = useState({});
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posts, setPosts] = useState([]);
  // const [user, loading, error] = React.useAuthState(requireAuth);
  const { id } = useParams();
  // const history = useHistory();

  const fetch = async () => {
    const classID = { 'classId': id };
    const rs = await authAxios.post(`/class-details/feed`, classID);
    setClassData(rs);
  }

  useEffect(() => {
    // reverse the array  
    // let reversedArray = classData?.posts?.reverse();
    // setPosts(reversedArray);

    fetch();
  }, []);

  //   const createPost = async () => {
  //     try {
  //       const myClassRef = await db.collection("classes").doc(id).get();
  //       const myClassData = await myClassRef.data();
  //       console.log(myClassData);
  //       let tempPosts = myClassData.posts;
  //       tempPosts.push({
  //         authorId: user.uid,
  //         content: announcementContent,
  //         date: moment().format("MMM Do YY"),
  //         image: user.photoURL,
  //         name: user.displayName,
  //       });
  //       myClassRef.ref.update({
  //         posts: tempPosts,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       alert(`There was an error posting the announcement, please try again!`);
  //     }
  //   };
  //   useEffect(() => {
  //     db.collection("classes")
  //       .doc(id)
  //       .onSnapshot((snapshot) => {
  //         const data = snapshot.data();
  //         if (!data) history.replace("/");
  //         console.log(data);
  //         setClassData(data);
  //       });
  //   }, []);
  //   useEffect(() => {
  //     if (loading) return;
  //     if (!user) history.replace("/");
  //   }, [loading, user]);

  return (
    <div className="class">
      <div className="class__nameBox">
        {/* <div className="class__name">{classData.name}</div> */}
        <div className="class_code">Mã lớp: {classData.code}</div>
        <div className="teacher_name">{classData.teacher_name}</div>
        <div className="class__name">{classData.name}</div>
      </div>
      <div className="class__announce">
        {/* <img src={user?.photoURL} alt="My image" /> */}
        <input
          type="text"
          value={announcementContent}
          onChange={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
        />
        <IconButton onClick={handlePostAnnouncement}>
          <SendOutlined />
        </IconButton>
      </div>
      {posts?.map((post) => (
        <Announcement
          authorId={post.authorId}
          content={post.content}
          date={post.date}
          image={post.image}
          name={post.name}
        />
      ))}
    </div>
  );
}
export default ClassFeed;