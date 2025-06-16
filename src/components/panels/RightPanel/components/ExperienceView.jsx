export default function ExperienceView() {
  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      {/* Golovera SC */}
      <div className="space-y-1">
        <div>
          <h3 className="text-sm font-bold">GOLOVERA SC | DIRECTOR OF HR</h3>
          <p className="text-xs text-[#a38b7a]">NOV 2024 – JUL 2025</p>
        </div>
        <ul className="list-disc pl-4 text-xs space-y-1">
          <li>Led HR strategies in student company</li>
          <li>Coordinated internal communication</li>
          <li>Developed leadership skills</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* OSIS SMK Wikrama */}
      <div className="space-y-1">
        <div>
          <h3 className="text-sm font-bold">OSIS SMK WIKRAMA | ENGLISH COMMS</h3>
          <p className="text-xs text-[#a38b7a]">NOV 2023 – PRESENT</p>
        </div>
        <ul className="list-disc pl-4 text-xs space-y-1">
          <li>Organized English programs</li>
          <li>Improved communication skills</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* FOJB */}
      <div className="space-y-1">
        <div>
          <h3 className="text-sm font-bold">FOJB WILAYAH II | LEARNING CENTER</h3>
          <p className="text-xs text-[#a38b7a]">SEP 2024 – PRESENT</p>
        </div>
        <ul className="list-disc pl-4 text-xs space-y-1">
          <li>Collaborated across schools</li>
          <li>Built Learning Center division</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* Education */}
      <div className="space-y-1">
        <div>
          <h3 className="text-sm font-bold">SMK WIKRAMA BOGOR</h3>
          <p className="text-xs text-[#a38b7a]">JUL 2023 – PRESENT</p>
        </div>
        <ul className="list-disc pl-4 text-xs space-y-1">
          <li>Software and Game Development</li>
          <li>Web development certifications</li>
          <li>Built practical web projects</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>
    </div>
  );
}