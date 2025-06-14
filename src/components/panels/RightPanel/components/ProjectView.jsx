export default function ProjectView({ project }) {
  if (!project) return null;

  const { title, description, image, link, steps } = project;

  return (
    <div className="space-y-4 animate-fade-in">
      {image && (
        <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#e8a87c]/20 to-[#f8e0d5]/20 border-2 border-dashed border-[#d4b8a8]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-dashed border-[#e8a87c] m-2" />
        </div>
      )}
      
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-[#e8a87c]">{title}</h2>
        <p className="text-[#5a4a42]">{description}</p>
        
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-[#e8a87c] hover:underline"
          >
            View Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
              <path d="M6 3H13V10" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 3L3 13" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        )}
        
        {steps?.length > 0 && (
          <div className="mt-3">
            <h3 className="font-bold text-[#5a4a42] mb-2">Project Details:</h3>
            <ul className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e8a87c] mt-2 mr-2"></span>
                  <span className="text-[#5a4a42]">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}