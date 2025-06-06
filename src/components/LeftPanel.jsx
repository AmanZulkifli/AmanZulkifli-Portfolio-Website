import { useState, useEffect } from 'react';

export default function LeftPanel() {
  const [time, setTime] = useState(new Date());
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const [showHelloPopup, setShowHelloPopup] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const hour = est.getHours();
      const day = est.getDay();

      if (day >= 1 && day <= 5) {
        if (hour >= 9 && hour < 20) setOnlineStatus("online");
        else if ((hour >= 7 && hour < 9) || (hour >= 20 && hour < 22)) setOnlineStatus("busy");
        else setOnlineStatus("offline");
      } else {
        setOnlineStatus("offline");
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

  const { day, timeStr, timeZone } = (() => {
    const options = {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
      hour12: true,
    };
    const day = time.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" });
    const timeStr = time.toLocaleTimeString("en-US", options);
    const abbr = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      timeZoneName: "short",
    }).includes("EDT") ? "EDT" : "EST";
    return { day, timeStr, timeZone: abbr };
  })();

  const handleSayHello = () => {
    setShowHelloPopup(true);
    setTimeout(() => setShowHelloPopup(false), 3000);
  };

  return (
    <div className="p-6 h-full bg-[#fff5ee] text-[#1e1e1e] space-y-6 overflow-y-auto font-sans">
      {/* Hello Popup */}
      {showHelloPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 text-orange-800 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Hello! Let's connect!</span>
          </div>
        </div>
      )}

      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-black/10">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Profile"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
              }}
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              onlineStatus === "online"
                ? "bg-green-500"
                : onlineStatus === "busy"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
            title={onlineStatus}
          />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Aman Zulkifli</h1>
          <p className="text-sm text-gray-600">Available between 9:00 AM — 8:00 PM {timeZone} 🌥️</p>
        </div>
      </div>

      {/* Status Widgets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date/Time */}
        <div className="border border-dashed rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-500 mb-1">{day}</p>
          <p className="text-xl font-bold tracking-tight text-black">
            {timeStr.split(' ')[0]} <span className="text-sm font-medium text-black">{timeZone}</span>
          </p>
        </div>

        {/* Say Hello */}
        <button
          onClick={handleSayHello}
          className="border border-dashed rounded-xl px-4 py-3 hover:bg-orange-50 transition"
        >
          <p className="text-xs font-medium text-gray-500 mb-1">📨 Send Message</p>
          <p className="text-base font-semibold text-orange-600">Say “Hello!”</p>
        </button>
      </div>

      {/* Placeholder Box */}
      <div className="border border-dashed rounded-xl px-4 py-10 text-center text-sm text-gray-500 italic">
        Coming soon...
      </div>

      {/* Description */}
      <p className="text-sm text-black/80 leading-relaxed">
        Combining creativity with technical expertise, I leverage my design and
        development background to craft forward-thinking solutions while staying up-to-date with trends.
      </p>

      {/* Location */}
      <p className="text-base font-bold text-black pt-2">Bogor, ID</p>
    </div>
  );
}
