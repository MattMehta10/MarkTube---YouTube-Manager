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
      detail: `We're thrilled to have you onboard! MarkTube is your personal YouTube manager — helping you stay organized, focused, and productive.`,
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

  return (
    <>
      {Notifshow && (
        <>
          {/* Subtle light backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/25 z-[554]"
            onClick={() => setNotifshow && setNotifshow(false)}
          />

          {/* Dropdown panel anchored near top-right notification icon */}
          <div
            className="myScrollArea fixed top-14 right-3 z-[555] w-80 max-w-[calc(100vw-24px)] bg-[#111827] text-white rounded-xl shadow-2xl border border-zinc-700/80 overflow-y-auto max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-red-400 cursor-pointer"
              onClick={() => setNotifshow && setNotifshow(false)}
            >
              <IoClose size={18} />
            </button>

            <div className="p-3 px-4 text-sm font-semibold border-b border-zinc-700/80">
              Notifications
            </div>

            <div className="p-3 space-y-3">
              {dummyNotifications.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-xl p-3 ${
                    note.type === 'important'
                      ? 'bg-emerald-950/80 border border-emerald-700/60'
                      : 'bg-zinc-800/80 border border-zinc-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-white leading-snug">{note.title}</h3>
                    <span className="text-[10px] text-zinc-400 shrink-0">{note.date}</span>
                  </div>

                  <div className="mt-1.5">
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{note.detail}</p>

                    {note.features && (
                      <ul className="list-disc list-inside mt-1.5 text-[11px] text-zinc-400 space-y-1">
                        {note.features.map((f, i) => (
                          <li key={i}>
                            <strong className="text-white">{f.label}</strong> - {f.desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {note.action && (
                    <div className="mt-2">
                      <button className="text-emerald-400 hover:underline text-[11px] font-medium cursor-pointer">
                        {note.action}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Notification;
