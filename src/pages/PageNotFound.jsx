import { Link } from "react-router-dom";

import pageNotFoundImg from "../images/404.png";
import logo from "../images/bloingle-logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={pageNotFoundImg}
        className="select-none b-2 w-72 aspect-square object-cover rounded"
      />

      <h1 className="text-4xl font-gelasio leading-7">Page not found!!</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        The page you are looking for doesnot exists. Head back to the{" "}
        <Link to="/" className="text-black underline text-xl">
          home page
        </Link>
      </p>

      <div className="mt-auto">
        <img src={logo} className="h-12 object-contain mx-auto select-none" />
        <p className="mt-5 text-dark-grey">
          Read millions of stroies around the world
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
