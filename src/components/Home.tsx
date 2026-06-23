import { motion } from 'motion/react';
import { Linkedin, Instagram, MessageCircle, Mouse, ArrowDown } from 'lucide-react';
import { Biodata } from '../types';

export default function Home({ biodata }: { biodata?: Biodata }) {
  if (!biodata) return null;

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-24 pb-12 flex items-center relative overflow-hidden bg-gradient-to-b from-[var(--body-color)] via-[var(--body-color)] to-[var(--container-color)]"
    >
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Data */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-sm font-semibold tracking-wider text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full mb-4">
            {biodata.fullName}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--title-color)] mb-3 select-none">
            {biodata.shortName}
          </h1>
          <h3 className="text-lg sm:text-xl font-medium text-[var(--text-color)] mb-6">
            {biodata.title}
          </h3>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <a
              href={biodata.githubCV}
              download={biodata.cvFilename}
              className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[var(--first-color)] to-indigo-500 hover:to-[var(--first-color-alt)] text-[var(--body-color)] font-semibold shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-300"
            >
              Download CV
            </a>
            <button
              onClick={() => handleScrollToSection('about')}
              className="py-3.5 px-7 rounded-2xl border-2 border-[var(--first-color)] text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white font-semibold transition-all duration-300 cursor-pointer active:scale-95"
            >
              About Me
            </button>
          </div>

          {/* Mobile Social connects - beautifully arranged with modern pill shape buttons instead of floating absolute */}
          <div className="flex lg:hidden items-center gap-4 justify-center w-full mt-2">
            <a
              href={biodata.linkedin}
              target="_blank"
              className="p-3 bg-[var(--container-color)] rounded-xl border border-gray-200/10 text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow-md active:scale-95"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={biodata.instagramLink}
              target="_blank"
              className="p-3 bg-[var(--container-color)] rounded-xl border border-gray-200/10 text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow-md active:scale-95"
              title="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={biodata.whatsappLink}
              target="_blank"
              className="p-3 bg-[var(--container-color)] rounded-xl border border-gray-200/10 text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow-md active:scale-95"
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </motion.div>

        {/* Right column: Curved profile canvas */}
        <motion.div
          className="lg:col-span-5 flex justify-center order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="relative group">
            {/* Glowing background ring */}
            <div className="absolute inset-0 rounded-[10rem_10rem_1rem_1rem] bg-gradient-to-t from-[var(--first-color)] to-violet-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10" />

            {/* Profile Frame with extreme top rounded corners */}
            <div className="w-[190px] h-[260px] sm:w-[260px] sm:h-[360px] md:w-[280px] md:h-[390px] rounded-[10rem_10rem_1.5rem_1.5rem] bg-gradient-to-b from-[var(--first-color)] to-[var(--first-color-alt)] border-4 border-[var(--container-color)] shadow-2xl overflow-hidden flex items-end justify-center relative">
              {/* Profile Background Graphics */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              
              {/* Profile avatar fall-back / placeholder graphic with professional styling */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none z-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center mb-4">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">DT</span>
                </div>
                <h4 className="font-bold text-white text-md sm:text-lg">{biodata.shortName}</h4>
                <p className="text-xs text-white/80">IPB University Graduate</p>
              </div>

              {/* Real profile overlay image if available - otherwise loads placeholder elegantly */}
              <img
                src={biodata.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"}
                alt={biodata.fullName}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).style.display = 'none'; // hide gracefully on fail and show avatar graphics behind
                }}
                className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Left: Social Connects sidebar - Fixed, glassmorphic rail on desktop for premium aesthetics */}
      <motion.div
        className="hidden lg:flex flex-col items-center gap-5 fixed left-8 top-1/2 -translate-y-1/2 z-40 bg-[var(--container-color)]/70 backdrop-blur-md px-3.5 py-6 rounded-full border border-gray-200/10 shadow-2xl hover:border-[var(--first-color)]/20 transition-all duration-300"
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <a
          href={biodata.linkedin}
          target="_blank"
          className="p-3 bg-[var(--body-color)] rounded-full text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow hover:scale-110"
          title="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a
          href={biodata.instagramLink}
          target="_blank"
          className="p-3 bg-[var(--body-color)] rounded-full text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow hover:scale-110"
          title="Instagram"
        >
          <Instagram size={18} />
        </a>
        <a
          href={biodata.whatsappLink}
          target="_blank"
          className="p-3 bg-[var(--body-color)] rounded-full text-[var(--first-color)] hover:bg-[var(--first-color)] hover:text-white transition-all duration-300 shadow hover:scale-110"
          title="WhatsApp"
        >
          <MessageCircle size={18} />
        </a>

        {/* Vertical line indicator */}
        <div className="w-[1px] h-10 bg-gradient-to-b from-[var(--first-color)] to-transparent mt-1" />
      </motion.div>

      {/* Floating Right: Scroll Invitation Indicator */}
      <motion.button
        onClick={() => handleScrollToSection('about')}
        className="absolute right-6 bottom-16 flex-col items-center gap-2 text-[var(--first-color)] hover:opacity-80 transition-opacity duration-300 hidden lg:flex cursor-pointer border-none bg-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <span className="text-[11px] font-medium tracking-widest uppercase rotate-90 origin-right translate-x-[4px] mb-8 select-none">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <Mouse size={20} className="stroke-[1.5]" />
        </motion.div>
      </motion.button>
    </section>
  );
}
