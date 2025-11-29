
import express from 'express';
import mongoose from 'mongoose';
import {
  createAppointment,
  getPendingAppointments,
  updateAppointmentStatus,
  getBookedSlots,
  updateAppointmentWithPrescription,
  getAppointmentsByStatus,
  getAppointmentsForPatient
} from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Appointment from '../models/appointment.js';
import { sendMail } from "../utils/emailService.js";
const router = express.Router();
const protect = authMiddleware();
import upload from '../middleware/uploadMiddleware.js';
// ------------------ Patient Routes ------------------

// Create new appointment
// router.post('/', createAppointment);
router.post('/', upload.single('document'), createAppointment);


// Get pending appointments (for all roles)
router.get('/appointments', protect, getPendingAppointments);

// Get booked slots for a doctor
router.get('/booked-slots/:doctorId', getBookedSlots);

// Get all appointments of logged-in patient
router.get('/status/patient', authMiddleware('patient'), getAppointmentsForPatient);

// Get only pending appointments of logged-in patient
router.get('/pending/patient', authMiddleware('patient'), async (req, res) => {
  try {
    const { _id } = req.user;
    const pendingAppointments = await Appointment.find({
      patientId: _id,
      status: 'Pending',
    }).sort({ date: 1, time: 1 });
    res.json(pendingAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch appointments' });
  }
});

// // 🆕 Get appointments of a specific patient (admin/doctor view)
// router.get('/status/patient/:patientId', protect, async (req, res) => {
//   try {
//     const { patientId } = req.params;
//     const appointments = await Appointment.find({ patientId })
//       .populate('doctorId', 'name')
//       .exec();
//     res.json(appointments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// ------------------ Doctor Routes ------------------

// Get appointments of logged-in doctor
router.get('/my', protect, async (req, res) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.user._id);
    const appointments = await Appointment.find({
      doctorId,
      status: { $in: ['Approved', 'In Progress'] },
    }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get appointments by status (doctor only)
router.get('/status/:status', authMiddleware('doctor'), getAppointmentsByStatus);

// Doctor updates appointment status and adds prescription
router.patch('/status/:id', authMiddleware('doctor'), async (req, res) => {
  try {
    const { status, prescription, medicines } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const validTransitions = {
      Approved: ['In Progress'],
      'In Progress': ['Completed'],
    };

    if (status && status !== appointment.status) {
      const allowed = validTransitions[appointment.status] || [];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: `Invalid transition from ${appointment.status} to ${status}` });
      }

      appointment.status = status;
    }

    if (status === 'Completed') {
      if (!prescription) {
        return res.status(400).json({ message: 'Prescription is required to complete appointment' });
      }
      appointment.prescription = prescription;

      appointment.medicines = medicines ?? [];
    }

    await appointment.save();
    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------ Admin/Manual ------------------

// Manual status update (e.g. approve/reject)
router.patch('/update-status/:id', protect, updateAppointmentStatus);
// 🆕 Get appointments of a specific patient (admin/doctor view)
// 🆕 Get appointments of a specific patient (admin/doctor view)
// 🆕 Get appointments of a specific patient (admin/doctor view)
// ✅ FINAL: Get appointments of a specific patient (with reportUrl and debug logs)
// 🆕 Get appointments of a specific patient (admin/doctor view)
// router.get('/status/patient/:patientId', protect, async (req, res) => {
//   try {
//     const { patientId } = req.params;
//     const appointments = await Appointment.find({ patientId })
//       .populate('doctorId', 'name')
//       .lean();

//     // ✅ Add reportUrl if reportFile exists
//     const updatedAppointments = appointments.map(appt => {
//       console.log("🧩 Checking appointment:", appt._id);

//       if (appt.reportFile) {
//         // log for debugging
//         console.log("✅ Report file found for:", appt._id);
//         appt.reportUrl = `/api/appointments/view-report/${appt._id}`;
//       } else {
//         console.log("❌ No report file for:", appt._id);
//         appt.reportUrl = null;
//       }
//       return appt;
//     });

//     console.log("📦 Sending updated appointments:", updatedAppointments.length);
//     res.json(updatedAppointments);
//   } catch (error) {
//     console.error("🚨 Error fetching patient appointments:", error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// router.get("/patient/:patientId", async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ patientId: req.params.patientId });

//     // ✅ Convert reportFile to accessible URL
//     const updatedAppointments = appointments.map((appointment) => {
//       if (appointment.reportFile && appointment.reportFile.data) {
//         return {
//           ...appointment._doc,
//           reportUrl: `/api/appointments/view-report/${appointment._id}`,
//         };
//       } else {
//         return appointment;
//       }
//     });

//     console.log("✅ Sending appointments with reportUrl:", updatedAppointments);
//     res.json(updatedAppointments);
//   } catch (error) {
//     console.error("❌ Error fetching appointments:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// ✅ Unified route: Get all appointments of a patient (with reportUrl)
router.get("/status/patient/:patientId", protect, async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name")
      .lean();

    const updatedAppointments = appointments.map((appt) => {
      if (appt.reportFile && appt.reportFile.data) {
        console.log("✅ Report exists for:", appt._id);
        return {
          ...appt,
          reportUrl: `/api/appointments/view-report/${appt._id}`,
        };
      } else {
        console.log("❌ No report for:", appt._id);
        return { ...appt, reportUrl: null };
      }
    });

    console.log("📦 Final response count:", updatedAppointments.length);
    res.json(updatedAppointments);
  } catch (error) {
    console.error("🚨 Error fetching appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// import upload from '../middleware/uploadMiddleware.js';
import path from 'path';
import fs from 'fs';
import multer from "multer"
const storage = multer.memoryStorage();
// const upload = multer({ storage });

// ✅ Upload Report (store in DB)
// ✅ POST /api/appointments/upload-report/:appointmentId
router.post("/upload-report/:appointmentId", upload.single("reportFile"), async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const fileData = req.file;

    if (!fileData) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🧠 Save file inside MongoDB
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        reportFile: {
          data: fileData.buffer,
          contentType: fileData.mimetype,
          filename: fileData.originalname,
        },
      },
      { new: true }
    );

    console.log("✅ Report stored in DB for appointment:", appointmentId);

    res.json({
      success: true,
      message: "Report uploaded successfully",
      reportUrl: `/api/appointments/view-report/${appointmentId}`,
    });
  } catch (err) {
    console.error("❌ Error uploading report:", err);
    res.status(500).json({ message: "Server error while uploading report" });
  }
});


router.get("/view-report/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.reportFile) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.set("Content-Type", appointment.reportFile.contentType);
    res.send(appointment.reportFile.data);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Error fetching report" });
  }
});


export default router;

