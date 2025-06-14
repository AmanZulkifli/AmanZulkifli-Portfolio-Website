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

  return (
    <div className="p-6 h-full bg-[#fff5ee] text-[#1e1e1e] space-y-6 overflow-y-auto font-poppins">
      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-xl p-4 bg-white/60 shadow-sm">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-black/10">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="object-cover w-full h-full"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=Aman+Zulkifli'; }}
          />
          <span
            className={`absolute z-10 bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow ${{
              online: 'bg-green-500', busy: 'bg-yellow-500', offline: 'bg-gray-400'
            }[onlineStatus]}`}
            title={onlineStatus}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Aman Zulkifli</h1>
          <p className="text-sm text-gray-600">Active 09:00–20:00 WIB 🕒</p>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-dashed p-4 bg-white/40 shadow-inner">
          <p className="text-xs text-gray-500 font-medium mb-1">{day}</p>
          <p className="text-xl font-bold text-black tracking-tight">{timeStr} <span className="text-sm text-gray-500">WIB</span></p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl border border-orange-300 border-dashed p-4 hover:bg-orange-100 transition-colors shadow"
        >
          <p className="text-xs text-gray-500 font-medium mb-1">📨 Send Message</p>
          <p className="text-base text-orange-600 font-semibold">Say “Hello!”</p>
        </button>
      </div>

      {/* Placeholder Block */}
      <div className="rounded-xl border border-dashed p-6 text-center italic text-gray-500 bg-white/30 shadow-inner">
        🚧 Project space under construction. Stay tuned!
      </div>

      {/* Bio */}
      <p className="text-black/80 text-lg leading-relaxed">
        Still learning, always building — I’m passionate about design, code, and creating things that matter.
      </p>

      {/* Location */}
      <p className="text-lg font-semibold text-black pt-2">📍 Bogor, ID</p>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'message'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-gray-600 font-medium capitalize mb-1">
                    {field}*
                  </label>
                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      required
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none"
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-orange-600 transition"
                >
                  Send Message
                </button>
                <p className="text-xs text-gray-500 max-w-xs">
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
