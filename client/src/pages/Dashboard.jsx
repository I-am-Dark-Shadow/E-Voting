import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/api';
import { Loader2, LogOut, ScanFace, Lock, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        // If token is invalid, logout
        logout();
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <main className="relative z-10">
      <section id="dashboardSection" className="mx-auto max-w-4xl px-6 py-10 md:py-16">
        <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl overflow-hidden p-6 md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={profile?.profileImageUrl} 
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  Welcome back, {profile?.name}!
                </h2>
                <p className="text-sm text-slate-400">Signed in with Face ID</p>
              </div>
            </div>
            <button onClick={handleLogout} className="group relative rounded-lg px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition">
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm text-slate-400 flex items-center gap-2"><ScanFace className="h-4 w-4 text-cyan-300" /> Last Scan</div>
              <div className="mt-2 text-slate-200 text-lg font-medium">Just now</div>
            </div>
            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm text-slate-400 flex items-center gap-2"><Lock className="h-4 w-4 text-fuchsia-300" /> Status</div>
              <div className="mt-2 text-slate-200 text-lg font-medium">Authenticated</div>
            </div>
            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm text-slate-400 flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-300" /> Confidence</div>
              <div className="mt-2 text-slate-200 text-lg font-medium">High</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;