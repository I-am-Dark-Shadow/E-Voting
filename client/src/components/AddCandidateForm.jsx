import React, { useState, useRef } from 'react';
import { User, Flag, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { addCandidate } from '../services/api';

const AddCandidateForm = ({ onCandidateAdded }) => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const clearForm = () => {
    setName('');
    setParty('');
    setLogoFile(null);
    setLogoPreview('');
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !party || !logoFile) {
      setError('Please fill all fields and upload a logo.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('party', party);
    formData.append('logo', logoFile);

    try {
      const { data } = await addCandidate(formData);
      setSuccess(`Candidate '${data.name}' added successfully!`);
      onCandidateAdded(data);
      clearForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-black/20 rounded-lg max-w-lg mx-auto">
        <div onClick={() => fileInputRef.current.click()} className="cursor-pointer relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 h-48 flex items-center justify-center">
            {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-4" />
            ) : (
                <div className="text-center text-slate-400">
                    <ImageIcon size={48} className="mx-auto" />
                    <p>Click to Upload Party Logo</p>
                </div>
            )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        
        <p className={`text-center text-sm h-5 ${error ? 'text-red-400' : 'text-green-400'}`}>
            {isLoading ? 'Adding Candidate...' : error || success}
        </p>

        <div>
            <label className="text-xs text-slate-400">Candidate Name</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 focus-within:ring-cyan-400/30 transition">
              <User className="h-4 w-4 text-slate-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Candidate Name" className="w-full bg-transparent text-sm placeholder-slate-500 focus:outline-none" />
            </div>
        </div>
        <div>
            <label className="text-xs text-slate-400">Party Name</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 focus-within:ring-cyan-400/30 transition">
              <Flag className="h-4 w-4 text-slate-400" />
              <input value={party} onChange={(e) => setParty(e.target.value)} type="text" placeholder="Party Name" className="w-full bg-transparent text-sm placeholder-slate-500 focus:outline-none" />
            </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full group relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 bg-white/5 hover:bg-green-400/30 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Add Candidate
        </button>
    </form>
  );
};

export default AddCandidateForm;