import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white mt-36 pl-16 pr-16 bg-teal-700">
      <div className="container p-4 mx-auto justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-3">
          <div className="">
            <h6 className="text-uppercase mb-4 font-bold text-md md:text-xl">
              Optima Balita
            </h6>
            <p className="text-white font-normal text-base">
              Apabila terdapat kendala saat mengakses website, atau terdapat
              pelanggaran yang terjadi di forum diskusi. Silahkan hubungi kami
              melalui kontak berikut :
            </p>
            <div className="flex mt-4">
              <NavLink
                to="#"
                className="btn btn-outline-light btn-floating m-1"
              >
                <FaFacebookF className="text-white" />
              </NavLink>
              <NavLink
                to="#"
                className="btn btn-outline-light btn-floating m-1"
              >
                <FaTwitter className="text-white" />
              </NavLink>
              <NavLink
                to="#"
                className="btn btn-outline-light btn-floating m-1"
              >
                <FaGoogle className="text-white" />
              </NavLink>
              <NavLink
                to="#"
                className="btn btn-outline-light btn-floating m-1"
              >
                <FaInstagram className="text-white" />
              </NavLink>
            </div>
          </div>

          <div className="ml-0 md:ml-4">
            <h6 className="mb-4 font-bold text-lg">Produk</h6>
            <p>
              <NavLink to="/" className="text-white font-normal text-base">
                Home
              </NavLink>
            </p>
            <p>
              <NavLink
                to="/article"
                className="text-white font-normal text-base"
              >
                Artikel
              </NavLink>
            </p>
            <p>
              <NavLink to="/forum" className="text-white font-normal text-base">
                Forum Diskusi
              </NavLink>
            </p>
            <p>
              <NavLink to="/bmi" className="text-white font-normal text-base">
                BMI
              </NavLink>
            </p>
          </div>

          <div className="">
            <h6 className="mb-4 font-bold text-lg">Service</h6>
            <p>
              <NavLink to="#" className="text-white font-normal text-base">
                Video
              </NavLink>
            </p>
            <p>
              <NavLink
                to="/article"
                className="text-white font-normal text-base"
              >
                Artikel
              </NavLink>
            </p>
            <p>
              <NavLink to="/bmi" className="text-white font-normal text-base">
                Kalkulator BMI
              </NavLink>
            </p>
            <p>
              <NavLink to="/forum" className="text-white font-normal text-base">
                Stunting Talk
              </NavLink>
            </p>
          </div>

          <div className="">
            <h6 className="mb-4 font-bold text-lg">Kontak kami</h6>
            <p>
              <NavLink to="/" className="text-white font-normal text-base">
                Semarang
              </NavLink>
            </p>
            <p>
              <NavLink to="/" className="text-white font-normal text-base">
                najmilwahdan@gmail.com
              </NavLink>
            </p>
            <p>
              <NavLink to="/" className="text-white font-normal text-base">
                +62 823-3184-4648
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
