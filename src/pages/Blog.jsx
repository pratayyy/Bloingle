import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const blogStructure = {
  title: "",
  description: "",
  content: [],
  tags: [],
  author: { personalInfo: {} },
  banner: "",
  publishedAt: "",
};

const Blog = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(blogStructure);

  const {
    title,
    description,
    content,
    tags,
    author: {
      personalInfo: { name, usernmae, photo },
    },
    banner,
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: import.meta.env.VITE_SERVER_DOMAIN + `/api/v1/blogs/${slug}`,
      });
      console.log(res.data.blog);
      setBlog(res.data.blog);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlog();
    console.log(blog);
  }, []);

  return (
    <div>
      <h1>This is the blog page of {title}</h1>
    </div>
  );
};

export default Blog;
