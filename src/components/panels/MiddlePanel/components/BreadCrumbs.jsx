export default function Breadcrumbs({ path, setPath, setActiveFile }) {
    return (
        <div className="flex items-center my-auto text-sm text-[#5a4a42]">
        {path.map((folder, index) => (
            <span key={index} className="flex items-center">
            <span
                onClick={() => {
                if (index < path.length - 1) {
                    setPath(path.slice(0, index + 1));
                    setActiveFile(null);
                }
                }}
                className={`cursor-pointer hover:underline ${
                index === path.length - 1 ? "font-bold" : ""
                }`}
            >
                {folder === "root" ? "Home" : folder.replace(/_/g, " ")}
            </span>
            {index < path.length - 1 && (
                <span className="mx-2 text-[#a38b7a]">/</span>
            )}
            </span>
        ))}
        </div>
    );
}
