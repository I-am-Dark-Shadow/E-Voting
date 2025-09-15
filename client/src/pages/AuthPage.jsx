import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { loadModels } from '../utils/faceUtils';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const setup = async () => {
      console.log("AuthPage: Loading models...");
      await loadModels();
      setModelsLoaded(true);
      console.log("AuthPage: Models loaded.");
    };
    setup();
  }, []);

  return (
    <main className="relative z-10">
      <section id="authSection" className="mx-auto max-w-lg px-6 py-10 md:py-16">
        <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl p-5 md:p-6 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          
          <h2 className="text-xl font-semibold text-white mb-4">Voter Login</h2>
          
          {modelsLoaded ? (
            <LoginForm />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4" />
              <p className="text-slate-300">Initializing...</p>
              <p className="text-xs text-slate-500">This may take a moment on the first visit.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AuthPage;