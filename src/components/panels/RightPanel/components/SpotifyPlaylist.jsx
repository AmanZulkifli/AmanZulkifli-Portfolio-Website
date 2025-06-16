export default function SpotifyPlaylist({ playlist }) {
  if (!playlist) return null;

  return (
    <div className="h-full flex flex-col items-center px-4 pt-4 pb-12">
      {/* Album Art */}
      <div className="w-full max-w-xs aspect-square pixel-corners overflow-hidden border-4 border-[#d4b8a8]">
        <img
          src={playlist.imageUrl}
          alt={playlist.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Info */}
      <div className="text-center mt-4 space-y-1">
        <h2 className="text-xl font-bold text-[#5a4a42] pixel-font">{playlist.title}</h2>
        {playlist.description && (
          <p className="text-[#a38b7a] text-xs max-w-md">{playlist.description}</p>
        )}
        <p className="text-xs text-[#a38b7a]">{playlist.trackCount || 'UNKNOWN'} SONGS</p>
      </div>

      {/* Play Button */}
      <a
        href={playlist.playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-12 h-12 pixel-corners bg-[#1DB954] hover:bg-[#1ed760] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <svg className="w-6 h-6 text-[#fff5ee]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </a>

      {/* Divider */}
      <div className="w-full max-w-md mt-6 border-t-2 border-dashed border-[#e8a87c]" />
    </div>
  );
}