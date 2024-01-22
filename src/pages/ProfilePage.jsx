import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Footer from "../components/Footer";
const ProfilePage = () => {
  const { currentUser, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [profile, setProfile] = useState(currentUser?.profile || "");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Add state for the profile image

  const handleUpdateProfile = async () => {
    if (name === "") {
      setNameError("Nama tidak boleh kosong");
      return;
    }

    if (email === "") {
      setEmailError("Email tidak boleh kosong");
      return;
    }

    try {
      const updateData = {
        username: name,
        email: email,
        profile: profileImage,
        current_password: password,
        password: newPassword,
      };

      if (password !== "" && newPassword === "") {
        Swal.fire({
          icon: "error",
          title: "Password Baru Kosong",
          text: "Password baru tidak boleh kosong",
        });
        return;
      } else if (password === "" && newPassword !== "") {
        Swal.fire({
          icon: "error",
          title: "Password Lama Kosong",
          text: "Password lama tidak boleh kosong",
        });
        return;
      }

      const success = await updateProfile(updateData);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Profile Berhasil Diubah",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      if (error.response.data.message.includes("strong")) {
        Swal.fire({
          icon: "error",
          title: "Profile Gagal Diubah",
          text: "Password baru kurang kuat.",
        });
        return;
      } else if (error.response.data.message.includes("Invalid")) {
        Swal.fire({
          icon: "error",
          title: "Profile Gagal Diubah",
          text: "Password lama salah.",
        });
        return;
      } else if (error.response.data.message.includes("email")) {
        Swal.fire({
          icon: "error",
          title: "Profile Gagal Diubah",
          text: "Email tidak valid.",
        });
        return;
      } else if (error.response.data.message.includes("taken")) {
        Swal.fire({
          icon: "error",
          title: "Profile Gagal Diubah",
          text: "Email sudah digunakan.",
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Profile Gagal Diubah",
          text: error.response.data.message,
        });
      }
    }
  };

  const toggleShowCurrPassword = () => {
    setShowCurrPassword(!showCurrPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout?",
      text: "Apakah anda yakin akan logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  // Function to handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setProfileImage(null);
    setProfile(currentUser?.profile || ""); // Reset to the original profile image
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setProfile(currentUser?.profile || "");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 flex justify-center">
        <div className="max-w-md w-full bg-white border-2 border-gray-300 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Profil Akun Anda
          </h1>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="text-lg font-semibold mb-2 block"
            >
              Foto Profil
            </label>
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-white">
                <img
                  src={profile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profileImage"
                className="ml-6 cursor-pointer text-blue-500"
              >
                Ubah Foto
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {profileImage && (
              <div className="flex justify-center mt-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleResetImage}
                >
                  Reset Image
                </button>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="text-lg font-semibold mb-2 block">
              Nama
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded focus:outline-none"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
            <span className="text-red-500 block mt-2">{nameError}</span>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-lg font-semibold mb-2 block">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded focus:outline-none"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="text-red-500 block mt-2">{emailError}</span>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-lg font-semibold mb-2 block"
            >
              Kata sandi saat ini
            </label>
            <div className="relative">
              <input
                type={showCurrPassword ? "text" : "password"}
                id="password"
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded pr-10 focus:outline-none"
                value={password}
                placeholder="Masukkan kata sandi Anda"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={toggleShowCurrPassword}
              >
                {showCurrPassword ? (
                  <EyeSlash color="#718096" />
                ) : (
                  <Eye color="#718096" />
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="text-lg font-semibold mb-2 block"
            >
              Kata sandi baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded pr-10 focus:outline-none"
                value={newPassword}
                placeholder="Masukkan kata sandi baru Anda"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={toggleShowNewPassword}
              >
                {showNewPassword ? (
                  <EyeSlash color="#718096" />
                ) : (
                  <Eye color="#718096" />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="w-full text-white font-bold py-2 rounded-full flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="w-5" />
            <button
              className="w-full text-white font-bold py-2 rounded-full flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={handleUpdateProfile}
            >
              Simpan Profil
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
