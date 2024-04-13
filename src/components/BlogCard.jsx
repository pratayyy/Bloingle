import { Link } from "react-router-dom";
import { getDay } from "../common/Date";

const BlogCard = ({ content, author }) => {
  const {
    title,
    banner,
    description,
    tags,
    publishedAt,
    activity: { totalLikes },
    _id,
    slug,
  } = content;
  const { name, username, photo } = author;
  return (
    <Link
      to={`/blog/${slug}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={photo} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {name} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>

        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px] line-clamp-2">
          {description}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl" />
            {totalLikes}
          </span>

          <span className="lg:hidden btn-light py-1 px-4">{tags[0]}</span>

          <div className="hidden lg:flex flex-wrap">
            {tags.map((tag, i) => (
              <span key={i} className="btn-light py-1 px-4">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export default BlogCard;
