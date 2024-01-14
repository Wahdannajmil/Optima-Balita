import axios from "axios";

const apiUrl = "https://www.givxl33t.site/api/auth";

export const getUsers = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Gagal mendapatkan data pengguna:", error);
    throw error;
  }
};

export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, user);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  const response = await axios.post(apiUrl, user);
  return response.data;
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Gagal mendapatkan data pengguna:", error);
    throw error;
  }
};

export const saveUserToApi = async (user) => {
  try {
    const response = await axios.post(apiUrl, user);
    console.log("User berhasil disimpan:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal menyimpan user:", error);
    throw error;
  }
};

export const getUserFromApi = (email, password) => {
  const url = "https://www.givxl33t.site/api/auth";
  return axios.get(url).then((response) => {
    const users = response.data;

    for (let user of users) {
      if (user.email === email && user.password === password) {
        return user;
      }
    }

    return null;
  });
};

export const removeUserFromApi = async () => {
  try {
    const response = await axios.delete(apiUrl);
    console.log("User berhasil dihapus");
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    throw error;
  }
};

export const updateUserInApi = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${apiUrl}/${userId}`, updatedUser);
    console.log("User berhasil diupdate:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal mengupdate user:", error);
    throw error;
  }
};

export const updateUser = async (userId, updateData, token) => {
  try {
    const response = await axios.put(
      `${apiUrl}/profile/${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("User berhasil diupdate:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal mengupdate user:", error);
    throw error;
  }
};
export async function fetchArticles() {
  const response = await fetch("https://www.givxl33t.site/api/article");
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data = await response.json();
  return data;
}
export async function fetchArticlesRandom() {
  const response = await fetch(
    "https://www.givxl33t.site/api/article?limit=3&page=1&sort=RANDOM",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data = await response.json();
  return data;
}

export async function fetchArticlesId(articleId) {
  try {
    const response = await fetch(
      `https://www.givxl33t.site/api/article/${articleId}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch article with ID ${articleId}. Status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

const BASE_URL = "https://www.givxl33t.site/api/forum";

export const fetchForum = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}?option=WITHCOMMENT`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)?.accessToken}`,
      },
    });

    console.log("Raw API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch forum discussions:", error);

    if (axios.isAxiosError(error)) {
      throw new Error(`HTTP error! Status: ${error.response?.status}`);
    } else {
      throw new Error(
        `Failed to fetch forum discussions. Error: ${error.message}`,
      );
    }
  }
};

export const postDiscussion = async (discussion, currentUser, setForumData) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.post(
      BASE_URL,
      {
        ...discussion,
        userId: currentUser.userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    setForumData((prevData) => ({
      ...prevData,
      data: [response.data, ...prevData.data],
      error: false,
    }));

    return response.data;
  } catch (error) {
    console.error("Failed to post discussion:", error.message);
    if (error.response) {
      console.error("Server responded with:", error.response.data);
    }
    throw new Error("Failed to post discussion");
  }
};

export const postComment = async (discussionId, comment) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.post(
      `${BASE_URL}/${discussionId}/comment`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to post comment");
  }
};

export const handleUpdateDiscussion = async (
  discussionId,
  updatedDiscussion,
  setForumData,
) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.put(
      `${BASE_URL}/${discussionId}`,
      updatedDiscussion,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const updatedDiscussionFromAPI = response.data;

    setForumData((prevData) => ({
      data: Array.isArray(prevData?.data)
        ? {
            data: prevData.data.map((discussion) =>
              discussion.id === discussionId
                ? updatedDiscussionFromAPI
                : discussion,
            ),
          }
        : { data: [] },
    }));
  } catch (error) {
    console.error("Failed to update discussion:", error.message);
  }
};

export const handleUpdateComment = async (
  discussionId,
  commentId,
  updatedComment,
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${discussionId}/comment/${commentId}`,
      updatedComment,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token")).accessToken
          }`,
          "Content-Type": "application/json",
        },
      },
    );

    const updatedCommentFromAPI = response.data;

    setForumData((prevData) => ({
      data: Array.isArray(prevData?.data)
        ? {
            data: prevData.data.map((discussion) =>
              discussion.id === discussionId
                ? {
                    ...discussion,
                    comments: discussion.comments.map((comment) =>
                      comment.id === commentId
                        ? updatedCommentFromAPI
                        : comment,
                    ),
                  }
                : discussion,
            ),
          }
        : { data: [] },
    }));
  } catch (error) {
    console.error("Failed to update comment:", error.message);
  }
};

export const handleLikeDiscussion = async (discussionId, setLikesData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${discussionId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token")).accessToken
          }`,
        },
      },
    );
    const updatedDiscussionFromAPI = response.data;

    setLikesData(updatedDiscussionFromAPI);
  } catch (error) {
    console.error("Failed to like discussion:", error.message);
  }
};

export const handleUnlikeDiscussion = async (discussionId, setLikesData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${discussionId}/unlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token")).accessToken
          }`,
        },
      },
    );
    const updatedDiscussionFromAPI = response.data;

    setLikesData(updatedDiscussionFromAPI);
  } catch (error) {
    console.error("Failed to unlike discussion:", error.message);
  }
};

export const deleteDiscussion = async (discussionId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.delete(`${BASE_URL}/${discussionId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete discussion");
  }
};

export const handleDeleteDiscussion = async (discussionId, setForumData) => {
  try {
    await deleteDiscussion(discussionId);
    setForumData((prevData) => ({
      data: Array.isArray(prevData?.data)
        ? {
            data: prevData.data.filter(
              (discussion) => discussion.id !== discussionId,
            ),
          }
        : { data: [] },
    }));
    const token = localStorage.getItem("token");
    if (token) {
      const forumResponse = await fetchForum(token);
      setForumData(forumResponse);
    }
  } catch (error) {
    console.error("Failed to delete discussion:", error.message);
  }
};

export const deleteComment = async (discussionId, commentId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.delete(
      `${BASE_URL}/${discussionId}/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete comment");
  }
};

export const handleDeleteComment = async (
  discussionId,
  commentId,
  setForumData,
) => {
  try {
    await deleteComment(discussionId, commentId);
    setForumData((prevData) => ({
      data: Array.isArray(prevData?.data)
        ? {
            data: prevData.data.map((discussion) => {
              if (discussion.id === discussionId) {
                return {
                  ...discussion,
                  comments: discussion.comments.filter(
                    (comment) => comment.id !== commentId,
                  ),
                };
              } else {
                return discussion;
              }
            }),
          }
        : { data: [] },
    }));
  } catch (error) {
    console.error("Failed to delete comment:", error.message);
  }
};

export const handlePostComment = async (
  discussionId,
  newComment,
  setForumData,
) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await axios.post(
      `${BASE_URL}/${discussionId}/comment`,
      { text: newComment },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const createdCommentFromAPI = response.data;

    setForumData((prevData) => ({
      data: Array.isArray(prevData?.data)
        ? {
            data: prevData.data.map((discussion) => {
              if (discussion.id === discussionId) {
                return {
                  ...discussion,
                  comments: [...discussion.comments, createdCommentFromAPI],
                };
              } else {
                return discussion;
              }
            }),
          }
        : { data: [] },
    }));
  } catch (error) {
    console.error("Failed to post comment:", error.message);
  }
};
