import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/Loader";
import AnimationWrapper from "../common/AnimationWrapper";
import BlogCard from "../components/BlogCard";
import NoData from "../components/NoData";
import LoadMore from "../components/LoadMore";
import { filterPaginationData } from "../common/FilterPaginationData";
import UserCard from "../components/UserCard";

const Search = () => {
  const { query } = useParams();

  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = async ({ page = 1, createNewArray = false }) => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs?page=${page}&fields=title,slug,banner,description,tags,activity,publishedAt&title=${query}`,
      });

      const formatedData = await filterPaginationData({
        prevDocs: blogs,
        newDocs: res.data.blogs,
        page,
        countRoute: "/api/v1/blogs/get-blogs-count?title=",
        param: `${query}`,
        createNewArray,
      });

      setBlogs(formatedData);
    } catch (err) {
      console.log(err);
    }
  };

  const searchUsers = async () => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/users?fields=personalInfo.name,personalInfo.username,personalInfo.photo&personalInfo.username=${query}`,
      });

      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, createNewArray: true });
    searchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users === null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs === null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
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
            ) : (
              <NoData message="No blogs published" />
            )}

            <LoadMore state={blogs} fetchDataFunction={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8 ">
          User related to search <i className="fi fi-rr-user mt-1"></i>
        </h1>

        <UserCardWrapper />
      </div>
    </section>
  );
};
export default Search;
