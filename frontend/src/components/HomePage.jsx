


// import React, { useState, useEffect } from "react";
// import {
//   BsGeoAltFill,
//   BsTelephoneFill,
//   BsEnvelopeFill,
//   BsClockFill,
// } from "react-icons/bs";

// // ✅ Images
// import aboutImg from "../assets/about.png";
// import cardiology from "../assets/cardiology.png";
// import ortho from "../assets/ortho.png";
// import neuro from "../assets/neuro.png";
// import pediatrics from "../assets/pediatrics.png";
// import derm from "../assets/derm.png";
// import ent from "../assets/ent.png";
// import dentistry from "../assets/dentistry.png";
// import eye from "../assets/eye.png";

// const HomePage = () => {
//   useEffect(() => {
//     document.body.style.overflowX = "hidden";
//   }, []);

//   const services = [
//     { img: cardiology, title: "Cardiology", desc: "Heart and cardiovascular care" },
//     { img: ortho, title: "Orthopedic", desc: "Bone, joint, and muscle treatment" },
//     { img: neuro, title: "Neurology", desc: "Brain and nervous system care" },
//     { img: pediatrics, title: "Pediatrics", desc: "Child healthcare services" },
//     { img: eye, title: "Ophthalmology", desc: "Eye and vision treatments" },
//     { img: dentistry, title: "Dentistry", desc: "Oral hygiene and dental care" },
//     { img: ent, title: "ENT", desc: "Ear, Nose & Throat disorders" },
//     { img: derm, title: "Dermatology", desc: "Skin, hair, and nail treatments" },
//   ];

//   const carouselImages = [
//     "/src/assets/hero1.png",
//     "/src/assets/hero2.png",
//     "/src/assets/hero3.png",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="overflow-x-hidden bg-gray-50">
//       {/* 🌐 Navbar */}
//       <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
//         <div className="container mx-auto flex justify-between items-center py-4 px-6">
//           <a href="/" className="font-bold text-2xl text-blue-700">
//             MediTrack
//           </a>
//           <div className="hidden md:flex items-center space-x-8 text-[16px] font-medium text-gray-700">
//             <a href="/" className="hover:text-blue-600">Home</a>
//             <a href="#about" className="hover:text-blue-600">About</a>
//             <a href="#services" className="hover:text-blue-600">Services</a>
//             <a href="#contact" className="hover:text-blue-600">Contact</a>

//             {/* Login Dropdown */}
//             <div className="relative group">
//               <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none">
//                 Login <span className="text-sm">▼</span>
//               </button>
//               <div className="absolute hidden group-hover:block bg-white text-gray-700 rounded-md shadow-lg right-0 mt-2 w-44 z-10 border border-gray-200">
//                 <a href="/admin/login" className="block px-4 py-2 hover:bg-gray-100">Admin</a>
//                 <a href="/login" className="block px-4 py-2 hover:bg-gray-100 rounded-b-md">Doctor / Patient</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* 🖼️ Hero Section */}
//       <section className="mt-20 relative w-full h-[75vh] flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-200 text-center px-6">
//         <div className="max-w-3xl">
//           <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 leading-tight">
//             A Smarter Way to Manage Your Health 🩺
//           </h1>
//           <p className="text-gray-700 text-lg mb-6">
//             Connect with trusted doctors, book appointments, and manage your medical records — all in one secure platform.
//           </p>
//           <a
//             href="/login"
//             className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Get Started
//           </a>
//         </div>
//       </section>

//       {/* 🧬 About Section */}
//       <section id="about" className="py-16 bg-white">
//         <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10">
//           <img
//             src={aboutImg}
//             alt="About MediTrack"
//             className="rounded-xl shadow-lg md:w-1/2 w-full object-cover"
//           />
//           <div className="md:w-1/2">
//             <h2 className="text-3xl font-semibold text-blue-700 mb-4">
//               About MediTrack
//             </h2>
//             <p className="text-gray-700 leading-relaxed">
//               MediTrack is a digital healthcare platform designed to simplify medical consultations and patient management.
//               It connects doctors, specialists, and patients in a secure environment — enabling online consultations,
//               digital prescriptions, and seamless health record access.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* 🩺 Services Section */}
//       <section id="services" className="py-16 bg-gray-50 text-center">
//         <h2 className="text-3xl font-semibold text-blue-700 mb-10">Our Services</h2>
//         <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
//           {services.map((s, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-xl border border-gray-200 hover:shadow-lg p-6 flex flex-col items-center transition transform hover:-translate-y-1"
//             >
//               <img src={s.img} alt={s.title} className="w-20 h-20 rounded-full mb-4" />
//               <h4 className="font-semibold text-lg text-gray-800">{s.title}</h4>
//               <p className="text-gray-600 text-sm mt-2">{s.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 📞 Contact Section */}
//       <section id="contact" className="bg-blue-900 text-white py-12">
//         <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
//           <div>
//             <h3 className="font-bold text-xl mb-2">MediTrack</h3>
//             <p>Providing quality healthcare with innovation and trust.</p>
//           </div>

//           <div>
//             <h3 className="font-bold text-xl mb-3">Contact Info</h3>
//             <p className="flex justify-center items-center gap-2">
//               <BsGeoAltFill /> 123 Healthcare Road, MedCity
//             </p>
//             <p className="flex justify-center items-center gap-2">
//               <BsTelephoneFill /> +91 98765434567
//             </p>
//             <p className="flex justify-center items-center gap-2">
//               <BsEnvelopeFill /> support@meditrack.com
//             </p>
//             <p className="flex justify-center items-center gap-2">
//               <BsClockFill /> Mon–Sat: 8am–7pm
//             </p>
//           </div>

//           <div>
//             <h3 className="font-bold text-xl mb-3">Quick Links</h3>
//             <ul className="space-y-1">
//               <li><a href="/" className="hover:text-yellow-400">Home</a></li>
//               <li><a href="#about" className="hover:text-yellow-400">About</a></li>
//               <li><a href="/login" className="hover:text-yellow-400">Doctors</a></li>
//               <li><a href="/login" className="hover:text-yellow-400">Appointments</a></li>
//             </ul>
//           </div>
//         </div>
//         <hr className="border-gray-700 my-6" />
//         <p className="text-center text-sm">© 2025 MediTrack. All rights reserved.</p>
//       </section>
//     </div>
//   );
// };

// export default HomePage;



import React, { useEffect } from "react";
import {
  BsGeoAltFill,
  BsTelephoneFill,
  BsEnvelopeFill,
  BsClockFill,
} from "react-icons/bs";
import { FaUserMd, FaCalendarAlt, FaPrescriptionBottle, FaShieldAlt, FaChartLine, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import aboutImg from "../assets/about.png";

const HomePage = () => {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);

  return (
    <div className="overflow-x-hidden bg-gray-50 text-gray-800">
      {/* 🌐 Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <a href="/" className="font-bold text-2xl text-blue-700">
            Health Consultation
          </a>
          <div className="hidden md:flex items-center space-x-8 text-[16px] font-medium text-gray-700">
  <a href="/" className="hover:text-blue-600">Home</a>
  <a href="#about" className="hover:text-blue-600">About</a>
  <a href="#howitworks" className="hover:text-blue-600">How It Works</a>
  <a href="#features" className="hover:text-blue-600">Features</a>
  <a href="#testimonials" className="hover:text-blue-600">Feedback</a>
  <a href="#contact" className="hover:text-blue-600">Contact</a>

  {/* ✅ Sign In Dropdown */}
  <div className="relative group">
    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none">
      Sign In <span className="text-sm">▼</span>
    </button>
    <div className="absolute hidden group-hover:block bg-white text-gray-700 rounded-md shadow-lg right-0 mt-2 w-48 z-10 border border-gray-200">
      <a href="/login" className="block px-4 py-2 hover:bg-gray-100">Patient Login</a>
      <a href="/login" className="block px-4 py-2 hover:bg-gray-100">Doctor Login</a>
      <a href="/admin/login" className="block px-4 py-2 hover:bg-gray-100 rounded-b-md">Admin Login</a>
    </div>
  </div>
</div>

        </div>
      </nav>

      {/* 🏠 Hero Section */}
      <section className="mt-20 bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col justify-center items-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 leading-tight">
          Your Digital Healthcare Companion 🩺
        </h1>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl">
          Book appointments, manage prescriptions, and connect with trusted doctors — all in one secure platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Login as Patient</a>
          <a href="/login" className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition">Login as Doctor</a>
          <a href="/admin/login" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition">Admin Login</a>
        </div>
      </section>

      {/* 🧬 About MediTrack */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10">
          <img src={aboutImg} alt="About Health Consultation" className="rounded-xl shadow-lg md:w-1/2 w-full object-cover" />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">About Health Consultation</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
            Health Consultation simplifies healthcare by connecting patients and doctors through a secure and transparent digital platform. 
              Our mission is to make healthcare accessible, efficient, and patient-focused.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 border rounded-lg hover:shadow-md">
                <p className="text-3xl">🏥</p>
                <p className="font-semibold mt-2">Trusted Doctors</p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md">
                <p className="text-3xl">💊</p>
                <p className="font-semibold mt-2">Digital Prescriptions</p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md">
                <p className="text-3xl">⏰</p>
                <p className="font-semibold mt-2">Quick Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔄 How It Works */}
      <section id="howitworks" className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-10">How It Works</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            { icon: <FaUserMd className="text-blue-600 text-4xl" />, title: "Sign Up or Login", desc: "Create an account or log in securely as a patient or doctor." },
            { icon: <FaCalendarAlt className="text-blue-600 text-4xl" />, title: "Book Appointment", desc: "Schedule appointments or manage your consultations." },
            { icon: <FaPrescriptionBottle className="text-blue-600 text-4xl" />, title: "Consult & Track", desc: "Consult online, get e-prescriptions, and monitor progress." },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="mb-3 flex justify-center">{step.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⚙️ Our Features */}
      <section id="features" className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-10">Our Features</h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
          {[
            { icon: <FaShieldAlt className="text-blue-600 text-3xl" />, title: "Secure Data & Login" },
            { icon: <FaCalendarAlt className="text-blue-600 text-3xl" />, title: "Appointment Management" },
            { icon: <FaPrescriptionBottle className="text-blue-600 text-3xl" />, title: "E-Prescriptions" },
            { icon: <FaUserMd className="text-blue-600 text-3xl" />, title: "Verified Doctors" },
            { icon: <FaChartLine className="text-blue-600 text-3xl" />, title: "Admin Analytics" },
            { icon: <FaUsers className="text-blue-600 text-3xl" />, title: "Patient-Doctor Chat" },
          ].map((f, i) => (
            <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition bg-gray-50">
              <div className="mb-3 flex justify-center">{f.icon}</div>
              <h4 className="font-semibold text-gray-800">{f.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-10">What Our Users Say</h2>
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-6">
          {[
            { name: "Gopika", role: "Patient", text: "Dr. Riya was so helpful and professional! Health Consultation made it simple to book my appointment." },
            { name: "Dr. Karan", role: "Orthopedist", text: "Managing appointments and e-prescriptions has never been this smooth. Great experience!" },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left">
              <p className="text-gray-600 italic mb-3">“{t.text}”</p>
              <p className="font-semibold text-blue-700">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📊 Statistics */}
      <section className="bg-blue-700 text-white py-12">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-6">
          {[
            { value: "120+", label: "Verified Doctors" },
            { value: "3,000+", label: "Appointments Completed" },
            { value: "4.9 / 5", label: "Avg. Patient Rating" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-bold">{s.value}</p>
              <p className="text-sm uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 Contact */}
      <section id="contact" className="bg-white py-16">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-blue-700 mb-8">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <BsGeoAltFill className="text-blue-600 mx-auto text-3xl mb-3" />
              <p>123 Healthcare Road, MedCity</p>
            </div>
            <div>
              <BsTelephoneFill className="text-blue-600 mx-auto text-3xl mb-3" />
              <p>+91 98765 43456</p>
            </div>
            <div>
              <BsEnvelopeFill className="text-blue-600 mx-auto text-3xl mb-3" />
              <p>healthconsultation17@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center text-sm">
        <p>© 2025 Health Consultation | All Rights Reserved</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#privacy" className="hover:text-yellow-400">Privacy Policy</a>•
          <a href="#terms" className="hover:text-yellow-400">Terms</a>•
          <a href="#contact" className="hover:text-yellow-400">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
