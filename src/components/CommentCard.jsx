import { getDay } from "../common/Date";

const CommentCard = ({ index, leftValue, commentData }) => {
  const {
    commentedBy: {
      personalInfo: { name, username, photo },
    },
    commentedAt,
    content,
  } = commentData;

  return (
    <div className="w-full" style={{ paddingLeft: `${leftValue * 10}px` }}>
      <div className="my-5 p-6 rounded-md border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={photo} className="w-8 h-8 rounded-full" />
          <p className="line-clamp-1">
            {name} @{username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{content}</p>

        <div></div>
      </div>
    </div>
  );
};

export default CommentCard;
