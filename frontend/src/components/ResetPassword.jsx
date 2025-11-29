import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        // must have been set after login

await axios.get("http://localhost:5000/api/appointments/appointments", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        setAppointments(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to fetch pending appointments");
      }
    };

    fetchPendingAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/appointments/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-8">
        Pending Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No pending appointments
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 rounded-xl p-5 w-full sm:w-[320px] md:w-[340px]"
            >
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {appointment.patientName}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Email:</span> {appointment.email}</p>
                <p><span className="font-medium">Date:</span> {appointment.date}</p>
                <p><span className="font-medium">Time:</span> {appointment.time}</p>
                <p><span className="font-medium">Phone:</span> {appointment.phone}</p>
                <p><span className="font-medium">Symptoms:</span> {appointment.symptoms}</p>
                <p><span className="font-medium">Gender:</span> {appointment.gender}</p>
              </div>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    appointment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appointment.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-3 py-1.5 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition"
                  onClick={() =>
                    handleUpdateStatus(appointment._id, "Approved")
                  }
                >
                  ✓ Approve
                </button>
                <button
                  className="px-3 py-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition"
                  onClick={() =>
                    handleUpdateStatus(appointment._id, "Rejected")
                  }
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAppointments;
