import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/Loader";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/BlogInteraction";
import BlogCard from "../components/BlogCard";
import BlogContent from "../components/BlogContent";
import Comment, { fetchComments } from "../components/Comment";

export const blogStructure = {
  title: "",
  description: "",
  content: [],
  tags: [],
  author: { personalInfo: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const Blog = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

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

      const tag = res.data.blog.tags[0];

      res.data.blog.comments = await fetchComments({
        blogId: res.data.blog._id,
        setParentCommentCountFunction: setTotalParentCommentsLoaded,
      });

      console.log(res.data.blog);

      setBlog(res.data.blog);
      fetchSimilarBlogs({ tag, limit: 6 });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchSimilarBlogs = async ({ tag, limit }) => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs?fields=title,slug,banner,description,tags,activity,publishedAt&tags=${tag}&slug[ne]=${slug}&limit=${limit}`,
      });

      setSimilarBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [slug]);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setIsLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <Comment />

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

            <div className="my-12 font-gelasio blog-page-content">
              {content.blocks.map((block, i) => {
                return (
                  <div key={i} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction />

            {similarBlogs !== null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>

                {similarBlogs.map((blog, i) => {
                  const {
                    author: { personalInfo },
                  } = blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogCard content={blog} author={personalInfo} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default Blog;
