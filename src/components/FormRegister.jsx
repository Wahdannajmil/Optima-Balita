import { useContext, useState } from "react";
import { Envelope, PersonCircle, LockFill } from "react-bootstrap-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import imgSide from "../assets/img/icon_bg.png";
import imgBg from "../assets/bg-logreg.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const success = await register(username, email, password);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Akun Berhasil Dibuat",
          text: "Login untuk melanjutkan",
        }).then(() => {
          handleRegisterSuccess();
        });
        console.log("Registration successful");
      } else {
        setErrorMessage("Terjadi kesalahan. Coba lagi nanti.");
      }
    } catch (error) {
      if (error.message) {
        console.log(error.message);
        if (error.message.includes("password")) {
          setErrorMessage("Password anda kurang kuat.");
        } else if (error.message.includes("email")) {
          setErrorMessage("Email tidak valid.");
        } else if (error.message.includes("Email")) {
          setErrorMessage("Email sudah terdaftar.");
        } else {
          setErrorMessage(error.message);
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage("error");
      } else {
        setErrorMessage("Terjadi kesalahan. Coba lagi nanti.");
      }
      console.error("Error during registration:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pl- flex flex-col-reverse md:flex-row items-center justify-around min-h-screen font-sans">
      <div className="w-full max-w-md flex overflow-hidden">
        <div className="w-full p-8">
          <h1 className="text-center pb-16 text-2xl font-bold text-black">
            Silahkan login untuk melanjutkan
          </h1>
          <div className="flex pb-8">
            <NavLink
              to="/login"
              className="text-3xl font-bold flex-1 pl-10 opacity-50"
              style={{ color: "rgba(17, 118, 143, 255)" }}
            >
              Masuk
            </NavLink>
            <NavLink
              to="/register"
              className="text-3xl font-bold flex-1 underline"
              style={{ color: "rgba(17, 118, 143, 255)" }}
            >
              Daftar
            </NavLink>
          </div>
          <form onSubmit={handleSubmit} className="px-0">
            <div className="mb-6 pb-4">
              <div
                className="flex items-center bg-white rounded-full p-2 pl-4 shadow-lg"
                style={{
                  boxShadow: "-4px 4px 6px 0px rgba(200,235,229,255)",
                }}
              >
                <div className="mr-3 text-gray-400">
                  <PersonCircle color="rgba(17, 118, 143, 255)" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="w-full bg-transparent focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>
            </div>
            <div className="mb-6 pb-4">
              <div
                className="flex items-center bg-white rounded-full p-2 pl-4 shadow-lg"
                style={{
                  boxShadow: "-4px 4px 6px 0px rgba(200,235,229,255)",
                }}
              >
                <div className="mr-3 text-gray-400">
                  <Envelope color="rgba(17, 118, 143, 255)" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-transparent focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email kamu"
                  required
                />
              </div>
            </div>
            <div className="mb-6 pb-4">
              <div
                className="flex items-center bg-white rounded-full p-2 pl-4 shadow-lg"
                style={{
                  boxShadow: "-4px 4px 6px 0px rgba(200,235,229,255)",
                }}
              >
                <div className="mr-3 text-gray-400">
                  <LockFill color="rgba(17, 118, 143, 255)" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full bg-transparent focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
                <div className="ml-2" style={{ padding: "4px" }}>
                  {showPassword ? (
                    <EyeSlash
                      onClick={togglePasswordVisibility}
                      style={{
                        cursor: "pointer",
                        color: "rgba(17, 118, 143, 255)",
                      }}
                    />
                  ) : (
                    <Eye
                      onClick={togglePasswordVisibility}
                      style={{
                        cursor: "pointer",
                        color: "rgba(17, 118, 143, 255)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white font-bold py-1 px-3 rounded-full flex-1 mb-2"
              style={{ backgroundColor: "rgba(17, 118, 143, 255)" }}
            >
              Daftar
            </button>
            <p className="text-center text-gray-800 mb-4">
              {errorMessage && (
                <span className="text-red-500 text-sm">{errorMessage}</span>
              )}
              <br />
              Sudah punya akun?{" "}
              <NavLink
                to="/login"
                className="text-1xl font-bold text-gray-800"
                style={{ color: "#377389" }}
              >
                Masuk
              </NavLink>
            </p>
          </form>
        </div>
      </div>
      <div
        className="w-full max-w-md flex bg-none overflow-hidden"
        style={{ overflow: "hidden" }}
      >
        <div className="w-full mx-auto">
          <img src={imgSide} alt="Side Image" className="w-full" />
        </div>
      </div>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imgBg})`, zIndex: "-1" }}
      ></div>
    </div>
  );
};

export default RegisterForm;
