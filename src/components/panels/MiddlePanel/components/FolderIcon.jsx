export default function FolderIcon({ size = 32 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className="pixel-corners"
    >
      {/* Folder body with 90s bevel effect */}
      <rect 
        x="2" 
        y="4" 
        width="28" 
        height="24" 
        rx="2" 
        fill="#e8a87c"
        stroke="#d4b8a8"
        strokeWidth="2"
      />
      
      {/* Folder tab */}
      <path 
        d="M24,4 H12 C10,4 8,6 8,8 V10 H26 V8 C26,6 24,4 24,4 Z" 
        fill="#f8e0d5"
        stroke="#d4b8a8"
        strokeWidth="2"
      />
      
      {/* Folder highlight */}
      <rect 
        x="4" 
        y="6" 
        width="24" 
        height="4" 
        fill="#fff5ee" 
        fillOpacity="0.3"
      />
      
      {/* Folder shadow */}
      <rect 
        x="6" 
        y="26" 
        width="22" 
        height="2" 
        fill="#5a4a42" 
        fillOpacity="0.2"
      />
    </svg>
  );
}