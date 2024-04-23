import { useContext, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import AnimationWrapper from "../common/AnimationWrapper";
import InputBox from "../components/InputBox";
import { UserContext } from "../App";

const ChangePassword = () => {
  const {
    user: { token },
  } = useContext(UserContext);

  const changePasswordForm = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(changePasswordForm.current);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    e.target.setAttribute("disabled", true);

    const loadingToast = toast.loading("Updating...");

    try {
      const res = await axios({
        method: "PATCH",
        url:
          import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/users/updateMyPassword",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Password successfully updated.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response.data.message);
    }
  };

  return (
    <AnimationWrapper>
      <Toaster />

      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type="password"
            className="profile-edit-input"
            placeholder="Current Password"
            icon="fi-rr-unlock"
          />

          <InputBox
            name="newPassword"
            type="password"
            className="profile-edit-input"
            placeholder="New Password"
            icon="fi-rr-unlock"
          />

          <button onClick={handleSubmit} className="btn-dark px-10">
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
