import { useEffect, useState } from "react";
import axios from "axios";

import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/Loader";
import BlogCard from "../components/BlogCard";
import TrendingBlogCard from "../components/TrendingBlogCard";

const Homepage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchLatestBlogs = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/blogs",
      });

      setBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/blogs/get-trending-blog",
      });

      setTrendingBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogCard
                        content={blog}
                        author={blog.author.personalInfo}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <TrendingBlogCard blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending blog */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
