import { FileText, Wand2, Layout } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Drop your brief & links',
    description: 'Paste your content brief, blog URL, or notes directly into the PulseDeck add-on sidebar.',
    icon: FileText,
  },
  {
    id: 2,
    name: 'Generate an on-brand deck',
    description: 'Our AI analyzes your content and builds a multi-slide deck using your selected Adobe Express brand kit.',
    icon: Wand2,
  },
  {
    id: 3,
    name: 'Refine inside Adobe Express',
    description: 'The deck opens instantly in the editor. Tweak layouts, swap images, and export with full creative control.',
    icon: Layout,
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            From idea to deck in three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-indigo-900/50 -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.id} className="relative flex flex-col items-center text-center bg-transparent p-4">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-slate-900 border-4 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] mb-6">
                  <step.icon className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.name}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
