import { useRef } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import logo from "../images/blongle-icon.png";
import blogBanner from "../images/blog-banner.png";
import AnimationWrapper from "../common/AnimationWrapper";
import { uploadImage } from "../common/Aws";

const BlogEditor = () => {
  const blogBannerRef = useRef();

  const handleBannerUpload = async (e) => {
    const image = e.target.files[0];

    if (image) {
      const loadingToast = toast.loading("Uploading...");

      try {
        const url = await uploadImage(image);

        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded! 👍");
          blogBannerRef.current.src = url;
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("Upload failed! Please try again.");
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img ref={blogBannerRef} src={blogBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
