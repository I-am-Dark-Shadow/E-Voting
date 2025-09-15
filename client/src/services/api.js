import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ||'http://localhost:5000/api',
});

// Interceptor to add the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const registerUser = (formData) => API.post('/auth/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const loginUser = (faceDescriptors) => API.post('/auth/login', { faceDescriptors });
export const getUserProfile = () => API.get('/auth/me');

// --- Candidates ---
export const getCandidates = () => API.get('/candidates');
// New function to add a candidate with their logo
export const addCandidate = (formData) => API.post('/candidates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

// --- Votes ---
export const castVote = (candidateId) => API.post('/votes/cast', { candidateId });
export const getVoteResults = () => API.get('/votes/results');


export default API;