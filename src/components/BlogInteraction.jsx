import { useContext } from "react";
import { BlogContext } from "../pages/Blog";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = () => {
  const {
    blog: {
      slug,
      title,
      activity,
      activity: { totalLikes, totalComments },
      author: {
        personalInfo: { username: authorUsername },
      },
      setBlog,
    },
  } = useContext(BlogContext);

  const {
    user: {
      data: { username },
    },
  } = useContext(UserContext);

  return (
    <>
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-heart"></i>
          </button>

          <p className="text-xl text-dark-grey">{totalLikes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>

          <p className="text-xl text-dark-grey">{totalComments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username === authorUsername ? (
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
