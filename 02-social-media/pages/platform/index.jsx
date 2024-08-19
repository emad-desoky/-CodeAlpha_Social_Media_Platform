// import ChatDialog from "@/components/chat/ChatDialog";
import Navbar from "@/components/navbar/Navbar";
import Posts from "@/components/posts/Posts";
import Sidebar from "@/components/sidebar/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Platform() {

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    axios.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, [refetch]);

  useEffect(() => {
    axios.get("/api/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, [refetch]);

  useEffect(() => {
    axios.get("/api/comments")
      .then(res => setComments(res.data))
      .catch(err => console.log(err));
  }, [refetch]);


  return (
    <>
      {refetch || !refetch ? 
      (
        <div className="flex h-screen">
          <Sidebar setRefetch={setRefetch} className="fixed top-0 left-0 w-1/4 h-full bg-gray-900 text-white" />

          <div className="flex-1 ml-1/4 overflow-y-auto">
            <Navbar />
            <Posts posts={posts} users={users} comments={comments}  setRefetch={setRefetch} />
          </div>
        </div>
    ) : <></>}
      {/* <ChatDialog /> Positioned outside main content */}
    </>
  );
}
