export default function AboutView() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#e8a87c]/20 to-[#f8e0d5]/20">
        <img 
          src="/about.jpg" 
          alt="About Me" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-0 m-2" />
        <div className="absolute bottom-4 left-4">
          <h2 className="text-xl font-bold text-white">About Me</h2>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[#5a4a42]">
          Hey, I'm Tegar Badruzzaman Zulkifli, a web development student and aspiring full-stack developer with a growing portfolio of real-world projects. I specialize in combining design thinking with technical skills to build meaningful digital experiences.
        </p>
        <p className="text-[#5a4a42]">
          My experience includes creating product-based websites, information systems, and user-centered applications. I'm passionate about learning, leading, and delivering thoughtful solutions that solve real problems — both through code and collaboration.
        </p>

        <div className="mt-4">
          <h3 className="font-bold text-[#5a4a42] mb-3">Expertise & Skills:</h3>
          <div className="grid grid-cols-2 gap-3">
            {['User Experience', 'User Interface', 'Front-End Development', 'Back-End Development', 'Project Management', 'HTML/CSS/JS', 'ReactJS', 'Laravel', 'MySQL', 'Bootstrap', 'Tailwind', 'GitHub'].map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a87c]"></span>
                <span className="text-sm text-[#5a4a42]">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}