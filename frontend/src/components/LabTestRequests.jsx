// LabTestRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LabTestRequests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [file, setFile] = useState(null);
  const [viewPdfUrl, setViewPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const token = localStorage.getItem("token");

  // Fetch tests
  const fetchTests = async () => {
    setLoading(true); // ✅ start loading
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Current user from localStorage:", user);

      console.log("Fetching lab tests...");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab-tests/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch test requests");
        console.error("Fetch returned an error:", data);
        setTests([]); // clear previous data if error
        return;
      }

      if (Array.isArray(data)) {
        data.forEach(t => console.log(t.testName, t.status, t.result));
      }

      setTests(data);
      console.log("Lab tests set in state:", data);
    } catch (err) {
      console.error("Error fetching tests:", err);
      toast.error("Error: " + err.message);
      setTests([]);
    } finally {
      setLoading(false); // ✅ finish loading
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Update status
  const handleUpdate = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lab-tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Failed to update test");
      else {
        toast.success("Status updated");
        fetchTests();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!file || !selectedTest) {
      console.log("No file or test selected");
      return toast.error("Select a file");
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file.name, "for test:", selectedTest._id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/lab/upload-result/${selectedTest._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );

      console.log("Upload response:", res.data);
      toast.success(res.data.message || "File uploaded successfully");

      setSelectedTest(null);
      setFile(null);

      fetchTests();
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  // Download file
  const handleDownload = (testId, fileName = "result.pdf") => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/lab/download-result/${testId}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.click();
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
      <h1 className="text-2xl font-bold mb-5 text-indigo-700">Lab Test Requests</h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-5">
        {loading ? ( // ✅ Show loading while fetching
          <p className="text-center text-indigo-700 text-lg">Loading test requests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-gray-500">No test requests found</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Patient</th>
                <th className="border-b p-2">Test</th>
                <th className="border-b p-2">Status</th>
                <th className="border-b p-2">Requested At</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id} className="border-b">
                  <td className="p-2">{test.patientId?.name}</td>
                  <td className="p-2">{test.testName}</td>
                  <td className="p-2 capitalize">{test.status}</td>
                  <td className="p-2">{new Date(test.requestedAt).toLocaleString()}</td>
                  <td className="p-2 space-x-2">
                    {test.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdate(test._id, "accepted")}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdate(test._id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {test.status === "accepted" && (
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Complete & Upload
                      </button>
                    )}

                    {test.status === "completed" && test.resultFile && (
                      <>
                        <button
                          onClick={() => handleDownload(test._id, `${test.testName}-result.pdf`)}
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

      {/* Modal */}
      {selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-3">Upload Test Result</h2>
            <p className="mb-2">Test: {selectedTest.testName}</p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-3 w-full"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSelectedTest(null)} className="px-3 py-1 rounded border">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewPdfUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-4/5 md:w-3/4 h-4/5 rounded-lg shadow-lg relative">
            <button
              onClick={() => setViewPdfUrl(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-10"
            >
              Close
            </button>
            <iframe src={viewPdfUrl} title="Test Result" className="w-full h-full rounded-lg"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTestRequests;
