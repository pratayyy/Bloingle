import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";
import { BlogContext } from "../pages/Blog";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setIsReplying,
}) => {
  const {
    user: { token },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      _id: blogId,
      author: { _id: blogAuthor },
      activity,
      activity: { totalComments, totalParentComments },
      comments,
      comments: { results: commentArr },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [comment, setComment] = useState("");

  const handleComment = async () => {
    try {
      const { data } = await axios({
        method: "POST",
        url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/comments",
        data: {
          blogId,
          blogAuthor,
          content: comment,
          replyingTo,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (data.status === "success")
        toast.success(`${action[0].toUpperCase() + action.slice(1)} added`);

      setComment("");

      let newCommentArr;

      if (replyingTo) {
        commentArr[index].children.push(data.comment._id);

        data.comment.childrenLevel = commentArr[index].childrenLevel + 1;
        data.comment.parentIndex = index;

        commentArr[index].isReplyLoaded = true;

        // [1, 2, 3] -> [2 => 4] -> [1, 2, , 3] -> [1, 2, 4, 3]
        commentArr.splice(index + 1, 0, data.comment);

        newCommentArr = commentArr;

        setIsReplying(false);
      } else {
        data.comment.childrenLevel = 0;

        newCommentArr = [data.comment, ...commentArr];
      }

      const parentCommentIncrementValue = replyingTo ? 0 : 1;

      setBlog({
        ...blog,
        comments: { ...comments, results: newCommentArr },
        activity: {
          ...activity,
          totalComments: totalComments + 1,
          totalParentComments:
            totalParentComments + parentCommentIncrementValue,
        },
      });

      setTotalParentCommentsLoaded(
        (previousValue) => previousValue + parentCommentIncrementValue
      );
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
        {action}
      </button>
    </>
  );
};

export default CommentField;
