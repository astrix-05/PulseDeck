export default function Roadmap() {
  const milestones = [
    {
      phase: 'Phase 1',
      title: 'Prototype',
      date: 'Q1 2026',
      description: 'Core content-to-deck engine, basic slide layouts, and Adobe Express add-on integration.',
      status: 'current'
    },
    {
      phase: 'Phase 2',
      title: 'Brand Kits & Templates',
      date: 'Q2 2026',
      description: 'Advanced brand kit support, custom templates, and smarter layout suggestions.',
      status: 'upcoming'
    },
    {
      phase: 'Phase 3',
      title: 'Collaboration',
      date: 'Q3 2026',
      description: 'Team workflows, shared asset libraries, and real-time feedback tools.',
      status: 'upcoming'
    }
  ];

  return (
    <div id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Roadmap</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Building the future of presentation design
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-indigo-900 ml-4 md:ml-0 space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                <span className={`absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 ${milestone.status === 'current' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-700'}`} />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">
                    {milestone.phase}: {milestone.title}
                  </h3>
                  <span className="text-sm font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                    {milestone.date}
                  </span>
                </div>
                <p className="text-gray-400 text-base">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
