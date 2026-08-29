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
        <div onClick={() => setNotifshow && setNotifshow(false)}>
          <div
            className="myScrollArea w-3/4 bg-[#111827] top-12 left-18 text-white rounded-lg shadow-2xl border fixed z-[555] border-zinc-700 overflow-y-auto max-h-[60vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-1.5 text-zinc-400 hover:text-red-400 cursor-pointer"
              onClick={() => setNotifshow && setNotifshow(false)}
            >
              <IoClose size={24} />
            </button>

            <div className="p-4 pb-3 text-lg font-semibold border-b border-zinc-700">
              Notifications
            </div>

            <div className="p-5 space-y-6">
              {dummyNotifications.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-xl p-2 ${
                    note.type === 'important'
                      ? 'bg-emerald-950 border border-emerald-700'
                      : 'bg-zinc-800'
                  }`}
                >
                  <div className="flex p-2 justify-between">
                    <h3 className="text-[25px] w-55 font-bold">{note.title}</h3>
                    <span className="text-[14px] w-20 mt-3 text-right text-zinc-400">{note.date}</span>
                  </div>

                  <div className="p-3">
                    <p className="text-sm text-zinc-300 leading-relaxed">{note.detail}</p>

                    {note.features && (
                      <ul className="list-disc list-inside mt-3 text-sm text-zinc-400 space-y-1">
                        {note.features.map((f, i) => (
                          <li key={i}>
                            <strong className="text-white">{f.label}</strong> - {f.desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {note.action && (
                    <div className="mt-3">
                      <button className="text-emerald-400 hover:underline text-sm font-medium cursor-pointer">
                        {note.action}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
