import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";

const NotificationCommentField = ({
  blogId,
  blogAuthor,
  index = undefined,
  replyingTo = undefined,
  setIsReplying,
  notificationId,
  notificationData,
}) => {
  const [comment, setComment] = useState("");

  const { _id: userId } = blogAuthor;
  const {
    user: { token },
  } = useContext(UserContext);
  const {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const handleComment = async () => {
    try {
      const { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/comments",
        data: {
          blogId,
          blogAuthor: userId,
          content: comment,
          replyingTo,
          notificationId,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setIsReplying(false);

      results[index].reply = { comment, _id: data.comment._id };
      setNotifications({ ...notifications, results });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Toaster />

      <textarea
        value={comment}
        placeholder="Leave a comment..."
        onChange={(e) => setComment(e.target.value)}
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>

      <button onClick={handleComment} className="btn-dark mt-5 px-10 ">
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
