// src/pages/LabDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LabDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // if no user, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Add handleUpload function here
  const handleUpload = async (file, testId) => {
    if (!file || !testId) {
      toast.error("File or Test ID missing");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/lab/upload-result/${testId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("File uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Welcome, {user?.name || "Lab"}!
        </h1>
        <p className="text-gray-600 mb-5">
          Email: <span className="font-medium">{user?.email}</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/lab-test-request")}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View Test Requests
          </button>
          <button
            onClick={() => navigate("/lab-reports")}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View Reports
          </button>
          <button
            onClick={() => navigate("/lab-profile")}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Optional: Quick Upload Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Upload Test Result</h2>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              const testId = prompt("Enter Test ID to upload for:"); // simple input for now
              handleUpload(file, testId);
            }}
            className="border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
