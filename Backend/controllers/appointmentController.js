
import Appointment from '../models/appointment.js';
import mongoose from 'mongoose';
import { sendMail } from "../utils/emailService.js";
import Doctor from '../models/doctor.js'; 

// export const createAppointment = async (req, res) => {
//   try {
//     const {
//       doctorId,
//       patientId,
//       patientName,
//       email,
//       date,
//       time,
//       symptoms,
//       phone,
//       gender
//     } = req.body;

//     // Ensure a patient can't book more than 2 appointments on the same day
//     // const existing = await Appointment.find({
//     //   patientId,
//     //   date
//     // });

//     // if (existing.length >= 2) {
//     //   return res.status(400).json({ msg: 'Cannot book more than 2 appointments on the same day' });
//     // }

//     const appointment = new Appointment({
//       doctorId,
//       patientId,
//       patientName,
//       email,
//       date,
//       time,
//       symptoms,
//       phone,
//       gender,
//       status: 'Pending',                    
//       createdAt: new Date()               
//     });

//     await appointment.save();
    
//     const doctor = await Doctor.findById(doctorId);
//     if (doctor?.email) {
//       try {
//         await sendMail(
//           doctor.email,
//           "📅 New Appointment Booked",
//           `<p>Dear Dr. ${doctor.name},</p>
//            <p>Patient <b>${patientName}</b> booked an appointment for <b>${date}</b> at <b>${time}</b>.</p>`
//         );
        
//       } catch (err) {
//          console.error("Error sending email:", err);
//       }
//    }
   

//     res.status(201).json({ msg: 'Appointment booked successfully', appointment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };
// export const createAppointment = async (req, res) => {
//   try {
//     const {
//       doctorId,
//       patientId,
//       patientName,
//       email,        // patient's email
//       date,
//       time,
//       symptoms,
//       phone,
//       gender
//     } = req.body;

//     // Create new appointment
//     const appointment = new Appointment({
//       doctorId,
//       patientId,
//       patientName,
//       email,
//       date,
//       time,
//       symptoms,
//       phone,
//       gender,
//       status: 'Pending',
//       createdAt: new Date()
//     });

//     await appointment.save();

//     // Fetch doctor details
//     const doctor = await Doctor.findById(doctorId);

//     // --- 💌 Send mail to doctor ---
//     // if (doctor?.email) {
//     //   try {
//     //     await sendMail(
//     //       doctor.email,
//     //       "📅 New Appointment Booked",
//     //       `<p>Dear Dr. ${doctor.name},</p>
//     //        <p>Patient <b>${patientName}</b> has booked an appointment.</p>
//     //        <p><b>Date:</b> ${date} <br><b>Time:</b> ${time}</p>
//     //        <p>Please review and approve/reject the appointment from your dashboard.</p>`
//     //     );
//     //   } catch (err) {
//     //     console.error("❌ Error sending mail to doctor:", err);
//     //   }
//     // }

//     // --- 💌 Send mail to patient ---
//     if (email) {
//       try {
//         await sendMail(
//           email,
//           "📅 Appointment Request Sent",
//           `<p>Dear ${patientName},</p>
//            <p>Your appointment request has been sent to <b>Dr. ${doctor?.name}</b>.</p>
//            <p><b>Date:</b> ${date} <br><b>Time:</b> ${time}</p>
//            <p>You will receive another email once the doctor approves or rejects your appointment.</p>`
//         );
//       } catch (err) {
//         console.error("❌ Error sending mail to patient:", err);
//       }
//     }

//     res.status(201).json({ msg: 'Appointment booked successfully', appointment });

//   } catch (error) {
//     console.error("❌ Server Error in createAppointment:", error);
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };
// Shared endpoint: Get all pending appointments (for admin/shared view)




import multer from "multer";
;

// ✅ Setup Multer (store in memory)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createAppointment = async (req, res) => {
  try {
    console.log("📥 Incoming Appointment Request Body:", req.body);
    console.log("📎 File:", req.file ? req.file.originalname : "No file uploaded");

    const {
      doctorId,
      patientId,
      patientName,
      email,
      date,
      time,
      symptoms,
      phone,
      gender
    } = req.body;

    // ✅ Create appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      patientName,
      email,
      date,
      time,
      symptoms,
      phone,
      gender,
      status: "Pending",
      createdAt: new Date(),
    });
    console.log("📥 Incoming body:", req.body);
    console.log("📎 Incoming file:", req.file ? req.file.originalname : "No file uploaded");
    
    // ✅ Add optional uploaded file to appointment (if present)
    if (req.file) {
      appointment.reportFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };
    }

    await appointment.save();

    // ✅ Fetch doctor details
    const doctor = await Doctor.findById(doctorId);

    // --- 💌 Send mail to patient ---
    if (email) {
      try {
        await sendMail(
          email,
          "📅 Appointment Request Sent",
          `<p>Dear ${patientName},</p>
           <p>Your appointment request has been sent to <b>Dr. ${doctor?.name}</b>.</p>
           <p><b>Date:</b> ${date} <br><b>Time:</b> ${time}</p>
           <p>You will receive another email once the doctor approves or rejects your appointment.</p>`
        );
      } catch (err) {
        console.error("❌ Error sending mail to patient:", err);
      }
    }

    res.status(201).json({ msg: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("❌ Server Error in createAppointment:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};



















export const getPendingAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id; 

    const pending = await Appointment.find({ status: 'Pending', doctorId })
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch appointments' });
  }
};




  export const getBookedSlots = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const appointments = await Appointment.find({ doctorId });
  
      const bookedSlots = appointments.map(app => `${app.date}|${app.time}`);
      res.json(bookedSlots);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Failed to fetch booked slots' });
    }
  };
  // Doctor updates appointment status (approve/reject)

// export const updateAppointmentStatus = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { status } = req.body;

//     // ✅ Only allow certain statuses
//     if (!['Approved', 'Rejected'].includes(status)) {
//       return res.status(400).json({ msg: 'Invalid status' });
//     }

//     // ✅ Update appointment
//     const updated = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { status },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ msg: 'Appointment not found' });
//     }

//     res.status(200).json({ msg: `Appointment ${status.toLowerCase()}`, appointment: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Failed to update appointment status' });
//   }
// };


export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, prescription, medicines } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid appointment ID" });
    }

    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Update status
    if (status) appointment.status = status;

    // Only update prescription & medicines for Completed status
    if (status === "Completed") {
      appointment.prescription = prescription || "";
      appointment.medicines = medicines || [];
    }

    await appointment.save();

    // Send email notifications
    if (appointment.email) {
      try {
        if (status === "Approved") {
          await sendMail(
            appointment.email,
            "✅ Appointment Approved",
            `<p>Dear ${appointment.patientName},</p>
             <p>Your appointment on <b>${appointment.date}</b> at <b>${appointment.time}</b> has been approved by the doctor.</p>`
          );
        } else if (status === "Rejected") {
          await sendMail(
            appointment.email,
            "❌ Appointment Rejected",
            `<p>Dear ${appointment.patientName},</p>
             <p>Unfortunately, your appointment on <b>${appointment.date}</b> at <b>${appointment.time}</b> has been rejected by the doctor.</p>`
          );
        } else if (status === "Completed") {
          // Send prescription with completion
          let medicinesList = appointment.medicines.map(
            (m) => `<li>${m.name} - ${m.dosage}, ${m.frequency}, ${m.timing}</li>`
          ).join("");
          
          await sendMail(
            appointment.email,
            "📄 Appointment Completed",
            `<p>Dear ${appointment.patientName},</p>
             <p>Your appointment on <b>${appointment.date}</b> at <b>${appointment.time}</b> has been completed.</p>
             <p><b>Prescription:</b></p>
             <p>${appointment.prescription}</p>
             <ul>${medicinesList}</ul>`
          );
        }
      } catch (err) {
        console.error("Error sending email:", err);
      }
    }

    res.status(200).json({ msg: "Status updated successfully", appointment });
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


export const getAppointmentsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patientId }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch your appointments' });
  }
};




export const getAppointmentsByStatus = async (req, res) => {
  try {
    // If you have auth middleware that sets req.user._id:
    const doctorId = req.user._id;

    const { status } = req.params;

    // console.log('doctorId:', doctorId);
    // console.log('status:', status);

    const appointments = await Appointment.find({
      doctorId,
      status: { $regex: new RegExp(`^${status}$`, 'i') }
    });

    // console.log('found appointments:', appointments.length);
    res.json(appointments); // console.log('found appointments:', appointments.length);
  } catch (error) {
    console.error('Error in getAppointmentsByStatus:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};


export const updateAppointmentWithPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, prescription, medicines } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;

    if (status === 'Completed') {
      appointment.prescription = prescription;
      appointment.medicines = medicines;
    }

    await appointment.save();
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
};