import { motion } from 'motion/react';
import { Award, Briefcase, Headphones } from 'lucide-react';
import { Biodata } from '../types';

export default function About({ biodata }: { biodata?: Biodata }) {
  if (!biodata) return null;

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const aboutBoxes = [
    {
      icon: Award,
      title: 'Experience',
      subtitle: biodata.experienceYears + ' Working',
    },
    {
      icon: Briefcase,
      title: 'Completed',
      subtitle: biodata.projectsCompletedCount,
    },
    {
      icon: Headphones,
      title: 'Support',
      subtitle: biodata.supportAvailability,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[var(--body-color)] relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full">
            My Intro
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            About Me
          </h2>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left panel: Portrait / Graphic Frame */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--first-color)] to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10" />

              <div className="w-[280px] h-[350px] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--container-color)] group-hover:border-[var(--first-color)] transition-all duration-300 bg-gradient-to-br from-slate-800 to-slate-950">
                {/* Fallback Graphic / Loader in background */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none text-white z-0">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                    <span className="text-2xl font-bold text-[var(--first-color)]">
                      {biodata.fullName ? biodata.fullName.charAt(0) : 'P'}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-white">{biodata.fullName}</h4>
                  <p className="text-xs text-slate-400 mt-1">{biodata.title || 'Portfolio Owner'}</p>
                </div>

                {biodata.avatarUrl && (
                  <img
                    src={biodata.avatarUrl}
                    alt={biodata.fullName || 'Profile Picture'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Right panel: Content */}
          <motion.div
            className="lg:col-span-7 flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Horizontal bento grid items */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {aboutBoxes.map((box, index) => {
                const IconComponent = box.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-[var(--container-color)] p-4 sm:p-5 rounded-2xl border border-gray-200/5 hover:border-[var(--first-color)]/20 shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1 select-none"
                    whileHover={{ scale: 1.03 }}
                  >
                    <IconComponent size={24} className="text-[var(--first-color)] mb-2" />
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--title-color)]">
                      {box.title}
                    </h3>
                    <span className="text-[10px] sm:text-xs text-[var(--text-color-light)] mt-1">
                      {box.subtitle}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-sm sm:text-base text-[var(--text-color)] leading-relaxed mb-8 text-justify">
              {biodata.aboutMe}
            </p>

            <div className="flex justify-center sm:justify-start">
              <button
                onClick={() => handleScrollToSection('contact')}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-[var(--first-color)] to-indigo-500 text-[var(--body-color)] font-semibold shadow-md hover:shadow-blue-500/10 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
