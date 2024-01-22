import { useContext, useState } from "react";
import { BMIContext } from "../contexts/BmiContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const BmiCalculator = () => {
  const { bmiList, addBMIEntry } = useContext(BMIContext);

  const [formBmiState, setFormBmiState] = useState({
    child_name: "",
    age_text: "",
    height: "",
    weight: "",
    weight_category: "",
    gender: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [namaError, setNamaError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [tinggiError, setTinggiError] = useState("");
  const [beratError, setBeratError] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const currentDate = new Date();
    const selectedDateOfBirth = new Date(date);
    const ageDiff = Math.floor(
      (currentDate - selectedDateOfBirth) / (1000 * 60 * 60 * 24 * 30.44),
    );
    const years = Math.floor(ageDiff / 12);
    const months = ageDiff % 12;
    const ageBabyText =
      years !== 0 ? `${years} tahun ${months} bulan` : `${months} bulan`;
    setFormBmiState({ ...formBmiState, age_text: ageBabyText });
  };

  const calculateBMI = (event) => {
    event.preventDefault();
    const { child_name, age_text, height, weight, gender } = formBmiState;
    const tinggiNum = parseInt(height);
    const beratNum = parseInt(weight);

    if (child_name === "") {
      setNamaError("Mohon isi data dengan nama");
    } else {
      setNamaError("");
    }

    if (age_text === "") {
      setAgeError("Mohon pilih tanggal lahir");
    } else {
      setAgeError("");
    }

    if (gender === "") {
      setGenderError("Mohon pilih jenis kelamin");
    } else {
      setGenderError("");
    }

    if (isNaN(tinggiNum) || tinggiNum <= 0) {
      setTinggiError("Mohon isi data dengan angka");
    } else {
      setTinggiError("");
    }

    if (isNaN(beratNum) || beratNum <= 0) {
      setBeratError("Mohon isi data dengan angka");
    } else {
      setBeratError("");
    }

    if (
      tinggiNum > 0 &&
      beratNum > 0 &&
      child_name != "" &&
      age_text != "" &&
      gender != ""
    ) {
      const newBMIEntry = {
        child_name: formBmiState.child_name,
        age_text: formBmiState.age_text,
        gender: formBmiState.gender,
        height: formBmiState.height,
        weight: formBmiState.weight,
      };

      addBMIEntry(newBMIEntry);
    }
  };

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);

  return (
    <>
      <section className="flex justify-center p-8 px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg p-4 gap-4 md:p-6">
          <div className="flex flex-col max-w-md md:max-w-full rounded-lg">
            <div className="space-y-4">
              <form className="space-y-3 md:space-y-4 bg-white p-4 rounded-lg">
                <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-xl">
                  Kalkulator Status Gizi
                </h1>
                <div>
                  <p
                    className="block mb-2 text-sm font-medium text-gray-900"
                    id="masukanNama"
                  >
                    Nama Balita
                  </p>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="text"
                    placeholder="Andi Law"
                    value={formBmiState.child_name}
                    onChange={(e) => {
                      setFormBmiState({
                        ...formBmiState,
                        child_name: e.target.value,
                      });
                      const selectedBmi = bmiList.find(
                        (bmi) => bmi.child_name === formBmiState.child_name,
                      );
                      setFormBmiState({
                        ...formBmiState,
                        gender: selectedBmi.gender,
                      });
                    }}
                  />
                  <span id="namaError" style={{ color: "red" }}>
                    {namaError}
                  </span>
                </div>
                <div>
                  <h2>Tanggal Lahir:</h2>
                  <div className="flex items-center">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Pilih Tanggal"
                      className="p-2 rounded-md"
                      minDate={minDate}
                      maxDate={new Date()}
                    />
                    <span className="text-md pt-1 font-medium">
                      {formBmiState.age_text}
                    </span>
                  </div>
                </div>
                <span id="ageError" style={{ color: "red" }}>
                  {ageError}
                </span>
                <div>
                  <p
                    className="block mb-2 text-sm font-medium text-gray-900"
                    id="jenisKelamin"
                  >
                    Jenis Kelamin
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Laki-laki"
                        checked={formBmiState.gender === "Laki-laki"}
                        onChange={() => {
                          const selectedBmi = bmiList.find(
                            (bmi) => bmi.child_name === formBmiState.child_name,
                          );
                          setFormBmiState({
                            ...formBmiState,
                            gender: selectedBmi
                              ? selectedBmi.gender
                              : "Laki-laki",
                          });
                        }}
                      />
                      <span className="ml-2">Laki-laki</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Perempuan"
                        checked={formBmiState.gender === "Perempuan"}
                        onChange={() => {
                          const selectedBmi = bmiList.find(
                            (bmi) => bmi.child_name === formBmiState.child_name,
                          );
                          setFormBmiState({
                            ...formBmiState,
                            gender: selectedBmi
                              ? selectedBmi.gender
                              : "Perempuan",
                          });
                        }}
                      />
                      <span className="ml-2">Perempuan</span>
                    </label>
                  </div>
                  <span id="genderError" style={{ color: "red" }}>
                    {genderError}
                  </span>
                </div>
                <div>
                  <p
                    className="block mb-2 text-sm font-medium text-gray-900"
                    id="tinggiBadan"
                  >
                    Masukkan tinggi badan anak (CM)
                  </p>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="number"
                    value={formBmiState.height}
                    onChange={(e) =>
                      setFormBmiState({
                        ...formBmiState,
                        height: e.target.value,
                      })
                    }
                    placeholder="73"
                  />
                  <span id="tinggiError" style={{ color: "red" }}>
                    {tinggiError}
                  </span>
                  <div className="p-4 bg-slate-300 rounded-xl mt-2">
                    <p className="text-slate-500">
                      Keterangan Pengukuran Tinggi
                    </p>
                    <li className="text-slate-500">
                      Balita usia 0-23 bulan dihitung dengan posisi terlentang
                    </li>
                    <li className="text-slate-500">
                      Balita usia 24-59 bulan dihitung dengan posisi berdiri
                    </li>
                  </div>
                </div>
                <div>
                  <p
                    className="block mb-2 text-sm font-medium text-gray-900"
                    id="beratBadan"
                  >
                    Masukkan berat badan anak (KG)
                  </p>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="number"
                    value={formBmiState.weight}
                    onChange={(e) =>
                      setFormBmiState({
                        ...formBmiState,
                        weight: e.target.value,
                      })
                    }
                    placeholder="9"
                  />
                  <span id="beratError" style={{ color: "red" }}>
                    {beratError}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition duration-300"
                    onClick={calculateBMI}
                  >
                    Hitung
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col max-w-md md:max-w-full">
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <h1 className="text-lg font-bold text-center leading-tight tracking-tight md:text-xl">
                Riwayat Status Gizi
              </h1>
              {bmiList.length > 0 ? (
                <div>
                  <table className="w-full border-collapse">
                    <thead className="text-md text-left font-medium text-gray-900">
                      <tr>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          Nama
                        </th>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          Umur
                        </th>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          TB
                        </th>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          BB
                        </th>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          IMT
                        </th>
                        <th className="border-b border-gray-500 md:px-4 px-1">
                          Kategori IMT/U
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bmiList.map((bmi) => (
                        <tr key={bmi.id} className="text-sm text-gray-900">
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2 ">
                            {bmi.child_name}
                          </td>
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2">
                            {bmi.age_text}
                          </td>
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2">
                            {bmi.height}
                          </td>
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2">
                            {bmi.weight}
                          </td>
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2">
                            {bmi.bmi}
                          </td>
                          <td className="border-b border-gray-500 md:px-4 px-1 py-2">
                            {bmi.weight_category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-900">Riwayat BMI kosong</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
