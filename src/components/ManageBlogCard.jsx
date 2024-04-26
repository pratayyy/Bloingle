import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { getDay } from "../common/Date";
import { UserContext } from "../App";

const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-4 max-lg:border-grey max-lg:border-b">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("Parent") ? (
          <div
            key={i}
            className={
              "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
              (i !== 0 ? " border-grey border-l " : "")
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">
              {stats[key].toLocaleString()}
            </h1>
            <p className="max-lg:text-dark-grey capitalize">
              {key.replace("total", "")}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export const ManagePublishedBlogCard = ({ blog }) => {
  const {
    user: { token },
  } = useContext(UserContext);

  const { banner, slug, title, publishedAt, activity } = blog;

  const [showStat, setShowStat] = useState(false);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link to={`/blog/${slug}`} className="blog-title mb-4">
              {title}
            </Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${slug}`} className="pr-4 py-2">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2"
              onClick={() => setShowStat((previousValue) => !previousValue)}
            >
              Stats
            </button>

            <button
              className="pr-4 py-2 text-red"
              onClick={(e) => {
                deleteBlog(blog, token, e.target);
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>

      {showStat ? (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const ManageDraftBlogCard = ({ blog }) => {
  const {
    user: { token },
  } = useContext(UserContext);

  let { title, description, slug, index } = blog;
  index++;

  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? "0" + index : index}
      </h1>

      <div>
        <h1 className="blog-title mb-3">{title}</h1>

        <p className="line-clamp-1 font-gelasio">
          {description.length ? description : "No Description"}
        </p>

        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${slug}`} className="pr-4 py-2">
            Edit
          </Link>

          <button
            className="pr-4 py-2 text-red"
            onClick={(e) => {
              deleteBlog(blog, token, e.target);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const deleteBlog = async (blog, token, target) => {
  const { index, slug, setStateFunction } = blog;

  target.setAttribute("disabled", true);

  try {
    await axios({
      method: "DELETE",
      url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/blogs/${slug}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    target.removeAttribute("disabled");

    setStateFunction((previousValue) => {
      let { deletedDocCount, totalDocs, results } = previousValue;

      results.splice(index, 1);

      if (!deletedDocCount) deletedDocCount = 0;

      if (!results.length && totalDocs - 1 > 0) return null;

      return {
        ...previousValue,
        totalDocs: totalDocs - 1,
        deletedDocCount: deletedDocCount - 1,
      };
    });
  } catch (err) {
    console.log(err);
  }
};
