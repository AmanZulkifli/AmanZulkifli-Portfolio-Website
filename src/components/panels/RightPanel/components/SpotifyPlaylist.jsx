export default function SpotifyPlaylist({ playlist }) {
  if (!playlist) return null;

  return (
    <div className="animate-fade-in h-full flex flex-col items-center px-6 pt-6 pb-16">
      {/* Album Art */}
      <div className="w-full max-w-xs sm:max-w-sm aspect-square rounded-lg overflow-hidden shadow-xl border-4 border-[#d4b8a8]">
        <img
          src={playlist.imageUrl}
          alt={playlist.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Info */}
      <div className="text-center mt-6 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5a4a42]">{playlist.title}</h2>
        {playlist.description && (
          <p className="text-[#a38b7a] text-sm max-w-md">{playlist.description}</p>
        )}
        <p className="text-sm text-[#a38b7a]">{playlist.trackCount || 'Unknown'} songs</p>
      </div>

      {/* Play Button */}
      <a
        href={playlist.playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-16 h-16 rounded-full bg-[#1DB954] hover:bg-[#1ed760] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </a>

      {/* Divider */}
      <div className="w-full max-w-md mt-10 border-t border-dashed border-[#e8a87c]" />
    </div>
  );
}
