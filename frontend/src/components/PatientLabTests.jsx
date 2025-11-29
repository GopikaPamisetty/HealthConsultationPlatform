// PatientLabTests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PatientLabTests = () => {
  const [tests, setTests] = useState([]);
  const [viewPdfUrl, setViewPdfUrl] = useState(null);
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId"); // logged-in patient
  const [loading, setLoading] = useState(false);

  // Fetch patient's tests
  const fetchTests = async () => {
    setLoading(true); 
    try {
      console.log("Fetching tests for patientId:", patientId);
      const res = await fetch(
       `${import.meta.env.VITE_API_BASE_URL}/api/lab-tests/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch test requests");
        console.error("Fetch returned an error:", data);
        return;
      }

      if (Array.isArray(data)) {
        console.log("Patient tests:", data);
      }

      setTests(data);
    } catch (err) {
      console.error("Error fetching tests:", err);
      toast.error("Error: " + err.message);
    }
    finally {
        setLoading(false); // stop loading
      }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Download PDF
  const handleDownload = async (testId, fileName = "result.pdf") => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/lab/download-result/${testId}`;
  
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Failed to download PDF");
  
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download PDF");
    }
  };
  

  // View PDF in modal
  const handleView = async (testId) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/lab/download-result/${testId}`;
    console.log("Opening PDF for testId:", testId, "URL:", url);

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch PDF");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      setViewPdfUrl(blobUrl);
      console.log("PDF blob URL:", blobUrl);
    } catch (err) {
      console.error("Error opening PDF:", err);
      toast.error("Failed to open PDF");
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5 text-indigo-700">
        My Lab Test Requests
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-5">
  {loading ? (
    <p className="text-center text-gray-500">Loading lab test requests...</p>
  ) : tests.length === 0 ? (
    <p className="text-center text-gray-500">No lab test requests found</p>
  ) : (
    <table className="w-full text-left border-collapse">
      {/* ... your existing table code ... */}
  
            <thead>
              <tr>
                <th className="border-b p-2">Test</th>
                <th className="border-b p-2">Status</th>
                <th className="border-b p-2">Requested At</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id} className="border-b">
                  <td className="p-2">{test.testName}</td>
                  <td
                    className={`p-2 capitalize font-semibold ${
                      test.status === "pending"
                        ? "text-yellow-600"
                        : test.status === "accepted"
                        ? "text-blue-600"
                        : test.status === "completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {test.status}
                  </td>
                  <td className="p-2">
                    {new Date(test.requestedAt).toLocaleString()}
                  </td>
                  <td className="p-2 space-x-2">
                    {test.status === "completed" && test.resultFile && (
                      <>
                        <button
                          onClick={() =>
                            handleDownload(
                              test._id,
                              `${test.testName}-result.pdf`
                            )
                          }
                          className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                        >
                          Download Result
                        </button>

                        <button
                          onClick={() => handleView(test._id)}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          View Result
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PDF Modal */}
      {viewPdfUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-4/5 md:w-3/4 h-4/5 rounded-lg shadow-lg relative">
            <button
              onClick={() => setViewPdfUrl(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-10"
            >
              Close
            </button>
            <iframe
              src={viewPdfUrl}
              title="Test Result"
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientLabTests;
