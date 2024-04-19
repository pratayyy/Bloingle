import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/Loader";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/BlogInteraction";

export const blogStructure = {
  title: "",
  description: "",
  content: [],
  tags: [],
  author: { personalInfo: {} },
  banner: "",
  publishedAt: "",
};

const Blog = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);

  const {
    title,
    description,
    content,
    tags,
    author: {
      personalInfo: { name, username: authorUsername, photo },
    },
    banner,
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/blogs/${slug}`,
      });

      setBlog(res.data.blog);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw] ">
          <img src={banner} className="aspect-video" />

          <div className="mt-12">
            <h2>{title}</h2>

            <div className="flex max-sm:flex-col justify-between my-8">
              <div className="flex gap-5 items-start">
                <img src={photo} className="w-12 h-12 rounded-full" />

                <p>
                  {name}
                  <br />
                  <Link
                    to={`/user/${authorUsername}`}
                    className="text-dark-grey"
                  >
                    @{authorUsername}
                  </Link>
                </p>
              </div>

              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published on {getDay(publishedAt)}
              </p>
            </div>
          </div>

          <BlogInteraction />
        </div>
      )}
    </AnimationWrapper>
  );
};

export default Blog;
