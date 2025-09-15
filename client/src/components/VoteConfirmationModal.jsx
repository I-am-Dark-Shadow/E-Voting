import React from 'react';
import { CheckCircle } from 'lucide-react';

const VoteConfirmationModal = ({ isOpen, onClose, votedCandidate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 ring-1 ring-white/20 p-8 text-center max-w-sm mx-4">
        <CheckCircle className="h-16 w-16 mx-auto text-green-400" />
        <h2 className="mt-4 text-2xl font-semibold text-white">Vote Recorded!</h2>
        <p className="mt-2 text-slate-400">
          Your vote for <span className="font-bold text-cyan-300">{votedCandidate.name}</span> has been successfully cast.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 bg-white/10 hover:bg-white/20 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VoteConfirmationModal;