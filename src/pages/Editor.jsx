import { useState, useContext, createContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../App";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

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
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");

  const {
    user: { token },
  } = useContext(UserContext);

  return (
    <EditorContext.Provider
      value={{ blog, setBlog, editorState, setEditorState }}
    >
      {token === null ? (
        <Navigate to="/login" />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
