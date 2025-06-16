export default function AboutView() {
  return (
    <div className="space-y-3">
      <div className="relative h-40 pixel-corners overflow-hidden border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8]">
        <img 
          src="/about.jpg" 
          alt="About Me" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2">
          <h2 className="text-lg font-bold text-[#fff5ee] pixel-font">ABOUT ME</h2>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <p>
          Hey, I'm Tegar Badruzzaman Zulkifli, a web development student and aspiring full-stack developer with a growing portfolio of real-world projects.
        </p>
        <p>
          My experience includes creating product-based websites, information systems, and user-centered applications.
        </p>

        <div className="mt-3">
          <h3 className="font-bold text-[#5a4a42] mb-2 border-b-2 border-[#d4b8a8] pb-1">EXPERTISE & SKILLS:</h3>
          <div className="grid grid-cols-2 gap-2">
            {['User Experience', 'User Interface', 'Front-End Development', 'Back-End Development', 'Project Management', 'HTML/CSS/JS', 'ReactJS', 'Laravel', 'MySQL', 'Bootstrap', 'Tailwind', 'GitHub'].map((skill) => (
              <div key={skill} className="flex items-center">
                <span className="w-1.5 h-1.5 pixel-corners bg-[#e8a87c] mr-1"></span>
                <span className="text-xs">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}