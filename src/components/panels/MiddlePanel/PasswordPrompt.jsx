export default function PasswordPrompt({ 
  password, 
  setPassword, 
  onSubmit, 
  onCancel, 
  error 
}) {
  return (
    <div className="password-prompt p-4 bg-[#f8e0d5] rounded-lg border-2 border-dashed border-[#e8a87c]">
      <h3 className="text-lg font-bold text-[#5a4a42] mb-3">Protected Content</h3>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border-2 border-dashed border-[#d4b8a8] rounded bg-white text-[#5a4a42] focus:outline-none focus:ring-1 focus:ring-[#e8a87c] pixel-corners"
            autoFocus
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-[#f0d5c4] p-1 rounded"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8L3 8" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 5L13 8L10 11" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">Incorrect password. Please try again.</p>
        )}
      </form>
      <button
        onClick={onCancel}
        className="text-sm text-[#5a4a42] hover:underline flex items-center"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
          <path d="M9 3L3 9" stroke="#5a4a42" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 3L9 9" stroke="#5a4a42" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Cancel
      </button>
    </div>
  );
}