import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { UserContext } from "../App";
import { profileDataStructure } from "./Profile";
import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/Loader";
import InputBox from "../components/InputBox";
import { uploadImage } from "../common/Aws";
import { storeInSession } from "../common/Session";

const EditProfile = () => {
  const {
    user,
    user: { token },
    setUser,
  } = useContext(UserContext);

  const bioLimit = 150;

  const profileImageElement = useRef();
  const editProfileForm = useRef();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);

  const {
    personalInfo: { name, username: profileUsername, photo, email, bio },
    socialLinks,
  } = profile;

  const getUserData = async () => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/users/${user.data.username}`,
      });

      setProfile(res.data.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImagePreview = (e) => {
    const image = e.target.files[0];

    profileImageElement.current.src = URL.createObjectURL(image);

    setUpdatedProfileImage(image);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (updatedProfileImage) {
      const loadingToast = toast.loading("Uploading...");
      e.target.setAttribute("disabled", true);

      try {
        const url = await uploadImage(updatedProfileImage);

        if (url) {
          const res = await axios({
            method: "PATCH",
            url:
              import.meta.env.VITE_SERVER_DOMAIN +
              "/api/v1/users/updateMyPhoto",
            data: { url },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const newUser = {
            ...user,
            data: { ...user.data, photo: res.data.photo },
          };

          storeInSession("user", JSON.stringify(newUser));
          setUser(newUser);

          setUpdatedProfileImage(null);

          toast.dismiss(loadingToast);
          e.target.removeAttribute("disabled");

          toast.success("Profile photo updated successfully! 👍");
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");

        toast.error(err.response.data.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(editProfileForm.current);
    let formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;

    const loadingToast = toast.loading("Updating...");
    e.target.setAttribute("disabled", true);

    try {
      const res = await axios({
        method: "PATCH",
        url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/users/updateMe",
        data: {
          username,
          bio,
          socialLinks: {
            youtube,
            facebook,
            twitter,
            github,
            instagram,
            website,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (user.data.username === res.data.updatedUser.profileInfo.username) {
        const newUser = {
          ...user,
          data: {
            ...user.data,
            username: res.data.updatedUser.profileInfo.username,
          },
        };

        storeInSession("user", JSON.stringify(newUser));
        setUser(newUser);

        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");

        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled");

      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserData();
    }
  }, [token]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                htmlFor="uploadImage"
                id="profileImageLabel"
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
                <img ref={profileImageElement} src={photo} />
              </label>

              <input
                type="file"
                id="uploadImage"
                accept=".jpeg,.png,.jpg"
                hidden
                onChange={handleImagePreview}
              />

              <button
                onClick={handleImageUpload}
                className="btn-light mt-5 max-lg:center lg:w-full px-10"
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <InputBox
                    name="name"
                    type="text"
                    value={name}
                    placeholder="Name"
                    disable={true}
                    icon="fi-rr-user"
                  />
                </div>

                <div>
                  <InputBox
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Email"
                    disable={true}
                    icon="fi-rr-envelope"
                  />
                </div>
              </div>

              <InputBox
                type="text"
                name="username"
                value={profileUsername}
                placeholder="username"
                icon="fi-rr-at"
              />

              <p className="text-dark-grey -mt-3">
                Username will be used to search user and will be visible to all
                users
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                placeholder="Bio"
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                onChange={(e) =>
                  setCharactersLeft(bioLimit - e.target.value.length)
                }
              ></textarea>

              <p className="mt-1 text-dark-grey">
                {charactersLeft} characters left
              </p>

              <p className="my-6 text-dark-grey">
                Add your social handles below
              </p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(socialLinks).map((key, i) => {
                  const link = socialLinks[key];

                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={
                        "fi " +
                        (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")
                      }
                    />
                  );
                })}
              </div>

              <button
                className="btn-dark w-auto px-10 mt-5"
                type="submit"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
