import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../App";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

const Editor = () => {
  const [editorState, setEditorState] = useState("editor");

  const {
    user: { token },
  } = useContext(UserContext);

  return token === null ? (
    <Navigate to="/login" />
  ) : editorState === "editor" ? (
    <BlogEditor />
  ) : (
    <PublishForm />
  );
};

export default Editor;
