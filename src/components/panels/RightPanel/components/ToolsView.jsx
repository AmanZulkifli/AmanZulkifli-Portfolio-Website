export default function ToolsView() {
    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
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
            <div key={tool.name} className="flex items-center p-3 rounded-lg border-2 border-dashed border-[#d4b8a8] hover:bg-[#f8e0d5] transition-colors">
            <span className="text-xl mr-3">{tool.icon}</span>
            <span className="text-sm font-medium text-[#5a4a42]">{tool.name}</span>
            </div>
        ))}
        </div>
    );
}