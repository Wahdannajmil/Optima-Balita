import { useState } from "react";
import { IoSendSharp, IoCloseSharp } from "react-icons/io5";

function CommentForm({
  onSubmit,
  value,
  onChange,
  editingCommentId,
  setEditingCommentId,
  setNewComment,
}) {
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === "") return;
    const newComment = {
      contentReply: comments.contentReply,
    };
    setComments([...comments, newComment]);
    onSubmit(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gap-4 flex items-center justify-between"
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Tulis Komentar..."
        className="bg-slate-300 py-2 px-4 rounded-full text-lg w-full"
      />
      {editingCommentId && (
        <button
          type="button"
          onClick={() => {
            setEditingCommentId(null);
            setNewComment("");
          }}
          className="text-red-500 hover:underline"
        >
          <IoCloseSharp className="w-10 h-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-400" />
        </button>
      )}
      <button type="submit" disabled={value === "" ? true : false}>
        {editingCommentId ? (
          <IoSendSharp
            className={
              value === ""
                ? "w-10 h-10 bg-yellow-700 text-black p-2 rounded-full transition duration-300"
                : "w-10 h-10 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-400 transition duration-300"
            }
          />
        ) : (
          <IoSendSharp
            className={
              value === ""
                ? "w-10 h-10 bg-teal-700 text-black p-2 rounded-full transition duration-300"
                : "w-10 h-10 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-400 transition duration-300"
            }
          />
        )}
      </button>
    </form>
  );
}

export default CommentForm;
