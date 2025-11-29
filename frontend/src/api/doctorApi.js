// src/api/doctorApi.js
import axios from 'axios';

const API = axios.create({ baseURL:  `${import.meta.env.VITE_API_BASE_URL}/api` });

export const fetchDoctorsBySpecialization = async (specialization) => {
  const res = await API.get(`/doctors?specialization=${specialization}`);
  return res.data;
};

export const fetchDoctorById = async (id) => {
  const res = await API.get(`/doctors/${id}`);
  return res.data;
};
