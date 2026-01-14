import { Zap, Palette, Sliders } from 'lucide-react';

const features = [
  {
    name: 'Brief → Deck in Minutes',
    description: 'Stop staring at blank slides. Paste your brief or URL, and get a structured presentation instantly.',
    icon: Zap,
  },
  {
    name: 'On-Brand by Default',
    description: 'No more font policing. PulseDeck respects your brand kit, applying correct colors and typography automatically.',
    icon: Palette,
  },
  {
    name: 'Creator-Friendly Control',
    description: 'You stay in the driver’s seat. Generate the base, then refine and customize freely inside Adobe Express.',
    icon: Sliders,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to present faster
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white/5 backdrop-blur-sm rounded-lg px-6 pb-8 h-full border border-white/10 hover:border-indigo-500/50 transition-colors">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-md shadow-lg border border-indigo-500/30">
                        <feature.icon className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
