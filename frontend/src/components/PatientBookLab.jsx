// src/pages/PatientBookLab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/lab`; // Update your endpoint

const PatientBookLab = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
  });
  const token = localStorage.getItem("token");
  
const patientId = localStorage.getItem("userId"); // or decode from JWT
console.log("Patient ID from localStorage:", localStorage.getItem("userId"));



  // Fetch all labs on mount
  useEffect(() => {
    console.log("Fetching labs...");
    axios
      .get(`${API_BASE}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("Labs fetched:", res.data);
        setLabs(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load labs");
        console.error(err);
      });
  }, [token]);

  // Fetch tests whenever selectedLab changes
  useEffect(() => {
    if (selectedLab) {
      console.log("Fetching tests for lab:", selectedLab);
      axios
        .get(`${API_BASE}/tests/${selectedLab}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Tests fetched:", res.data);
          setLabTests(res.data);
        })
        .catch((err) => {
          toast.error("Failed to load tests for selected lab");
          console.error(err);
          setLabTests([]);
        });
    } else {
      setLabTests([]);
    }
  }, [selectedLab, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLab || !formData.testName) {
      toast.error("Please select a lab and a test.");
      return;
    }

    try {
      const payload = {
        labId: selectedLab,
        testName: formData.testName,
        description: formData.description,
        patientId: patientId,
      };

      console.log("Submitting form data:", payload);

      const res = await axios.post(`${API_BASE}/book-test`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Lab test booked successfully!");
      setFormData({ testName: "", description: "" });
      setSelectedLab("");
      setLabTests([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book lab test");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-5">
          Book Lab Test
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Lab Dropdown */}
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Lab --</option>
            {labs.map((lab) => (
              <option key={lab._id} value={lab._id}>
                {lab.name}
              </option>
            ))}
          </select>

          {/* Test Dropdown */}
          <select
            value={formData.testName}
            onChange={(e) =>
              setFormData({ ...formData, testName: e.target.value })
            }
            className="border p-2 rounded"
            required
            disabled={!labTests.length}
          >
            <option value="">
              {labTests.length ? "-- Select Test --" : "Select a lab first"}
            </option>
            {labTests.map((test, idx) => (
              <option key={idx} value={test}>
                {test}
              </option>
            ))}
          </select>

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Book Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientBookLab;
