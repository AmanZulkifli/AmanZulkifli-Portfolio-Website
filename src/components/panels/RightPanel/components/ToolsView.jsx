export default function ToolsView() {
    return (
        <div className="grid grid-cols-2 gap-2">
        {[
            { name: 'React.js', icon: '⚛️' },
            { name: 'Laravel', icon: '🪄' },
            { name: 'PHP', icon: '🐘' },
            { name: 'HTML/CSS/JS', icon: '🖥️' },
            { name: 'MySQL', icon: '🗃️' },
            { name: 'Bootstrap', icon: '🎨' },
            { name: 'Tailwind', icon: '🌀' },
            { name: 'GitHub', icon: '🐙' },
            { name: 'Trello', icon: '📋' },
            { name: 'Canva', icon: '✏️' }
        ].map((tool) => (
            <div key={tool.name} className="flex items-center p-2 pixel-corners border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] hover:bg-[#f8e0d5] transition-colors">
            <span className="text-sm mr-2">{tool.icon}</span>
            <span className="text-xs font-bold">{tool.name}</span>
            </div>
        ))}
        </div>
    );
}