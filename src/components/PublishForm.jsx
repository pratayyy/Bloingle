import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";
import { EditorContext } from "../pages/Editor";
import AnimationWrapper from "../common/AnimationWrapper";
import Tag from "./Tag";

const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;

  const { slug } = useParams();

  const {
    blog,
    blog: { title, banner, tags, description, content },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  const {
    user: { token },
  } = useContext(UserContext);

  const navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    const input = e.target.value;
    setBlog({ ...blog, title: input });
  };

  const handleBlogDescriptionChange = (e) => {
    const input = e.target.value;
    setBlog({ ...blog, description: input });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      const tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length)
          setBlog({ ...blog, tags: [...tags, tag] });
      } else {
        toast.error(`You can add max ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  };

  const publishBlog = async (e) => {
    if (e.target.className.includes("disable")) return;

    if (!title.length) return toast.error("Write blog title to publish!");
    if (!description.length || description.length > characterLimit)
      return toast.error(
        `Write a desciption about your blog within ${characterLimit} characters to publish`
      );
    if (!tags.length)
      return toast.error("Enter atleast 1 related tag to the blog");

    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add("disable");

    const blogObj = { title, banner, description, content, tags, draft: false };

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
        toast.success("Published 👍");

        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (err) {
      e.target.classList.remove("disable");

      toast.dismiss(loadingToast);
      toast.error(err.response.data.message);
    }
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {description}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />

          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>
          <textarea
            maxLength={characterLimit}
            defaultValue={description}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - description.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics - ( Helps in searching and ranking your blog post )
          </p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topics"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />

            {tags.map((tag, i) => {
              return <Tag tag={tag} key={i} />;
            })}
          </div>

          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} tags left
          </p>

          <button className="btn-dark px-8" onClick={publishBlog}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
