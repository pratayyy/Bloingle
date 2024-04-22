import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { BlogContext } from "../pages/Blog";
import { UserContext } from "../App";
import axios from "axios";

const BlogInteraction = () => {
  const {
    blog,
    blog: {
      _id,
      slug,
      title,
      author: {
        personalInfo: { username: authorUsername },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    blog: {
      activity,
      activity: { totalLikes, totalComments },
    },
  } = useContext(BlogContext);

  const {
    user: { data, token },
  } = useContext(UserContext);

  const getUserLikeStatus = async () => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs/get-user-like-status/${_id}`,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setIsLikedByUser(Boolean(res.data.result));
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (token) getUserLikeStatus();
  }, []);

  const handleLike = async () => {
    if (token) {
      setIsLikedByUser((preVal) => !preVal);

      !isLikedByUser ? totalLikes++ : totalLikes--;

      setBlog({ ...blog, activity: { ...activity, totalLikes } });

      try {
        const res = await axios({
          method: "PATCH",
          url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/blogs/${_id}`,
          data: { isLikedByUser },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        res.data.notification !== null
          ? toast.success("Liked! 😊")
          : toast("Disliked!", { icon: "🥺" });
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      toast.error("Please log in to like this blog!");
    }
  };

  return (
    <>
      <Toaster />

      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")
              }
            ></i>
          </button>

          <p className="text-xl text-dark-grey">{totalLikes}</p>

          <button
            onClick={() =>
              setCommentsWrapper((previousValue) => !previousValue)
            }
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>

          <p className="text-xl text-dark-grey">{totalComments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {data?.username === authorUsername ? (
            <Link
              to={`/editor/${slug}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://www.twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
