import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

import InputBox from "../components/InputBox";
import googleIcon from "../images/google.png";
import AnimationWrapper from "../common/AnimationWrapper";
import { storeInSession } from "../common/Session";

const Authentication = ({ type }) => {
  const userAuthThroughServer = async (serverRoute, formData) => {
    try {
      const res = await axios({
        method: "POST",
        url: import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
        data: formData,
      });

      storeInSession("user", JSON.stringify(res.data));
      console.log(sessionStorage);

      if (res.data.status === "success")
        toast.success(
          type === "login" ? "Logged in successfully" : "Signed Up successfully"
        );
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute =
      type === "login" ? "/api/v1/users/login" : "/api/v1/users/signup";

    const form = new FormData(document.getElementById("form_authentication"));
    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="form_authentication" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "login" ? "Welcome back!" : "Join us today!"}
          </h1>

          {type !== "login" ? (
            <InputBox
              name="name"
              type="text"
              placeholder="Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type === "login" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today!
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/login" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default Authentication;
