import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Layers, Laptop, Camera, Feather, Award, Search, Info, X } from 'lucide-react';
import { Project } from '../types';
import { getProjectsFromSupabase, getPortfolioCategoriesFromSupabase } from '../supabaseService';

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedDetail, setSelectedDetail] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioCategories, setPortfolioCategories] = useState<{ id: string; label: string }[]>(() => [
    
  ]);

  useEffect(() => {
    async function fetchProjectsAndCategories() {
      try {
        const [projects, categories] = await Promise.all([
          getProjectsFromSupabase(),
          getPortfolioCategoriesFromSupabase()
        ]);
        setProjectsList(projects || []);
        if (categories && categories.length > 0) {
          setPortfolioCategories(categories);
        }
      } catch (err) {
        console.error('Error loading portfolio or categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjectsAndCategories();

    // Listen to local admin modifications to sync portfolio on the fly
    const handlePortfolioChange = () => {
      fetchProjectsAndCategories();
    };
    
    const handleCategoriesChange = () => {
      fetchProjectsAndCategories();
    };

    window.addEventListener('portfolio-changed', handlePortfolioChange);
    window.addEventListener('categories-changed', handleCategoriesChange);
    return () => {
      window.removeEventListener('portfolio-changed', handlePortfolioChange);
      window.removeEventListener('categories-changed', handleCategoriesChange);
    };
  }, []);

  const getIconForCategory = (id: string) => {
    switch (id) {
      case 'Events': return Laptop;
      case 'Event Banking': return Camera;
      case 'certificate': return Award;
      default: return Laptop;
    }
  };

  const filters = [
    { id: 'all', label: 'All', icon: Layers },
    ...portfolioCategories.map(cat => ({
      id: cat.id,
      label: cat.label,
      icon: getIconForCategory(cat.id)
    }))
  ];

  const filteredProjects = projectsList.filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.category === activeFilter;
  });

  // Unique vector mockup illustration renderer for fallback state representation
  const renderMockup = (proj: Project) => {
    switch (proj.category) {
      case 'web':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col justify-between p-4 text-white font-mono select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-indigo-300">https://daniel.host</span>
              <Laptop size={12} className="text-indigo-400" />
            </div>
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
              <CodeIcon name={proj.id} />
              <h4 className="text-xs font-bold text-white mt-2 mb-1 tracking-tight">{proj.title}</h4>
              <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">{proj.description}</p>
            </div>
            <div className="flex items-center justify-between text-[8px] text-indigo-400 border-t border-white/5 pt-2">
              <span>STATUS: LIVE</span>
              <span>INDEX: OK</span>
            </div>
          </div>
        );
      case 'photography':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-emerald-950 flex flex-col justify-between p-4 text-white select-none">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-emerald-300">
              <span>ISO 200</span>
              <span>1/125s</span>
              <span>F/4.5</span>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center relative">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-1000">
                <Camera size={22} className="text-emerald-400" />
              </div>
              <span className="text-[9px] text-emerald-300/80 uppercase font-mono tracking-wider mt-2">
                EXPOSURE: SPOT
              </span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-emerald-500/60 border-t border-emerald-500/10 pt-2">
              <span>{proj.title}</span>
              <span>M-SHOT</span>
            </div>
          </div>
        );
      case 'design':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-fuchsia-950 flex flex-col justify-between p-4 text-white select-none">
            <div className="flex justify-between items-center text-[9px] font-mono text-fuchsia-300/80">
              <span>RGB</span>
              <span>300 DPI</span>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-2 shadow-inner">
                <Feather size={20} className="text-fuchsia-400" />
              </div>
              <h4 className="text-xs font-bold leading-tight">{proj.title}</h4>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-fuchsia-400/50 border-t border-fuchsia-500/10 pt-2">
              <span>CMYK PRINT</span>
              <span>VECTOR</span>
            </div>
          </div>
        );
      case 'certificate':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950 to-orange-950 flex flex-col justify-between p-5 text-white select-none relative overflow-hidden">
            {/* Backdrop credential grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-amber-500/5 -z-1" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-dashed border-amber-500/10 -z-1" />

            <div className="flex justify-between items-start">
              <Award size={20} className="text-amber-400 shrink-0" />
              <div className="w-10 h-10 border-2 border-amber-500/20 bg-amber-500/5 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-amber-300">CERT</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center text-center px-2">
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wide leading-snug line-clamp-2">
                {proj.title}
              </h4>
              <span className="text-[8px] text-orange-400/70 block mt-1 uppercase font-mono">
                Daniel Tulus P.S.
              </span>
            </div>
            <div className="flex justify-between items-center text-[8px] font-mono text-amber-500/50 border-t border-amber-500/10 pt-2">
              <span>ID: {(proj.id || '').substring(0, 8).toUpperCase()}</span>
              <span>BNSP / IPB APPROVED</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-950 flex flex-col justify-between p-4 text-white font-mono select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] text-indigo-300 uppercase tracking-wider">{proj.category}</span>
              <Layers size={12} className="text-indigo-400" />
            </div>
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
              <Laptop size={24} className="text-indigo-400 mb-2" />
              <h4 className="text-xs font-bold text-white mt-1 mb-1 tracking-tight">{proj.title}</h4>
              <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">{proj.description}</p>
            </div>
            <div className="flex items-center justify-between text-[8px] text-indigo-400 border-t border-white/5 pt-2">
              <span>WORK</span>
              <span>DANIEL TULUS</span>
            </div>
          </div>
        );
    }
  };

  // Inner component for project card images with mockup fallback
  const ProjectCardImage = ({ proj }: { proj: Project }) => {
    const [imgFail, setImgFail] = useState(!proj.imageUrl);

    if (imgFail) {
      return renderMockup(proj);
    }

    return (
      <img
        src={proj.imageUrl}
        alt={proj.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImgFail(true)}
        referrerPolicy="no-referrer"
      />
    );
  };

  return (
    <section id="work" className="py-24 bg-[var(--container-color)] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full">
            My Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            Recent Works
          </h2>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Filters Panel */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {filters.map((f) => {
            const FilterIcon = f.icon;
            const isTabActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 relative cursor-pointer ${
                  isTabActive
                    ? 'text-white'
                    : 'text-[var(--text-color-light)] hover:text-[var(--title-color)] hover:bg-neutral-800/5'
                }`}
              >
                {isTabActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[var(--first-color)] shadow-md shadow-blue-500/25 -z-10"
                    layoutId="activeFilterBg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <FilterIcon size={14} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Works Grid with anims */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-[var(--body-color)] rounded-3xl overflow-hidden border border-gray-200/5 shadow-lg flex flex-col h-[340px] group relative hover:border-[var(--first-color)]/20 hover:shadow-2xl transition-all duration-300"
              >
                {/* Simulated Canvas Top Frame */}
                <div className="w-full h-48 relative overflow-hidden bg-slate-950 border-b border-gray-200/5">
                  <ProjectCardImage proj={proj} />

                  {/* Hover Actions Sheet Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                    <button
                      onClick={() => setSelectedDetail(proj)}
                      className="p-3 bg-white/15 hover:bg-white text-white hover:text-neutral-900 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer"
                      title="View Details"
                    >
                      <Search size={18} />
                    </button>
                    {proj.buttonLink && (
                      <a
                        href={proj.buttonLink}
                        target="_blank"
                        className="p-3 bg-[var(--first-color)] hover:bg-[var(--first-color-alt)] text-white rounded-full shadow-lg transition-all duration-300"
                        title="View Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Deck */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[9px] font-bold text-[var(--first-color)] uppercase bg-blue-500/10 px-2 py-0.5 rounded-full inline-block mb-2">
                      {proj.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--title-color)] line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[var(--text-color-light)] line-clamp-2 mt-1.5 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200/5 pt-3.5 mt-2">
                    <button
                      onClick={() => setSelectedDetail(proj)}
                      className="text-xs font-semibold text-[var(--first-color)] hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
                    >
                      Read full desc <Info size={12} />
                    </button>
                    {proj.buttonLink && (
                      <a
                        href={proj.buttonLink}
                        target="_blank"
                        className="text-xs font-bold text-[var(--title-color)] hover:text-[var(--first-color)] transition-colors flex items-center gap-1"
                      >
                        Demo <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <span className="text-sm text-[var(--text-color-light)] block mt-2">
              No works found in this filter category.
            </span>
          </div>
        )}
      </div>

      {/* Detail Showcase Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
            />

            <motion.div
              className="relative w-full max-w-lg bg-[var(--container-color)] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl z-10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button
                onClick={() => setSelectedDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[var(--text-color-light)] hover:text-[var(--title-color)] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Close"
              >
                <X size={15} /> Close
              </button>

              <div className="border-b border-gray-200/5 pb-4 mb-5 pr-8">
                <span className="text-[10px] font-bold text-[var(--first-color)] tracking-wider uppercase bg-blue-500/10 px-3 py-1 rounded-full inline-block mb-2">
                  {selectedDetail.category} Showcase
                </span>
                <h3 className="text-xl font-bold text-[var(--title-color)] pr-4">
                  {selectedDetail.title}
                </h3>
              </div>

              <div className="w-full h-48 relative rounded-2xl overflow-hidden bg-slate-950 mb-5 border border-white/5 shadow-inner">
                <ProjectCardImage proj={selectedDetail} />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-[var(--title-color)] uppercase tracking-wide block mb-1">
                    Description:
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-color)] leading-relaxed text-justify">
                    {selectedDetail.description}
                  </p>
                </div>

                <div className="bg-[var(--body-color)] p-4 rounded-2xl border border-gray-200/5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Portfolio Specs:
                  </span>
                  <ul className="text-xs text-[var(--text-color-light)] space-y-1 font-mono">
                    <li>• Scope ID: {selectedDetail.id}</li>
                    <li>• Owner: Daniel Tulus</li>
                    <li>• Class: Industrial Art</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200/5 flex justify-between items-center">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold text-[var(--text-color-light)] hover:text-[var(--title-color)] transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                {selectedDetail.buttonLink && (
                  <a
                    href={selectedDetail.buttonLink}
                    target="_blank"
                    className="py-2.5 px-6 rounded-xl bg-[var(--first-color)] text-[var(--body-color)] text-xs font-semibold hover:bg-[var(--first-color-alt)] transition-all shadow-md hover:shadow-blue-500/10 active:scale-95 flex items-center gap-1.5"
                  >
                    Launch Demo <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Icon helper function based on project ID
function CodeIcon({ name }: { name: string }) {
  if (name.includes('yamada')) {
    return <span className="text-3xl">🚗</span>;
  }
  if (name.includes('sim-sv')) {
    return <span className="text-3xl">🎓</span>;
  }
  return <span className="text-3xl">💻</span>;
}
