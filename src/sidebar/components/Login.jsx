import React from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    toast.info(`Account saved (local demo): ${data.username || data.email}`);
    reset();
  };

  const handleGoogleLogin = () => {
    toast.info('Google Auth is stubbed for local extension scope (Phase 3)');
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
        <h2 className="text-lg font-bold text-center mb-1 text-slate-100">Sign In to MarkTube</h2>
        <p className="text-xs text-slate-400 text-center mb-5">
          Local profile & sync preferences
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Username</label>
            <input
              {...register('username')}
              type="text"
              placeholder="Enter your username"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Save Account
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-xs text-slate-500">
          <span className="h-px bg-slate-800 flex-1"></span>
          <span className="px-2">OR</span>
          <span className="h-px bg-slate-800 flex-1"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-slate-700 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-200 transition"
        >
          <FcGoogle className="text-base" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
