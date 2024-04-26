import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Toaster } from "react-hot-toast";

import { UserContext } from "../App";
import { filterPaginationData } from "../common/FilterPaginationData";
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import AnimationWrapper from "../common/AnimationWrapper";
import {
  ManagePublishedBlogCard,
  ManageDraftBlogCard,
} from "../components/ManageBlogCard";
import LoadMore from "../components/LoadMore";

const BlogManagement = () => {
  const {
    user: { token },
  } = useContext(UserContext);

  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  const getBlogs = async ({ page, draft, deletedDocCount = 0 }) => {
    try {
      const { data } = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs/get-user-blogs?page=${page}&fields=title,slug,banner,description,tags,activity,publishedAt&draft=${draft}&title=${query}`,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const formattedData = await filterPaginationData({
        prevDocs: draft ? drafts : blogs,
        newDocs: data.blogs,
        page,
        user: token,
        countRoute: `/api/v1/blogs/get-blogs-count/auth?draft=${draft}&title=${query}`,
      });

      if (draft) setDrafts(formattedData);
      else setBlogs(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  useEffect(() => {
    if (token) {
      if (blogs === null) getBlogs({ page: 1, draft: false });
      if (drafts === null) getBlogs({ page: 1, draft: true });
    }
  }, [token, blogs, drafts, query]);

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-4 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation routes={["Published Blogs", "Drafts"]}>
        {blogs === null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogCard
                    blog={{ ...blog, index: i, setStateFunction: { setBlogs } }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMore
              state={blogs}
              fetchDataFunction={getBlogs}
              additionalParams={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message="No published blogs" />
        )}

        {drafts === null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogCard
                    blog={{
                      ...blog,
                      index: i,
                      setStateFunction: { setDrafts },
                    }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMore
              state={drafts}
              fetchDataFunction={getBlogs}
              additionalParams={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message="No draft blogs" />
        )}
      </InPageNavigation>
    </>
  );
};

export default BlogManagement;
