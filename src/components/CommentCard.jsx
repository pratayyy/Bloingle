import { useContext, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { getDay } from "../common/Date";
import CommentField from "./CommentField";
import { UserContext } from "../App";
import { BlogContext } from "../pages/Blog";

const CommentCard = ({ index, leftValue, commentData }) => {
  const {
    user: {
      token,
      data: { username },
    },
  } = useContext(UserContext);

  const {
    _id,
    commentedBy: {
      personalInfo: { name, username: commentedByUsername, photo },
    },
    commentedAt,
    content,
    children,
  } = commentData;

  const {
    blog,
    blog: {
      comments,
      comments: { results: commentArr },
      author: {
        personalInfo: { username: blogAuthorUsername },
      },
      activity,
      activity: { totalParentComments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [isReplying, setIsReplying] = useState(false);

  const getParentIndex = () => {
    let startingPoint = index - 1;

    try {
      while (
        commentArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }

    return startingPoint;
  };

  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentArr[startingPoint]) {
      while (
        commentArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentArr.splice(startingPoint, 1);

        if (!commentArr[startingPoint]) break;
      }
    }

    if (isDelete) {
      const parentIndex = getParentIndex();

      if (parentIndex !== undefined) {
        commentArr[parentIndex].children = commentArr[
          parentIndex
        ].children.filter((child) => child !== _id);

        if (commentArr[parentIndex].children.length) {
          commentArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentArr.splice(index, 1);
    }

    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalParentCommentsLoaded((previousValue) => previousValue - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentArr },
      activity: {
        ...activity,
        totalParentComments:
          totalParentComments -
          (commentData.childrenLevel === 0 && isDelete ? 1 : 0),
      },
    });
  };

  const loadReplies = async ({ skip = 0 }) => {
    if (children.length) {
      hideReplies();

      try {
        const { data } = await axios({
          method: "GET",
          url:
            import.meta.env.VITE_SERVER_DOMAIN +
            `/api/v1/comments/${_id}?skip=${skip}`,
        });

        commentData.isReplyLoaded = true;

        data.replies.forEach((reply, i) => {
          reply.childrenLevel = commentData.childrenLevel + 1;
          commentArr.splice(index + 1 + i + skip, 0, reply);
        });

        setBlog({ ...blog, comments: { ...comments, results: commentArr } });
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  };

  const deleteComment = async (e) => {
    e.target.setAttribute("disabled", true);

    try {
      await axios({
        method: "DELETE",
        url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/comments/${_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      e.target.removeAttribute("disabled");

      removeCommentsCards(index + 1, true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const hideReplies = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCards(index + 1);
  };

  const handleReplyClick = () => {
    if (!token) toast.error("Your are not logged in! Login to add reply");
    setIsReplying((previousValue) => !previousValue);
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftValue * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={photo} className="w-8 h-8 rounded-full" />
          <p className="line-clamp-1">
            {name} @{commentedByUsername}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{content}</p>

        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={hideReplies}
            >
              <i className="fi fi-rs-comment-dots"></i>Hide Reply
            </button>
          ) : (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={loadReplies}
            >
              <i className="fi fi-rs-comment-dots"></i>
              {children.length} Reply
            </button>
          )}

          <button className="underline" onClick={handleReplyClick}>
            Reply
          </button>

          {username === commentedByUsername ||
          username === blogAuthorUsername ? (
            <button
              className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
              onClick={deleteComment}
            >
              <i className="fi fi-rs-trash"></i>
            </button>
          ) : (
            ""
          )}
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setIsReplying={setIsReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CommentCard;
