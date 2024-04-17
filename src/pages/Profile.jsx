import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/Loader";
import { UserContext } from "../App";

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

      setProfile(res.data.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
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
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
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
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default Profile;
