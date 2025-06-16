import { useState, useEffect } from 'react';

export default function LeftPanel() {
  const [time, setTime] = useState(new Date());
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      if (day >= 1 && day <= 5) {
        if (hour >= 9 && hour < 20) setOnlineStatus('online');
        else if ((hour >= 7 && hour < 9) || (hour >= 20 && hour < 22)) setOnlineStatus('busy');
        else setOnlineStatus('offline');
      } else {
        setOnlineStatus('offline');
      }
    };

    updateStatus();
    const statusInterval = setInterval(updateStatus, 60000);
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const day = time.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Jakarta' });
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta', hour12: false,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:amans172007@gmail.com?subject=Hello from ${form.name}&body=${encodeURIComponent(form.message)}%0D%0A%0D%0AFrom: ${form.name} (${form.email})`;
    window.location.href = mailto;
    setIsModalOpen(false);
  };

  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-yellow-400',
    offline: 'bg-gray-400',
  };

  const statusText = {
    online: 'Available',
    busy: 'Busy',
    offline: 'Offline',
  };

  return (
    <div className="p-4 h-full bg-[#f0d5c4] text-[#5a4a42] space-y-4 overflow-y-auto pixel-font border-r-2 border-[#d4b8a8]">
      {/* Profile Card */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 pixel-corners overflow-hidden border-2 border-[#d4b8a8]">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=Aman+Zulkifli';
              }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">AMAN ZULKIFLI</h1>
            <p className="text-xs text-[#a38b7a]">FRONTEND DEVELOPER</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 pixel-corners ${statusColors[onlineStatus]}`}></span>
              <p className="text-xs">{statusText[onlineStatus]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners space-y-2">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#5a4a42">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#e8a87c"/>
            <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
          </svg>
          <p className="text-xs">ACTIVE 09:00–20:00 WIB</p>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#5a4a42">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#e8a87c"/>
            <rect x="4" y="4" width="8" height="8" rx="0.5" fill="#f8e0d5"/>
          </svg>
          <p className="text-xs">BOGOR, INDONESIA</p>
        </div>
      </div>

      {/* Date & Action Widgets */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
          <p className="text-xs text-[#a38b7a]">{day}</p>
          <p className="text-lg font-bold tracking-tight">
            {timeStr} <span className="text-xs">WIB</span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners hover:bg-[#e8a87c] hover:text-[#fff5ee] transition-colors"
        >
          <p className="text-xs">📨 SEND MESSAGE</p>
          <p className="text-sm font-semibold">SAY "HELLO!"</p>
        </button>
      </div>

      {/* Bio Section */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
        <h3 className="text-xs font-bold text-[#a38b7a] mb-1">ABOUT ME</h3>
        <p className="text-xs leading-relaxed">
          Still learning, always building — passionate about design, code, and creating meaningful things.
          Currently focused on frontend development with React and Next.js.
        </p>
      </div>

      {/* Project Info */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners text-center">
        <div className="inline-block p-2 bg-[#e8a87c] pixel-corners mb-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff5ee">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#5a4a42"/>
            <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
          </svg>
        </div>
        <h3 className="text-xs font-bold text-[#5a4a42] mb-1">PROJECT SPACE</h3>
        <p className="text-xs text-[#a38b7a] italic">🚧 UNDER CONSTRUCTION</p>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners p-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-[#e8a87c] text-[#fff5ee] pixel-corners"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-3">GET IN TOUCH</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {['name', 'email', 'message'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-xs font-bold text-[#5a4a42] mb-1">
                    {field.toUpperCase()}*
                  </label>
                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      required
                      value={form[field]}
                      onChange={handleChange}
                      placeholder="Type your message..."
                      className="w-full border-2 border-[#d4b8a8] bg-[#fff5ee] text-[#5a4a42] placeholder:text-[#a38b7a] p-2 text-xs pixel-corners"
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field}`}
                      className="w-full border-2 border-[#d4b8a8] bg-[#fff5ee] text-[#5a4a42] placeholder:text-[#a38b7a] p-2 text-xs pixel-corners"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-[#e8a87c] text-[#fff5ee] pixel-corners px-4 py-1 text-xs font-bold hover:bg-[#d4b8a8] transition-colors"
                >
                  SEND MESSAGE
                </button>
                <p className="text-xs text-[#a38b7a] max-w-[160px]">
                  By submitting, you agree to our information handling policy.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}