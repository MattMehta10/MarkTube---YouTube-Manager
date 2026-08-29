import React, { useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { MTContext } from '../Wrapper';
import './Notify.css';

const Notification = () => {
  const context = useContext(MTContext) || {};
  const { Notifshow, setNotifshow } = context;

  const dummyNotifications = [
    {
      id: 1,
      title: 'Confirm your Email ✉️',
      detail:
        'Please confirm your Email to continue using MarkTube. Make sure to also check your SPAM folder ⚠️',
      type: 'important',
      action: 'Resend Email',
      date: 'Today',
    },
    {
      id: 2,
      title: 'Welcome to MarkTube 🎉',
      detail:
        "We're thrilled to have you onboard! MarkTube is your personal YouTube manager — helping you stay organized, focused, and productive.",
      features: [
        {
          label: '🎯 Mark Videos',
          desc: 'Save any video as Important, Want to Watch, or Watched.',
        },
        {
          label: '📊 Smart Stats',
          desc: 'Track your watch habits and productivity across time.',
        },
        {
          label: '🧠 AI Watchlist Insights',
          desc: 'Coming soon: Let AI help you prioritize what to watch next.',
        },
        {
          label: '🌙 Dark Mode',
          desc: 'Enjoy a sleek interface that’s easy on your eyes.',
        },
      ],
      date: 'June 17, 2025',
      action: 'Learn more 📚',
    },
  ];

  if (!Notifshow) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-14 px-4" onClick={() => setNotifshow(false)}>
      <div
        className="myScrollArea w-full max-w-sm bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-y-auto max-h-[70vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3.5 right-3 text-slate-400 hover:text-red-400 transition"
          onClick={() => setNotifshow(false)}
        >
          <IoClose size={22} />
        </button>

        <div className="p-4 font-semibold border-b border-slate-800 text-slate-200 text-base">
          Notifications
        </div>

        <div className="p-4 space-y-4">
          {dummyNotifications.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl p-3.5 ${
                note.type === 'important'
                  ? 'bg-emerald-950/60 border border-emerald-800/70'
                  : 'bg-slate-800/80 border border-slate-700/60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-slate-100">{note.title}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{note.date}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{note.detail}</p>

              {note.features && (
                <ul className="mt-2.5 space-y-1 text-xs text-slate-400">
                  {note.features.map((f, i) => (
                    <li key={i}>
                      <strong className="text-slate-200">{f.label}</strong> - {f.desc}
                    </li>
                  ))}
                </ul>
              )}

              {note.action && (
                <div className="mt-3">
                  <button className="text-emerald-400 hover:underline text-xs font-semibold">
                    {note.action}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
