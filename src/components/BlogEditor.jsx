import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";

import logo from "../images/blongle-icon.png";
import blogBanner from "../images/blog-banner.png";
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

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: "",
        tools: tools,
        placeholder: "Let's write an awesome story",
      })
    );
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
          <button className="btn-light py-2">Save Draft</button>
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
