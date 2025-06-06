// RightPanel.jsx
import { useState, useEffect } from 'react';

export default function RightPanel({ activeFile }) {
  const [activeTab, setActiveTab] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isGlitch, setIsGlitch] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('projectsData');
    if (stored) setProjects(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!activeFile) {
      setActiveTab(null);
      setSelectedProject(null);
      return;
    }

    const lower = activeFile.toLowerCase().replace(/_/g, ' ');

    if (lower.includes('about')) setActiveTab('about');
    else if (lower.includes('experience')) setActiveTab('experience');
    else if (lower.includes('tools')) setActiveTab('tools');
    else if (lower.includes('project')) {
      const index = parseInt(activeFile.replace(/\D/g, ''), 10) - 1;
      if (!isNaN(index)) {
        setIsGlitch(true);
        setTimeout(() => setIsGlitch(false), 1000);
        if (projects[index]) {
          setSelectedProject(projects[index]);
          setActiveTab(null);
        }
      }
    } else {
      setActiveTab(null);
      setSelectedProject(null);
    }
  }, [activeFile, projects]);

  useEffect(() => {
    if (activeFile === 'Spotify_Playlists') {
      fetchSpotifyPlaylists();
    }
  }, [activeFile]);

  const fetchSpotifyPlaylists = async () => {
    setIsLoading(true);
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa('YOUR_CLIENT_ID:YOUR_CLIENT_SECRET')}`,
        },
        body: 'grant_type=client_credentials',
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const playlistsResponse = await fetch(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const playlistsData = await playlistsResponse.json();
      setSpotifyPlaylists(playlistsData.items || []);
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProject = () => {
    if (!selectedProject) return null;

    const { title, description, image, link, steps } = selectedProject;

    return (
      <div className="space-y-4">
        {image && (
          <div className="relative h-48 rounded overflow-hidden bg-[#f8e0d5] border-2 border-dashed border-[#d4b8a8]">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-[#e8a87c] m-2" />
          </div>
        )}
        <h2 className="text-xl font-bold text-[#e8a87c]">{title}</h2>
        <p className="text-[#5a4a42]">{description}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#e8a87c] hover:underline inline-flex items-center">
            View Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
              <path d="M6 3H13V10" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 3L3 13" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        )}
        {steps?.length > 0 && (
          <div>
            <h3 className="font-bold text-[#5a4a42] mb-1">Project Details:</h3>
            <ul className="list-disc pl-5 text-[#5a4a42] space-y-1">
              {steps.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
        )}
        <button
          onClick={() => setSelectedProject(null)}
          className="mt-4 text-sm text-[#a38b7a] hover:text-[#5a4a42] flex items-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
            <path d="M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back to files
        </button>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="space-y-4">
      <div className="relative h-48 bg-[#f8e0d5] rounded-lg overflow-hidden border-2 border-dashed border-[#d4b8a8]">
        <img src="/about-me.jpg" alt="About Me" className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-2 border-dashed border-[#e8a87c] m-2" />
      </div>
      <p className="text-[#5a4a42]">
        Hey, I'm Joe Lee, a UI/UX designer and Webflow Developer with over 4 years of experience. I specialize in crafting visuals that communicate clearly and bring brands to life.
      </p>
      <p className="text-[#5a4a42]">
        I combine design and development to deliver high-performing websites. Tools include Webflow, GSAP, Barba.js, and a lot of research.
      </p>
      <h3 className="font-bold text-[#5a4a42]">Expertise & Skills:</h3>
      <ul className="list-disc pl-5 space-y-1 text-[#5a4a42]">
        <li>User Experience</li>
        <li>User Interface</li>
        <li>Graphic Design</li>
        <li>Webflow Development</li>
        <li>Research & Competitive Analysis</li>
        <li>HTML, CSS, JS, GSAP, Barba.js, Node.js</li>
      </ul>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="relative h-48 bg-[#f8e0d5] rounded-lg overflow-hidden border-2 border-dashed border-[#d4b8a8]">
        <h3 className="font-bold text-[#5a4a42]">Freelance | UX/UI Designer, Webflow Dev</h3>
        <p className="text-sm text-[#a38b7a]">Aug 2023 – Present</p>
        <ul className="list-disc pl-5 mt-2 text-[#5a4a42] space-y-1">
          <li>Identified gaps through market research</li>
          <li>Designed high-converting UI with branding balance</li>
          <li>Used GSAP & JS for performant animations</li>
          <li>Built custom features with Barba.js and Webflow CMS</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-[#5a4a42]">Career Break | Learning & Growth</h3>
        <p className="text-sm text-[#a38b7a]">Mar 2023 – Jul 2023</p>
        <p className="text-[#5a4a42] mt-2">
          Took 5 months to master GSAP, Webflow, and Barba.js for immersive creative dev work.
        </p>
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="space-y-4 w-full px-4">
      {['Figma', 'Webflow', 'GSAP', 'HTML/CSS/JS', 'Barba.js', 'Node.js'].map((tool) => (
        <div key={tool} className="w-full border-t-2 border-dashed border-[#d4b8a8] pt-3">
          <div className="flex items-center gap-2 w-full">
            <div className="w-6 h-6 bg-[#f8e0d5] rounded flex items-center justify-center border-2 border-dashed border-[#e8a87c]">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="2" y="4" width="12" height="9" rx="1" stroke="#e8a87c" strokeWidth="1.5" />
                <path d="M5 4V2C5 1.44772 5.44772 1 6 1H10C10.5523 1 11 1.44772 11 2V4" stroke="#e8a87c" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#5a4a42] flex-1">{tool}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpotifyPlaylists = () => (
    <div className="space-y-4">
      {spotifyPlaylists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-[#f8e0d5] transition"
        >
          <img
            src={playlist.images[0]?.url || '/placeholder.png'}
            alt={playlist.name}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="text-lg font-bold text-[#5a4a42]">{playlist.name}</h3>
            <p className="text-sm text-[#a38b7a]">{playlist.description || 'No description available'}</p>
            <p className="text-sm text-[#5a4a42]">{playlist.tracks.total} songs</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mb-4">
        <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" stroke="#d4b8a8" strokeWidth="1.5"/>
      </svg>
      <h3 className="text-lg font-medium text-[#5a4a42] mb-2">No preview available</h3>
      <p className="text-[#a38b7a]">Select a file to view its contents</p>
    </div>
  );

  return (
    <div className={`right-panel h-full w-full p-6 overflow-y-auto bg-[#fff5ee] ${isGlitch ? 'glitch-effect' : ''}`}>
      {!activeFile ? (
        renderEmptyState()
      ) : (
        <div className="w-full">
          {selectedProject ? renderProject() : activeTab === 'about' ? renderAbout() : activeTab === 'experience' ? renderExperience() : activeTab === 'tools' ? renderTools() : activeTab === 'Spotify_Playlists' ? isLoading ? <p className="text-center text-[#5a4a42]">Loading playlists...</p> : renderSpotifyPlaylists() : null}
          <div className="mt-8 pt-4 border-t-2 border-dashed border-[#d4b8a8]">
            <p className="text-xs text-[#a38b7a]">
              theme: <span className="text-[#e8a87c] font-mono">$(hazy.retro)</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}