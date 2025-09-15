import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCandidates, castVote, getVoteResults } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import VoteConfirmationModal from '../components/VoteConfirmationModal';
import { Loader2, ShieldCheck, LogOut, CheckSquare, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResultsChart from '../components/ResultsChart';

// Tab Button Helper Component
const TabButton = ({ icon, label, activeTab, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-lg ${
            activeTab === label.toLowerCase().replace(' ', '') 
                ? 'bg-white/10 text-white shadow-md'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
        {icon} {label}
    </button>
);

const VotingDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  // নতুন স্টেট যোগ করা হয়েছে
  const [activeTab, setActiveTab] = useState('castvote');
  const [results, setResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // প্রার্থীদের fetch করার জন্য useEffect
  useEffect(() => {
    if (user) {
      const fetchCandidates = async () => {
        setIsLoading(true);
        try {
          const { data } = await getCandidates();
          setCandidates(data);
        } catch (err) {
          setError('Could not fetch candidates. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCandidates();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // ফলাফলের জন্য নতুন useEffect
  useEffect(() => {
    if (activeTab === 'liveresults') {
      const fetchResults = async () => {
        setIsLoadingResults(true);
        try {
          const { data } = await getVoteResults();
          setResults(data.results);
        } catch (err) {
          setError('Could not fetch results.');
        } finally {
          setIsLoadingResults(false);
        }
      };
      fetchResults();
    }
  }, [activeTab]);

  const handleVote = async (candidateId, candidateName) => {
    try {
      await castVote(candidateId);
      updateUser({ hasVoted: true });
      setVotedCandidate({ name: candidateName });
      setShowModal(true);

      setTimeout(() => {
        logout();
        navigate('/');
      }, 30000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <>
      <main className="relative z-10 min-h-screen p-6 md:p-8">
        <header className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Voting Dashboard</h1>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        <div className="max-w-7xl mx-auto mt-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl ring-1 ring-white/10">
            <div>
              <p className="text-lg font-semibold text-white">
                Welcome: <span className="text-cyan-400 font-semibold">{user.name}</span>
              </p>
              <p className="text-lg font-semibold text-white">
                ID: <span className="text-green-400 font-semibold">{user.voterId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* নতুন ট্যাব সেকশন */}
        <div className="max-w-7xl mx-auto my-8 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <TabButton icon={<CheckSquare size={16}/>} label="Vote" activeTab={activeTab} onClick={() => setActiveTab('castvote')} />
            <TabButton icon={<BarChart2 size={16}/>} label="Live Results" activeTab={activeTab} onClick={() => setActiveTab('liveresults')} />
          </div>
        </div>

        {/* ট্যাবের উপর ভিত্তি করে কন্টেন্ট দেখানো হচ্ছে */}
        {activeTab === 'castvote' && (
            user.hasVoted ? (
              <div className="text-center max-w-xl mx-auto rounded-2xl bg-white/5 ring-1 ring-green-400/20 backdrop-blur-xl p-8 shadow-md">
                <ShieldCheck className="h-16 w-16 mx-auto text-green-400" />
                <h2 className="mt-4 text-2xl font-semibold text-white">Thank You For Voting!</h2>
                <p className="mt-2 text-slate-400">Your vote has been recorded successfully.</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {error && <p className="text-center text-red-400 mb-4">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {candidates.map(candidate => (
                    <CandidateCard
                      key={candidate._id}
                      candidate={candidate}
                      onVote={handleVote}
                      disabled={user.hasVoted}
                    />
                  ))}
                </div>
              </div>
            )
        )}
        
        {activeTab === 'liveresults' && (
            <div className="max-w-7xl mx-auto">
                {isLoadingResults ? (
                     <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
                ) : (
                    <ResultsChart results={results} showChartOnly={true} />
                )}
            </div>
        )}

      </main>

      <VoteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        votedCandidate={votedCandidate}
      />
    </>
  );
};

export default VotingDashboard;