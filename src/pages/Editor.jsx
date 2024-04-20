import { useState, useContext, createContext, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { UserContext } from "../App";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import Loader from "../components/Loader";
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: { personalInfo: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  const {
    user: { token },
  } = useContext(UserContext);

  const getBlogData = async () => {
    try {
      const res = await axios({
        method: "GET",
        url:
          import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/blogs/${slug}?draft=true&mode=edit`,
      });

      setBlog(res.data.blog);
      setLoading(false);
    } catch (err) {
      setBlog(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return setLoading(false);
    getBlogData();
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {token === null ? (
        <Navigate to="/login" />
      ) : loading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
