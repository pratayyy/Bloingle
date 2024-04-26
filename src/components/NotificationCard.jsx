import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { getDay } from "../common/Date";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "../App";

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    _id: notificationId,
    type,
    seen,
    createdAt,
    repliedOnComment,
    comment,
    user,
    user: {
      personalInfo: { name, username, photo },
    },
    blog: { _id: blogId, slug, title },
    reply,
  } = data;

  const {
    user: {
      token,
      data: { username: authorUsername, photo: authorPhoto },
    },
  } = useContext(UserContext);

  const {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  const [isReplying, setIsReplying] = useState(false);

  const handleReplyClick = () => {
    setIsReplying((previousValue) => !previousValue);
  };

  const handleDelete = async (commentId, type, target) => {
    target.setAttribute("disabled", true);

    try {
      await axios({
        type: "DELETE",
        url: import.meta.env.VITE_SERVER_URL + `/api/v1/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (type === "comment") {
        results.splice(index, 1);
      } else {
        delete results[index].reply;
      }

      target.removeAttribute("disabled");
      setNotifications({
        ...notifications,
        results,
        totalDocs: totalDocs - 1,
        deletedDocCount: notifications.deletedDocCount + 1,
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div
      className={
        "p-6 border-b border-grey border-l-black/50 " +
        (!seen ? "border-l-2" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img src={photo} className="w-14 h-14 flex-none rounded-full" />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">{name}</span>
            <Link to={`/user/${username}`} className="mx-1 text-black">
              @{username}
            </Link>
            <span className="font-normal">
              {type === "like"
                ? "liked your blog"
                : type === "comment"
                ? "commented on"
                : "replied on"}
            </span>
          </h1>

          {type === "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              <p>{repliedOnComment.content}</p>
            </div>
          ) : (
            <Link
              to={`/blog/${slug}`}
              className="text-dark-grey hover:underline line-clamp-1"
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>

      {type !== "like" ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {comment.content}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>

        {type !== "like" ? (
          <>
            {!reply ? (
              <button className="hover:text-black" onClick={handleReplyClick}>
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              className="hover:text-red"
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentField
            blogId={blogId}
            blogAuthor={user}
            index={index}
            replyingTo={comment._id}
            setIsReplying={setIsReplying}
            notificationId={notificationId}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}

      {reply ? (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
          <div className="flex gap-3 mb-3">
            <img src={authorPhoto} className="w-8 h-8 rounded-full" />

            <div>
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/user/${authorUsername}`}
                  className="mx-1 text-black"
                >
                  @{authorUsername}
                </Link>

                <span className="font-normal">replied to</span>

                <Link to={`/user/${username}`} className="mx-1 text-black">
                  @{username}
                </Link>
              </h1>
            </div>
          </div>

          <p className="ml-14 font-gelasio text-xl my-2">{reply.content}</p>

          <button
            className="hover:text-red ml-14 mt-2"
            onClick={(e) => handleDelete(comment._id, "reply", e.target)}
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationCard;
