import { useEffect, useState } from "react";
import axios from "axios";

import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation, { activeTabRef } from "../components/InPageNavigation";
import Loader from "../components/Loader";
import BlogCard from "../components/BlogCard";
import TrendingBlogCard from "../components/TrendingBlogCard";

const Homepage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const categories = [
    "programming",
    "technology",
    "software development",
    "machine learning",
    "microservices",
    "coding",
    "security",
    "web development",
  ];

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

  const fetchBlogsByCategory = async () => {
    try {
      const res = await axios({
        method: "POST",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/blogs/get-blog-by-category",
        data: {
          tag: pageState,
        },
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

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState === "home") fetchLatestBlogs();
    else fetchBlogsByCategory();

    if (!trendingBlogs) fetchTrendingBlogs();
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
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
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex gap-2 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={
                        "tag " +
                        (pageState === category ? "bg-black text-white " : " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

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
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
