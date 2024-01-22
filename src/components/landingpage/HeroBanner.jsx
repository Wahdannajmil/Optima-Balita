import { NavLink } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import BgHero from "../../assets/img/bg_hero.jpg";
import { FaBook, FaCalculator, FaComments } from "react-icons/fa";

const HeroBanner = () => {
  const props = useSpring({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: { opacity: 1, transform: "translateX(0%)" },
    config: { tension: 140, friction: 10 },
  });

  return (
    <>
      <main>
        <div className="pt-40 pb-60 flex content-center items-center justify-center">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${BgHero})` }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-60 bg-black"
            ></span>
          </div>
          <animated.div
            style={props}
            className="container relative ml-10 mr-10"
          >
            <div className="items-center flex">
              <div className="w-full lg:w-6/12 px-4">
                <h1 className="text-white font-bold text-3xl md:text-5xl">
                  Tumbuh Sehat, Lawan Stunting Bersama Kami!
                </h1>
                <p className="mt-4 text-lg text-gray-300 font-medium">
                  Kami hadir untuk mendukung perjalanan dalam mengatasi masalah
                  stunting dan mencapai kesehatan bersama.
                </p>
                <div className="mt-8">
                  <NavLink
                    to="/forum"
                    className="py-3 px-7 font-medium rounded-full text-md bg-gradient-to-r from-teal-600 to-teal-400 text-white hover:bg-teal-500"
                  >
                    Get Started
                  </NavLink>
                </div>
              </div>
            </div>
          </animated.div>
        </div>
      </main>
      <div className="features flex flex-wrap md:mx-10">
        <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
            <div className="px-4 py-5 flex-auto">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-red-400">
                <FaCalculator size={32} />
              </div>
              <h6 className="text-xl font-semibold">
                Pantau Tumbuh Kembang Anak
              </h6>
              <p className="mt-2 mb-4 text-blueGray-500">
                Fitur Status Gizi di OptimaBalita telah dilengkapi dengan
                riwayat perhitungan, sehingga memudahkan pemantauan pertumbuhan
                anak
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-4/12 px-4 text-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
            <div className="px-4 py-5 flex-auto">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-blue-400">
                <FaBook size={32} />
              </div>
              <h6 className="text-xl font-semibold">
                Informasi Stunting Terlengkap
              </h6>
              <p className="mt-2 mb-4 text-blueGray-500">
                Dapatkan informasi mengenai stunting, pencegahan serta
                penanganan stunting terlengkap disini
              </p>
            </div>
          </div>
        </div>

        <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
            <div className="px-4 py-5 flex-auto">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-emerald-400">
                <FaComments size={32} />
              </div>
              <h6 className="text-xl font-semibold">Forum Diskusi Stunting</h6>
              <p className="mt-2 mb-4 text-blueGray-500">
                Forum diskusi merupakan tempat yang aman untuk memberikan
                kesempatan dan dukungan dalam upaya mengatasi masalah stunting
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HeroBanner;
