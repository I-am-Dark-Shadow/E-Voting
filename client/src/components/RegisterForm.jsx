import React, { useState, useRef } from 'react';
import { User, Mail, Fingerprint, Camera, CheckCircle2, Loader2, Users, ShieldCheck } from 'lucide-react';
import { getFullFaceDescription } from '../utils/faceUtils';
import { registerUser } from '../services/api';

// `modelsLoaded` prop টি এখানে যোগ করা হয়েছে
const RegisterForm = ({ onRegistrationSuccess, modelsLoaded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [voterId, setVoterId] = useState('');
  const [role, setRole] = useState('voter');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [status, setStatus] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const clearForm = () => {
    setName('');
    setEmail('');
    setVoterId('');
    setRole('voter');
    setImageFile(null);
    setImagePreview('');
    setFaceDescriptor(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFaceDescriptor(null);
    setError('');
    setStatus('Analyzing image...');
    setIsLoading(true);

    try {
        const fullDesc = await getFullFaceDescription(file);
        if (!fullDesc) {
          setError('No face detected or face is unclear. Please use a clear, front-facing photo.');
          setStatus('');
        } else {
          setStatus('✅ Face detected successfully!');
          setFaceDescriptor(Array.from(fullDesc.descriptor));
        }
    } catch (err) {
        setError('Could not analyze the image. Please try again.');
        setStatus('');
    } finally {
        setIsLoading(false);
        URL.revokeObjectURL(previewUrl); // Clean up the object URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !voterId || !faceDescriptor) {
      setError('Please fill all fields and upload a valid photo.');
      return;
    }
    setIsLoading(true);
    setError('');
    setStatus('Registering user...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('voterId', voterId);
    formData.append('role', role);
    formData.append('image', imageFile);
    formData.append('faceDescriptors', JSON.stringify([faceDescriptor]));

    try {
      const { data } = await registerUser(formData);
      setStatus(`Success! User ${data.name} created.`);
      onRegistrationSuccess(data);
      clearForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 bg-black/20 rounded-xl max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 h-64 flex items-center justify-center">
        {imagePreview ? (
          <img src={imagePreview} alt="Face preview" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-slate-400">
            <Camera size={48} className="mx-auto" />
            <p>Upload User Photo</p>
          </div>
        )}
      </div>
      <p className={`text-center text-sm h-5 ${error ? 'text-red-400' : 'text-cyan-300'}`}>
        {isLoading ? status : error || status}
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Voter Name</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2.5 focus-within:ring-fuchsia-400/30 transition">
              <User className="h-4 w-4 text-slate-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Voter Name" className="w-full bg-transparent text-sm placeholder-slate-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2.5 focus-within:ring-fuchsia-400/30 transition">
              <Mail className="h-4 w-4 text-slate-400" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voter@gamil.com" className="w-full bg-transparent text-sm placeholder-slate-500 focus:outline-none" />
            </div>
          </div>
        </div>
        <div>
            <label className="text-xs text-slate-400">Voter ID Number</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2.5 focus-within:ring-fuchsia-400/30 transition">
              <Fingerprint className="h-4 w-4 text-slate-400" />
              <input value={voterId} onChange={(e) => setVoterId(e.target.value)} type="text" placeholder="ABC1234567" className="w-full bg-transparent text-sm placeholder-slate-500 focus:outline-none" />
            </div>
        </div>
        <div>
            <label className="text-xs text-slate-400 mb-2 block">User Role</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setRole('voter')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition ring-1 ${role === 'voter' ? 'bg-cyan-400/20 ring-cyan-400 text-white' : 'bg-white/5 ring-white/10 text-slate-300 hover:bg-white/10'}`}
                >
                    <Users className="h-4 w-4"/> Voter
                </button>
                <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition ring-1 ${role === 'admin' ? 'bg-cyan-400/20 ring-cyan-400 text-white' : 'bg-white/5 ring-white/10 text-slate-300 hover:bg-white/10'}`}
                >
                    <ShieldCheck className="h-4 w-4"/> Officer
                </button>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()} 
          // `modelsLoaded` false হলে বাটনটি disabled থাকবে
          disabled={isLoading || !modelsLoaded} 
          className="w-full sm:w-auto group relative flex justify-center items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-100 ring-1 ring-fuchsia-400/30 bg-fuchsia-400/10 hover:bg-fuchsia-400/15 transition disabled:opacity-50 disabled:cursor-wait"
        >
          <Camera className="h-4 w-4" />
          {modelsLoaded ? 'Choose Photo' : 'Loading Models...'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          // মডেল লোড না হওয়া পর্যন্ত ইনপুটটিও disabled থাকবে
          disabled={!modelsLoaded}
        />

        <button type="submit" disabled={isLoading || !faceDescriptor} className="w-full sm:w-auto group relative flex justify-center items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-100 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Register User
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;