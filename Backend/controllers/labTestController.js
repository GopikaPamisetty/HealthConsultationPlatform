import LabTest from "../models/LabTest.js";
import User from "../models/patient.js"; // to populate patient info
import Lab from "../models/Lab.js"
// Get all test requests for the logged-in lab
export const getLabTestRequests = async (req, res) => {
  try {
    const labId = req.user._id;
    const tests = await LabTest.find({ labId })
      .populate("patientId", "name email") // get patient name & email
      .sort({ requestedAt: -1 });

    res.json(tests);
  } catch (err) {
    console.error("Get Lab Test Requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update test status (accept/reject/complete)
export const updateLabTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, result } = req.body;

    const test = await LabTest.findById(id);
    if (!test) return res.status(404).json({ message: "Test request not found" });

    if (status) test.status = status;
    if (result) {
      test.result = result;
      test.completedAt = new Date();
    }

    await test.save();
    res.json(test);
  } catch (err) {
    console.error("Update Lab Test Status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const createLabTestRequest = async (req, res) => {
    try {
      const { labId, testName, description } = req.body;
      const patientId = req.user._id;
  
      // Check if lab exists
      const lab = await Lab.findById(labId);
      if (!lab) return res.status(404).json({ message: "Lab not found" });
  
      const newRequest = await LabTest.create({
        patientId,
        labId,
        testName,
        description,
        status: "pending",
        requestedAt: new Date(),
      });
  
      res.status(201).json({ message: "Lab test request created", labTest: newRequest });
    } catch (err) {
      console.error("Create lab test error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Optional: patient can view their requests
  export const getPatientLabTests = async (req, res) => {
    try {
      const patientId = req.user._id;
      const labTests = await LabTest.find({ patientId }).populate("labId", "name email");
      res.json(labTests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };