import { useContext, useState, useRef } from "react";
import { ForumContext } from "../contexts/ForumContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  postDiscussion,
  handleLikeUnlikeDiscussion,
  handleDeleteDiscussion,
  handleUpdateDiscussion as apiHandleUpdateDiscussion,
  fetchForum,
} from "../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BiComment } from "react-icons/bi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { jwtDecode } from "jwt-decode";

const ForumDiskusiPage = () => {
  const { forumData, setForumData } = useContext(ForumContext);
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDiscussionId, setEditingDiscussionId] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    post_content: "",
    created_at: Date.now(),
  });

  dayjs.extend(relativeTime);
  dayjs.locale("id");

  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    window.location.href = "/login";
  }

  const { accessToken } = token;
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.user_id;

  const lastDiscussionRef = useRef(null);

  const handlePostDiscussion = async (e) => {
    e.preventDefault();
    try {
      newDiscussion.created_at = undefined;

      const newDiscussionData = await postDiscussion(
        newDiscussion,
        currentUser,
        setForumData,
      );

      console.log("Updated forumData:", newDiscussionData);
      setNewDiscussion({ title: "", post_content: "" });

      // Ambil kembali data forum terbaru dan atur ulang forumData
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const forumResponse = await fetchForum();
      setForumData(forumResponse);
    } catch (error) {
      console.error("Failed to post discussion:", error.message);
    }
  };

  const handleDelete = async (discussionId) => {
    try {
      await handleDeleteDiscussion(discussionId, setForumData);

      const forumResponse = await fetchForum();
      setForumData(forumResponse);
    } catch (error) {
      console.error("Failed to delete discussion:", error.message);
    }
  };

  const handleEdit = (discussionId) => {
    setIsEditing(true);
    setEditingDiscussionId(discussionId);

    const discussionToEdit = forumData.data.find(
      (discussion) => discussion.id === discussionId,
    );
    setNewDiscussion({
      title: discussionToEdit.title,
      post_content: discussionToEdit.post_content,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingDiscussionId(null);
    setNewDiscussion({ title: "", post_content: "" });
  };

  const handleUpdateDiscussion = async (e, discussionId) => {
    e.preventDefault();

    try {
      await apiHandleUpdateDiscussion(
        discussionId,
        newDiscussion,
        setForumData,
      );
      setIsEditing(false);
      setEditingDiscussionId(null);
      setNewDiscussion({ title: "", post_content: "" });

      const forumResponse = await fetchForum();
      setForumData(forumResponse);
    } catch (error) {
      console.error("Failed to update discussion:", error.message);
    }
  };

  if (forumData === null) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-10 mx-4 md:mx-32">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 col-span-1 flex flex-col">
            <form
              onSubmit={
                isEditing
                  ? (e) => handleUpdateDiscussion(e, editingDiscussionId)
                  : handlePostDiscussion
              }
              className="space-y-4"
            >
              {" "}
              <input
                type="text"
                placeholder="Judul Diskusi"
                className="border-2 border-gray-300 rounded-md p-2 w-full"
                value={newDiscussion.title}
                onChange={(e) => {
                  setNewDiscussion({ ...newDiscussion, title: e.target.value });
                }}
              />
              <textarea
                value={newDiscussion.post_content}
                onChange={(e) => {
                  setNewDiscussion({
                    ...newDiscussion,
                    post_content: e.target.value,
                  });
                }}
                placeholder="Pertanyaan atau tanggapan kamu"
                className="border-2 border-gray-300 rounded-md p-2 w-full"
                rows={4}
              />
              <button
                type="submit"
                className={
                  newDiscussion.title === "" ||
                  newDiscussion.post_content === ""
                    ? "bg-teal-700 text-gray py-1 px-4 mt-2 rounded-md float-right transition duration-300"
                    : "bg-teal-500 text-white py-1 px-4 mt-2 rounded-md float-right hover:bg-teal-700 transition duration-300"
                }
                disabled={
                  newDiscussion.title === "" ||
                  newDiscussion.post_content === ""
                    ? true
                    : false
                }
              >
                {isEditing ? "Perbarui" : "Kirim"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${
                  isEditing ? "block" : "hidden"
                } bg-yellow-500 text-white py-1 px-4 mt-2 mr-2 rounded-md float-right hover:bg-yellow-700 transition duration-300`}
              >
                Batal
              </button>
            </form>
            <div className="forumDetail overflow-y-auto overflow-x-hidden mt-8">
              {Array.isArray(forumData?.data) ? (
                forumData.data.map((discussion, index) => (
                  <div
                    key={discussion.id}
                    className="mb-8"
                    ref={
                      index === forumData.data.length - 1
                        ? lastDiscussionRef
                        : null
                    }
                  >
                    <div className="max-w-2xl border-2 border-slate-200 rounded-lg shadow-lg p-4 space-y-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={discussion.poster_profile}
                          alt={`user profile ${discussion.id}`}
                          className="rounded-full w-16"
                        />
                        <div>
                          <p className="font-semibold text-lg">
                            {discussion.poster_username}{" "}
                            {discussion.poster_role === "ADMIN" ? (
                              <span className="text-red-500">[Admin]</span>
                            ) : discussion.poster_role === "DOCTOR" ? (
                              <span className="text-green-500">[Nakes]</span>
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="text-sm text-slate-600">
                            {dayjs(discussion.created_at).fromNow()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h1 className="font-semibold text-xl">
                          {discussion.title}
                        </h1>

                        <p className="text-lg">{discussion.post_content}</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            handleLikeUnlikeDiscussion(
                              discussion.id,
                              setForumData,
                            )
                          }
                          className={`${
                            discussion.is_liked
                              ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                              : "bg-gray-300 hover:bg-gray-500 transition duration-300"
                          } py-1 px-4 rounded-full flex items-center gap-1`}
                        >
                          {discussion.is_liked ? (
                            <AiFillLike />
                          ) : (
                            <AiOutlineLike />
                          )}
                          {discussion.like_count > 0
                            ? discussion.like_count
                            : ""}
                        </button>

                        <Link
                          to={`/forum/${discussion.id}`}
                          className="bg-gray-300 py-1 px-4 rounded-full flex items-center gap-1 hover:bg-gray-500 transition duration-300"
                        >
                          <BiComment />{" "}
                          {discussion.comment_count > 0
                            ? discussion.comment_count
                            : ""}
                        </Link>
                        {userId === discussion.poster_id && (
                          <>
                            <button
                              onClick={() => handleDelete(discussion.id)}
                              className="bg-red-500 text-white py-1 px-4 rounded-full hover:bg-red-700 transition duration-300"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => handleEdit(discussion.id)}
                              className="bg-yellow-500 text-white py-1 px-4 rounded-full hover:bg-yellow-700 transition duration-300"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  <Loader />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForumDiskusiPage;
