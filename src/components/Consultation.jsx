import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

const ConsultantDetails = () => {
  const [consultationData, setConsultationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    complaint: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (consultantPhone) => {
    const message = `Nama Balita: ${formData.name}%0AAlamat: ${formData.address}%0AKeluhan: ${formData.complaint}`;
    const whatsappLink = `https://wa.me/${consultantPhone}?text=${encodeURIComponent(
      message,
    )}`;
    window.location.href = whatsappLink;
  };

  const CustomArrow = ({ className, onClick, icon }) => (
    <div className={`${className} arrow`} onClick={onClick}>
      {icon}
    </div>
  );

  const NextArrow = (props) => (
    <CustomArrow {...props} icon={<FaChevronRight />} />
  );

  const PrevArrow = (props) => (
    <CustomArrow {...props} icon={<FaChevronLeft />} />
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)?.accessToken}`,
          },
        };

        const response = await axios.get(
          "https://www.givxl33t.site/api/consultation/consultant",
          config,
        );

        console.log("API Response:", response.data);

        if (Array.isArray(response.data.data)) {
          setConsultationData(response.data.data);
        } else {
          console.error("Invalid data structure in API response");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white py-16 mx-auto pb-96">
      <div className="container px-16 mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-teal-500">
          Silahkan melakukan konsultasi melalui WhatsApp
        </h2>
      </div>
      <div className=" py-16 lg:grid-cols-3 xl:grid-cols-4 sm:px-24">
        <Slider {...sliderSettings} className="mx-auto max-w-2xl">
          {loading && <p>Loading...</p>}
          {consultationData &&
            consultationData.map((consultant) => (
              <div
                key={consultant.id}
                className={`consultant-card bg-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                  hoveredCard === consultant.id ? "hovered" : ""
                }`}
                onMouseEnter={() => setHoveredCard(consultant.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="max-w-md bg-white p-8 rounded-lg shadow-lg">
                  <div className="text-center">
                    <img
                      src={consultant.consultant_profile}
                      alt={consultant.consultant_username}
                      className="w-32 h-32 mx-auto mb-4 rounded-full"
                    />
                    <h1 className="text-xl font-semibold mb-2">
                      {consultant.consultant_username}
                    </h1>
                    <p className="text-gray-800 text-sm">
                      {consultant.consultant_description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-400 text-white rounded-full flex items-center justify-center">
                        <FaWhatsapp size={32} />{" "}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold">
                          Hubungi Sekarang
                        </h2>
                        <p className="text-gray-500">Melalui WhatsApp</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${consultant.consultant_phone}`}
                      className="block bg-teal-500 text-white text-center mt-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
                    >
                      Chat via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default ConsultantDetails;
