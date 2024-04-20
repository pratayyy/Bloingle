import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";

import logo from "../images/blongle-icon.png";
import blogBanner from "../images/blog-banner.png";
import { UserContext } from "../App";
import AnimationWrapper from "../common/AnimationWrapper";
import { uploadImage } from "../common/Aws";
import { EditorContext } from "../pages/Editor";
import { tools } from "./Tools";

const BlogEditor = () => {
  const {
    blog,
    blog: { title, banner, content, tags, description },
    setBlog,
    setEditorState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  const {
    user: { token },
  } = useContext(UserContext);

  const { slug } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's write an awesome story",
        })
      );
    }
  }, []);

  const handleBannerUpload = async (e) => {
    const image = e.target.files[0];

    if (image) {
      const loadingToast = toast.loading("Uploading...");

      try {
        const url = await uploadImage(image);

        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded! 👍");
          setBlog({ ...blog, banner: url });
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("Upload failed! Please try again.");
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  const handleTitleChange = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = async () => {
    if (!banner.length) return toast.error("Upload a blog banner to publish!");

    if (!title.length) return toast.error("Write blog title to publish!");

    if (textEditor.isReady) {
      try {
        const data = await textEditor.save();

        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write something in your blog to publish it!");
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes("disable")) return;

    if (!title.length) return toast.error("Write blog title to save in draft!");

    let loadingToast = toast.loading("Saving draft...");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      let content = textEditor.save();

      const blogObj = {
        title,
        banner,
        description,
        content,
        tags,
        draft: true,
      };

      try {
        const res = await axios({
          method: "POST",
          url: import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/blogs",
          data: { ...blogObj, slug },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          e.target.classList.remove("disable");

          toast.dismiss(loadingToast);
          toast.success("Successfully saved to draft 👍");

          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      } catch (err) {
        e.target.classList.remove("disable");

        toast.dismiss(loadingToast);
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner ? banner : blogBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
