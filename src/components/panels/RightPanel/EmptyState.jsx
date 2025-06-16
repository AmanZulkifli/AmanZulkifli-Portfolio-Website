export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-50">
        <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" stroke="#d4b8a8" strokeWidth="1.5"/>
      </svg>
      <h3 className="text-sm font-bold text-[#5a4a42] mb-1">NO FILE SELECTED</h3>
      <p className="text-xs text-[#a38b7a] max-w-md">
        Select a file from the folder to view its contents.
      </p>
    </div>
  );
}