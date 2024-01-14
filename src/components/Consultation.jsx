import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/ConsultantDetails.css";

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
    <div className="bg-white py-16 mx-auto">
      <div className="container px-16 mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-teal-500">
          Silahkan melakukan konsultasi melalui WhatsApp
        </h2>
      </div>
      <div className="container px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading && <p>Loading...</p>}
        {consultationData &&
          consultationData.map((consultant) => (
            <div
              key={consultant.id}
              className={`consultant-card bg-gray-100 p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                hoveredCard === consultant.id ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredCard(consultant.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
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
              {hoveredCard === consultant.id && ( // Show the form only when the card is hovered
                <div className="mt-6 form-container">
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Nama Balita"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Alamat"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Keluhan"
                      name="complaint"
                      value={formData.complaint}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <button
                    onClick={() => handleSubmit(consultant.consultant_phone)}
                    className="block bg-teal-500 text-white text-center mt-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
                  >
                    <FaWhatsapp className="mr-2" />
                    Chat via WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConsultantDetails;
