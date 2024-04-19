import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/Loader";
import { UserContext } from "../App";
import About from "../components/About";
import { filterPaginationData } from "../common/FilterPaginationData";
import InPageNavigation from "../components/InPageNavigation";
import BlogCard from "../components/BlogCard";
import NoData from "../components/NoData";
import LoadMore from "../components/LoadMore";
import PageNotFound from "./PageNotFound";

export const profileDataStructure = {
  personalInfo: {
    name: "",
    username: "",
    photo: "",
    bio: "",
  },
  accountInfo: {
    totalPosts: 0,
    totalBlogs: 0,
  },
  socialLinks: {},
  joinedAt: " ",
};

const Profile = () => {
  const { id: profileId } = useParams();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);

  const {
    personalInfo: { name, username: profileUsername, photo, bio },
    accountInfo: { totalPosts, totalReads },
    socialLinks,
    joinedAt,
  } = profile;

  const {
    user: { data },
  } = useContext(UserContext);

  const fetchUserProfile = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/users/${profileId}`,
      });

      if (res.data.user !== null) setProfile(res.data.user);
      getBlogs({ page: 1, createNewArray: true, userId: res.data.user._id });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getBlogs = async ({ page = 1, createNewArray = false, userId }) => {
    userId = userId === undefined ? blogs.userId : userId;

    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs?page=${page}&fields=title,slug,banner,description,tags,activity,publishedAt&author=${userId}`,
      });

      const formatedData = await filterPaginationData({
        prevDocs: blogs,
        newDocs: res.data.blogs,
        page,
        countRoute: "/api/v1/blogs/get-blogs-count?author=",
        param: `${userId}`,
        createNewArray,
      });

      formatedData.userId = userId;

      setBlogs(formatedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    resetStates();
    fetchUserProfile();
  }, [profileId]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profileUsername.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={photo}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">@{profileUsername}</h1>
            <p className="text-xl capitalize h-6">{name}</p>

            <p>
              {totalPosts.toLocaleString()} Blogs -{" "}
              {totalReads.toLocaleString()} Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId === data.username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                " "
              )}
            </div>

            <About
              className="max-md:hidden"
              bio={bio}
              socialLinks={socialLinks}
              joinedAt={joinedAt}
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["blogs published", "about"]}
              defaultHidden={["about"]}
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

                <LoadMore state={blogs} fetchDataFunction={getBlogs} />
              </>

              <About bio={bio} socialLinks={socialLinks} joinedAt={joinedAt} />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default Profile;
