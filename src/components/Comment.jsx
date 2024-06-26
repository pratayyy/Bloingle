import { useContext } from "react";
import axios from "axios";

import { BlogContext } from "../pages/Blog";
import CommentField from "./CommentField";
import NoData from "./NoData";
import AnimationWrapper from "../common/AnimationWrapper";
import CommentCard from "./CommentCard";

export const fetchComments = async ({
  skip = 0,
  blogId,
  setParentCommentCountFunction,
  commentArr = null,
}) => {
  let res;

  try {
    const { data } = await axios({
      method: "GET",
      url:
        import.meta.env.VITE_SERVER_DOMAIN +
        `/api/v1/blogs/${blogId}/comments?skip=${skip}&sort=-commentedAt`,
    });

    data.comments.map((comment) => {
      comment.childrenLevel = 0;
    });

    setParentCommentCountFunction(
      (previousValue) => previousValue + data.comments.length
    );

    if (commentArr === null) {
      res = { results: data.comments };
    } else {
      res = { results: [...commentArr, ...data.comments] };
    }
  } catch (err) {
    console.log(err);
  }

  return res;
};

const Comment = () => {
  const {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentArr },
      activity: { totalParentComments },
    },
    setBlog,
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const loadMoreComments = async () => {
    const newCommentArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blogId: _id,
      setParentCommentCountFunction: setTotalParentCommentsLoaded,
      commentArr: commentArr,
    });

    setBlog({ ...blog, comments: newCommentArr });
  };

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>

        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        <button
          onClick={() => setCommentsWrapper((previousValue) => !previousValue)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>

        <hr className="border-grey my-8 w-[120%] -ml-10" />

        <CommentField action="comment" />

        {commentArr && commentArr.length ? (
          commentArr.map((comment, i) => {
            return (
              <AnimationWrapper key={i}>
                <CommentCard
                  index={i}
                  leftValue={comment.childrenLevel * 4}
                  commentData={comment}
                />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No comments" />
        )}

        {totalParentComments > totalParentCommentsLoaded ? (
          <button
            onClick={loadMoreComments}
            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
          >
            Load More
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Comment;
