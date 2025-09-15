import React from 'react';


const CandidateCard = ({ candidate, onVote, disabled }) => {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:bg-white/10">
      <img 
        src={candidate.logoUrl} 
        alt={`${candidate.party} logo`}
        className="w-24 h-24 rounded-full mx-auto object-contain ring-2 ring-white/20 bg-slate-900/50 p-1"
      />
      <h3 className="mt-4 text-xl font-semibold text-white">{candidate.party}</h3>
      <p className="text-slate-400 text-sm">{candidate.name}</p>
      <button 
        onClick={() => onVote(candidate._id, candidate.name)}
        disabled={disabled}
        className="mt-5 w-full rounded-lg px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyan-400/10"
      >
        Vote
      </button>
    </div>
  );
};

export default CandidateCard;