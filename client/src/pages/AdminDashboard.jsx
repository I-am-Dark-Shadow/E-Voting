import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVoteResults } from '../services/api';
import { Loader2, PieChart, UserPlus, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResultsChart from '../components/ResultsChart';
import RegisterForm from '../components/RegisterForm';
import AddCandidateForm from '../components/AddCandidateForm';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('results');
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (activeTab === 'results') {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const { data } = await getVoteResults();
          setResults(data.results);
          setTotalVotes(data.totalVotes);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    }
  }, [activeTab]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <main className="relative z-10 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {user?.name || 'Admin'}</h1>
                <p className="text-slate-400">Election Management Panel</p>
            </div>
        </div>
        <button 
            onClick={handleLogout} 
            className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
        >
            <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      {/* Tabs - শুধুমাত্র বাটন ডিজাইন পরিবর্তন করা হয়েছে */}
      <div className="max-w-7xl mx-auto mb-8 overflow-x-auto">
          {/* `border-b` সরিয়ে `space-x-2` যোগ করা হয়েছে */}
          <div className="flex items-center space-x-2">
            <TabButton icon={<PieChart size={16}/>} label="Results" activeTab={activeTab} onClick={() => setActiveTab('results')} />
            <TabButton icon={<UserPlus size={16}/>} label="Register" activeTab={activeTab} onClick={() => setActiveTab('registerUser')} />
            <TabButton icon={<Users size={16}/>} label="Add Candidate" activeTab={activeTab} onClick={() => setActiveTab('addCandidate')} />
          </div>
      </div>

      {notification && (
        <div className="max-w-7xl mx-auto mb-4 p-3 rounded-lg bg-green-500/10 text-green-300 ring-1 ring-green-500/20 text-sm">
            {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {activeTab === 'results' && (
            isLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin" /> : <ResultsChart results={results} />
        )}
        {activeTab === 'registerUser' && <RegisterForm onRegistrationSuccess={(newUser) => showNotification(`User '${newUser.name}' created successfully.`)} />}
        {activeTab === 'addCandidate' && <AddCandidateForm onCandidateAdded={(newCand) => showNotification(`Candidate '${newCand.name}' added successfully.`)} />}
      </div>
    </main>
  );
};

// Tab গুলির জন্য helper component-টিকে বাটন ডিজাইনে পরিবর্তন করা হয়েছে
const TabButton = ({ icon, label, activeTab, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex-shrink-0 flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition rounded-lg ${
            activeTab === label.toLowerCase().replace(' ', '') 
                ? 'bg-white/10 text-white shadow-md' // Active Button Style
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200' // Inactive Button Style
        }`}
    >
        {icon} {label}
    </button>
);

export default AdminDashboard;