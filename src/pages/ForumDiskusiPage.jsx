import React, { useContext, useEffect, useState } from "react";
import { ForumContext } from "../contexts/ForumContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  postDiscussion,
  handleLikeDiscussion,
  handleUnlikeDiscussion,
  handleDeleteDiscussion,
  handleUpdateDiscussion as apiHandleUpdateDiscussion,
  fetchForum,
} from "../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BiComment, BiLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const ForumDiskusiPage = () => {
  const { isLoading, forumData, setForumData } = useContext(ForumContext);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }

        const forumResponse = await fetchForum(token);
        console.log("Forum Response:", forumResponse);
        setForumData(forumResponse);
      } catch (error) {
        console.error("Error fetching forum data:", error.message);
      }
    };

    fetchData();
  }, [setForumData]);

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

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const forumResponse = await fetchForum(token);
      setForumData(forumResponse);
    } catch (error) {
      console.error("Failed to post discussion:", error.message);
    }
  };

  const handleDelete = async (discussionId) => {
    try {
      await handleDeleteDiscussion(discussionId, setForumData);
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
      const updatedForumData = await fetchForum(localStorage.getItem("token"));
      setForumData(updatedForumData);

      console.log("Discussion updated successfully!");

      setIsEditing(false);
      setEditingDiscussionId(null);
      setNewDiscussion({ title: "", post_content: "" });
    } catch (error) {
      console.error("Failed to update discussion:", error.message);
    }
  };

  const handleLike = async (discussionId) => {
    try {
      const updatedDiscussion = await handleLikeDiscussion(
        discussionId,
        setForumData,
      );

      if (updatedDiscussion && updatedDiscussion.likes) {
        const updatedForumData = {
          ...forumData,
          data: forumData.data.map((discussion) =>
            discussion.id === discussionId
              ? { ...discussion, likes: updatedDiscussion.likes }
              : discussion,
          ),
        };
        setForumData(updatedForumData);
      }
    } catch (error) {
      console.error("Failed to like discussion:", error.message);
    }
  };

  const handleUnlike = async (discussionId) => {
    try {
      await handleUnlikeDiscussion(discussionId, setForumData);
      const updatedForumData = {
        ...forumData,
        data: forumData.data.map((discussion) =>
          discussion.id === discussionId
            ? {
                ...discussion,
                likes: discussion.likes.filter(
                  (userId) => userId !== currentUser.userId,
                ),
              }
            : discussion,
        ),
      };
      setForumData(updatedForumData);
    } catch (error) {
      console.error("Failed to unlike discussion:", error.message);
    }
  };

  if (
    isLoading ||
    forumData.isLoading ||
    forumData === null ||
    forumData.error
  ) {
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
                onChange={(e) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                value={newDiscussion.post_content}
                onChange={(e) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    post_content: e.target.value,
                  })
                }
                placeholder="Pertanyaan atau tanggapan kamu"
                className="border-2 border-gray-300 rounded-md p-2 w-full"
                rows={4}
              />
              <button
                type="submit"
                className="bg-teal-500 text-white py-1 px-4 mt-2 rounded-md float-right"
              >
                {isEditing ? "Perbarui" : "Kirim"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${
                  isEditing ? "block" : "hidden"
                } bg-yellow-500 text-white py-1 px-4 mt-2 mr-2 rounded-md float-right`}
              >
                Batal
              </button>
            </form>
            <div className="forumDetail overflow-y-auto overflow-x-hidden mt-8">
              {Array.isArray(forumData?.data) ? (
                forumData.data.map((discussion, index) => (
                  <div key={discussion.id} className="mb-8">
                    <div className="max-w-2xl border-2 border-slate-200 rounded-lg shadow-lg p-4 space-y-4">
                      <div className="flex gap-4 items-center">
                        <img
                          src={discussion.poster_profile}
                          alt={`user profile ${discussion.id}`}
                          className="rounded-full w-16"
                        />
                        <div>
                          <p className="font-semibold text-lg">
                            {discussion.poster_username}
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
                          onClick={() => handleLike(discussion.id)}
                          className={`${
                            discussion.likes &&
                            discussion.likes.includes(currentUser.userId)
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          } py-1 px-4 rounded-full flex items-center gap-1 text-white`}
                        >
                          <BiLike />
                          {discussion.likes ? discussion.likes.length : 0}
                        </button>
                        <Link
                          to={`/forum/${discussion.id}`}
                          className="bg-gray-300 py-1 px-4 rounded-full flex items-center gap-1 text-white"
                        >
                          <BiComment />{" "}
                          {discussion.comments && discussion.comments.length > 0
                            ? discussion.comments.length
                            : ""}
                        </Link>
                        {currentUser?.username ===
                          discussion.poster_username && (
                          <>
                            <button
                              onClick={() => handleDelete(discussion.id)}
                              className="bg-red-500 text-white py-1 px-4 rounded-full"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => handleEdit(discussion.id)}
                              className="bg-yellow-500 text-white py-1 px-4 rounded-full"
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
                <p></p>
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
