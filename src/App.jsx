import { useState } from 'react';
import LeftPanel from './components/panels/LeftPanel/LeftPanel';
import MiddlePanel from './components/panels/MiddlePanel/MiddlePanel';
import RightPanel from './components/panels/RightPanel/RightPanel';

export default function App() {
  const [activeFile, setActiveFile] = useState(null);

  return (
    <div className="flex h-screen bg-[#fff5ee]">
      {/* Left Panel - Always 1/3 width */}
      <div className="w-[30%] overflow-auto border-r-2 border-dashed border-[#d4b8a8]">
        <LeftPanel />
      </div>

      {/* Middle Panel - Always 1/3 width */}
      <div className="w-[40%] overflow-auto border-r-2 border-dashed border-[#d4b8a8]">
        <MiddlePanel onFileSelect={(file) => setActiveFile(file)} />
      </div>

      {/* Right Panel - Always 1/3 width, even when no file is selected */}
      <div className="w-[30%] overflow-auto">
        <RightPanel activeFile={activeFile} />
      </div>
    </div>
  );
}