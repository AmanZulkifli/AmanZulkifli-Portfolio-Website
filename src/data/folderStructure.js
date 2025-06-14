export const folderStructure = {
    root: {
        type: 'folder',
        items: ['Work', 'Spotify Playlists', 'Tetris']
    },
    Work: {
        type: 'folder',
        items: ['About', 'Projects']
    },
    About: {
        type: 'folder',
        items: ['about_me.pdf', 'experience.pdf', 'tools.pdf']
    },
    Projects: {
        type: 'folder',
        items: ['Project 1', 'Project 2', 'Project 3'],
        protected: true
    },
    'Spotify_Playlists': {
        type: 'folder',
        items: ['Space Out.pdf', 'Air mulai turun kamerad.pdf', 'Berkabut Berdebu.pdf']
    },
    Tetris: {
        type: 'file',
        items: []
    }
};