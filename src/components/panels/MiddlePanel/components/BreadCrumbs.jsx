export default function Breadcrumbs({ path, setPath, setActiveFile }) {
  return (
    <div className="flex items-center my-auto text-sm text-[#5a4a42] bg-[#f0d5c4] p-1 pixel-corners border-2 border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee]">
      {path.map((folder, index) => (
        <span key={index} className="flex items-center">
          <span
            onClick={() => {
              if (index < path.length - 1) {
                setPath(path.slice(0, index + 1));
                setActiveFile(null);
              }
            }}
            className={`cursor-pointer px-2 py-1 rounded-sm border-2 ${
              index === path.length - 1 
                ? 'border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] bg-[#f8e0d5]' 
                : 'border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee] hover:bg-[#f8e0d5]'
            } pixel-corners pixel-font`}
          >
            {folder === "root" ? "Home" : folder.replace(/_/g, " ")}
          </span>
          {index < path.length - 1 && (
            <span className="mx-1 text-[#a38b7a]">›</span>
          )}
        </span>
      ))}
    </div>
  );
}