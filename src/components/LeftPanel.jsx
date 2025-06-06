import { useState, useEffect } from 'react';

export default function LeftPanel() {
  const [time, setTime] = useState(new Date());
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [form, setForm] = useState({ name: '', email: '', message: '' }); // State for form data

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
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:amans172007@gmail.com?subject=Hello from ${form.name}&body=${encodeURIComponent(
      form.message
    )}%0D%0A%0D%0AFrom: ${form.name} (${form.email})`;

    window.location.href = mailtoLink;
    setIsModalOpen(false); // Close modal after sending
  };

  return (
    <div className="p-6 h-full bg-[#fff5ee] text-[#1e1e1e] space-y-6 overflow-y-auto font-poppins">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-black/10">
            <img
              src="src/assets/profile.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=Aman+Zulkifli';
              }}
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              onlineStatus === 'online'
                ? 'bg-green-500'
                : onlineStatus === 'busy'
                ? 'bg-yellow-500'
                : 'bg-gray-400'
            }`}
            title={onlineStatus}
          />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Aman Zulkifli</h1>
          <p className="text-sm text-gray-600">Active around 09:00 – 20:00 WIB 🕒</p>
        </div>
      </div>

      {/* Status Widgets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date/Time */}
        <div className="border border-dashed rounded-xl px-4 py-3 bg-white/50">
          <p className="text-xs font-medium text-gray-500 mb-1">{day}</p>
          <p className="text-xl font-bold tracking-tight text-black">
            {timeStr} <span className="text-sm text-gray-500">WIB</span>
          </p>
        </div>

        {/* Say Hello Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="border border-dashed border-orange-300 rounded-xl px-4 py-3 hover:bg-orange-50 transition block"
        >
          <p className="text-xs font-medium text-gray-500 mb-1">📨 Send Message</p>
          <p className="text-base font-semibold text-orange-600">Say “Hello!”</p>
        </button>
      </div>

      {/* Tagline / Placeholder */}
      <div className="border flex items-center align-middle justify-center border-dashed h-70 rounded-xl px-4 py-8 text-center text-xl text-gray-500 italic bg-white/30">
        🚧 Project space under construction. Stay tuned!
      </div>

      {/* Bio */}
      <p className="text-xl text-black/80 leading-relaxed">
            Still learning, always building — I’m passionate about design, code, and creating things that matter.
      </p>

      {/* Location */}
      <p className="text-xl mt-50 font-bold text-black pt-2">Bogor, ID</p>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="max-w-2/7 w-full rounded-lg border border-dotted border-gray-400 bg-[#f7f2ee] p-10 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold text-gray-400 text-lg mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 bg-transparent text-gray-400 text-lg mb-2 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold text-gray-400 text-lg mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Email*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 bg-transparent text-gray-400 text-lg mb-2 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold text-gray-400 text-lg mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Message*
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 bg-transparent text-gray-400 text-lg resize-none focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  className="text-orange-600 border border-dotted border-orange-600 rounded-full px-5 py-2 text-sm font-semibold font-sans hover:bg-orange-50"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Send message
                </button>
                <p
                  className="text-gray-500 ml-5 text-sm max-w-xs font-sans"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  By filling out this form, you consent to the collection and use of your
                  information.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
