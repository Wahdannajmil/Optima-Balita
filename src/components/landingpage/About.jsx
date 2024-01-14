import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight } from "react-icons/fa";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <section className="bg-white py-5" id="about">
        <div className="container py-lg-5">
          <div
            className="flex flex-col md:flex-row justify-center items-center mb-5"
            data-aos="fade-up"
          >
            <div className="md:w-1/2 mb-4 md:mb-0">
              <img
                src="https://i.postimg.cc/66HgKtmK/tentang-kami.jpg"
                className="w-3/4 md:w-100 rounded-lg md:justify-center mx-auto hover:shadow-lg transition-shadow"
                alt="about image"
              />
            </div>
            <div className="md:w-1/2 p-4">
              <div>
                <h4 className="font-bold mb-3 text-2xl sm:text-3xl">
                  Tentang Optima Balita
                </h4>
                <p className="font-normal mb-3 text-md sm:text-lg text-gray-800">
                  Optima Balita merupakan sebuah website yang bergerak di bidang
                  kesehatan. Website ini menyediakan berbagai fitur yang dapat
                  digunakan secara gratis oleh pengguna. Optima Balita hadir
                  untuk berbagi informasi penting mengenai stunting kepada
                  pengguna dan menyediakan ruang diskusi bagi pengguna yang
                  mengalami kesulitan, baik dalam pencegahan stunting maupun
                  pengobatan stunting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
