import { Code2 } from 'lucide-react';

export default function BuiltBy() {
  return (
    <div className="relative py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 text-center">
          <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Code2 className="h-6 w-6 text-indigo-400" />
          </div>
          <p className="text-gray-400 text-lg">
            Built by the <span className="font-semibold text-indigo-400">Adobe-funded developer</span> behind SolSnippets and OptiAdvisor concept
          </p>
        </div>
      </div>
    </div>
  );
}
