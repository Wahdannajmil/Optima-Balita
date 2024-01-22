import { useContext, useState, useEffect } from "react";
import { ForumContext } from "../contexts/ForumContext";
import { BiComment } from "react-icons/bi";
import CommentForm from "../components/CommentForm";
import { useParams } from "react-router-dom";
import { AiOutlineWechat, AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsChevronLeft } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
import {
  handlePostComment,
  handleLikeUnlikeDiscussion,
  handleUpdateComment,
  handleDeleteComment,
  fetchForum,
} from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailDiskusi() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [discussion, setDiscussion] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const { isLoading, forumData, setForumData } = useContext(ForumContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forumResponse = await fetchForum();
        setForumData(forumResponse);
        isLoading(false);
      } catch (error) {
        console.error("Error fetching forum data:", error.message);
        isLoading(false);
      }
    };

    if (forumData) {
      const foundDiscussion = forumData.data.find((item) => item.id === id);

      if (foundDiscussion && foundDiscussion.comments) {
        setDiscussion(foundDiscussion);
      } else {
        fetchData();
      }
    }
  }, [forumData, id, isLoading, setForumData]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.href = "/login";
  }

  const { accessToken } = token;

  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.user_id;

  const goBack = () => {
    window.history.back();
  };

  const sharePost = () => {
    const url = window.location.href;
    navigator.share({
      title: "Bagikan postingan ini",
      url: url,
    });
  };

  const handleLike = () => {
    handleLikeUnlikeDiscussion(id, setForumData);
  };

  const handleSubmitComment = async () => {
    if (editingCommentId) {
      await handleUpdateComment(editingCommentId, newComment, setForumData);
      setEditingCommentId(null);
    } else {
      await handlePostComment(id, newComment, setForumData);
    }
    setNewComment("");
  };

  const handleDelete = async (commentId) => {
    await handleDeleteComment(commentId, setForumData);
  };

  const handleEdit = (commentId) => {
    const comment = discussion.comments.find((item) => item.id === commentId);
    setEditingCommentId(commentId);
    setNewComment(comment.comment_content);
  };

  dayjs.extend(relativeTime);
  dayjs.locale("id");

  return (
    <>
      <Navbar />
      <div className="">
        <div className="sm:max-w-2xl w-full px-4 justify-center mx-auto mt-10">
          <div className="flex justify-between mb-4">
            <button>
              <BsChevronLeft className="text-xl" onClick={goBack} />
            </button>
            {isLoading ? (
              <p>Loading...</p>
            ) : forumData ? (
              <p className="font-semibold text-lg">
                Postingan dari{" "}
                {discussion?.poster_username || "poster_username is undefined"}
              </p>
            ) : (
              <div>Discussion not found</div>
            )}

            <button>
              <IoShareSocialOutline className="text-xl" onClick={sharePost} />
            </button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : forumData ? (
            <div key={id} className="mb-8">
              <div className="max-w-2xl border-2 border-slate-200 rounded-lg shadow-lg p-4 space-y-4">
                <div className="flex gap-4 items-center">
                  <img
                    src={discussion?.poster_profile}
                    alt={`user profile ${id}`}
                    className="rounded-full w-16"
                  />
                  <div>
                    <p className="font-semibold text-lg">
                      {discussion?.poster_username}{" "}
                      {discussion?.poster_role === "DOCTOR" && (
                        <span className="ml-2 text-blue-500">
                          <FontAwesomeIcon icon={faStethoscope} />
                          Ahli gizi
                        </span>
                      )}
                    </p>
                    <span className="text-sm text-slate-600">
                      {dayjs(discussion?.created_at).fromNow()}
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="font-semibold text-xl">{discussion?.title}</h1>
                  <p className="text-lg">{discussion?.post_content}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className="text-teal-500 hover:underline mr-2"
                  >
                    {discussion?.is_liked ? (
                      <AiFillLike className="text-teal-500 w-5 h-5" />
                    ) : (
                      <AiOutlineLike className="w-5 h-5" />
                    )}
                    Like ({discussion?.like_count})
                  </button>
                  <button className="text-red-500 hover:underline">
                    <BiComment className="w-5 h-5" />{" "}
                    {discussion?.comment_count}
                  </button>
                </div>
                <div>
                  {discussion?.comment_count > 0 ? (
                    <ul className="space-y-4">
                      <h2 className="font-medium text-md">
                        Semua komentar ({discussion.comment_count})
                      </h2>
                      {discussion?.comments?.map((comment) => (
                        <li
                          key={comment.id}
                          className="border-t border-slate-200 pt-4"
                        >
                          <div className="flex gap-4 items-center">
                            <img
                              src={comment.commenter_profile}
                              alt={`user profile ${comment.id}`}
                              className="rounded-full w-12"
                            />
                            <div>
                              <p className="font-semibold text-md">
                                {comment.commenter_username}{" "}
                                {comment.commenter_role === "DOCTOR" && (
                                  <span className="ml-2 text-blue-500">
                                    <FontAwesomeIcon icon={faStethoscope} />
                                    Ahli gizi
                                  </span>
                                )}
                              </p>
                              <span className="text-sm text-slate-600">
                                {dayjs(comment.created_at).fromNow()}
                              </span>
                              <p className="text-lg">
                                {comment.comment_content}
                              </p>
                              {comment.commenter_id === userId && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(comment.id)}
                                    className="text-blue-500 hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="justify-center text-center space-y-1 py-4">
                      <AiOutlineWechat className="w-14 h-14 text-slate-500 justify-center mx-auto" />
                      <p className="font-semibold text-lg">
                        Belum ada komentar
                      </p>
                      <span>jadilah yang pertama berkomentar</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <CommentForm
                    onSubmit={handleSubmitComment}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    editingCommentId={editingCommentId}
                    setEditingCommentId={setEditingCommentId}
                    setNewComment={setNewComment}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>Discussion not found</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DetailDiskusi;
