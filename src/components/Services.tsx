import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code, 
  Video, 
  Palette, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  CornerDownRight,
  Sparkles,
  Megaphone,
  Briefcase,
  Layers,
  Layout,
  Camera
} from 'lucide-react';
import { Experience, ServiceItem } from '../types';
import { getExperiencesFromSupabase, getServicesFromSupabase } from '../supabaseService';

const iconMap: Record<string, any> = {
  code: Code,
  video: Video,
  palette: Palette,
  sparkles: Sparkles,
  megaphone: Megaphone,
  briefcase: Briefcase,
  layers: Layers,
  layout: Layout,
  camera: Camera
};

export default function Services() {
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const data = await getExperiencesFromSupabase();
        setExperiencesList(data || []);
      } catch (err) {
        console.error('Error loading experiences:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    async function fetchServices() {
      try {
        const data = await getServicesFromSupabase();
        setServicesList(data || []);
      } catch (err) {
        console.error('Error loading services:', err);
      } finally {
        setServicesLoading(false);
      }
    }

    fetchExperiences();
    fetchServices();

    const handleExperiencesChange = () => {
      fetchExperiences();
    };
    const handleServicesChange = () => {
      fetchServices();
    };

    window.addEventListener('experiences-changed', handleExperiencesChange);
    window.addEventListener('services-changed', handleServicesChange);

    return () => {
      window.removeEventListener('experiences-changed', handleExperiencesChange);
      window.removeEventListener('services-changed', handleServicesChange);
    };
  }, []);

  return (
    <section id="services" className="py-24 bg-[var(--body-color)] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Services Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full">
            What I Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            My Services
          </h2>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {servicesList.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={index}
                className={`bg-[var(--container-color)] p-8 rounded-3xl border border-gray-200/5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-start group relative text-left h-full ${
                  index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="p-4 bg-gradient-to-br from-[var(--first-color)]/20 to-indigo-500/5 rounded-2xl text-[var(--first-color)] mb-6 transition-all duration-300 group-hover:scale-110">
                  <IconComponent size={28} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[var(--title-color)] mb-4 select-none pr-8">
                  {service.title}
                </h3>

                <p className="text-sm text-[var(--text-color)] mb-8 flex-grow">
                  {service.description}
                </p>

                <button
                  onClick={() => setActiveModal(index)}
                  className="mt-auto py-2 px-4 rounded-xl text-xs font-semibold text-[var(--first-color)] hover:text-white hover:bg-[var(--first-color)] border border-[var(--first-color)]/20 hover:border-transparent transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  View More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Experience Timeline Segment (Industrial Internship Profile) */}
        <div className="border-t border-gray-200/5 pt-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-indigo-500/10 py-1.5 px-4 rounded-full">
              Industrial Path
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--title-color)] mt-3">
              Work Experience
            </h3>
            <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {experiencesList.map((exp, idx) => (
              <motion.div
                key={exp.id}
                className="bg-[var(--container-color)] p-6 sm:p-8 rounded-3xl border border-gray-200/5 shadow-lg relative flex flex-col justify-between h-full group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <span className="text-[11px] font-bold text-[var(--first-color)] px-2.5 py-1 rounded-full bg-blue-500/10 inline-block uppercase tracking-wider">
                      {exp.period}
                    </span>
                    {exp.imageUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-gray-200/5 shrink-0 flex items-center justify-center p-0.5">
                        <img 
                          src={exp.imageUrl} 
                          alt={exp.company} 
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => { 
                            (e.target as any).onerror = null; 
                            (e.target as any).style.display = 'none'; 
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-[var(--title-color)] mb-1">
                    {exp.role}
                  </h4>
                  <p className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
                    <span className="text-[var(--first-color)]">{exp.company}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="flex items-center gap-0.5"><MapPin size={10} /> {exp.location}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-[var(--text-color-light)] mb-5">
                    {exp.description}
                  </p>
                </div>

                <div className="border-t border-gray-200/5 pt-4">
                  <span className="text-xs font-semibold text-[var(--title-color)] block mb-2 uppercase tracking-wide">
                    Achievements:
                  </span>
                  <ul className="space-y-2.5">
                    {exp.details && exp.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs text-[var(--text-color)] flex items-start gap-1.5 leading-relaxed">
                        <CornerDownRight size={12} className="text-[var(--first-color)] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Popups / Modals */}
      <AnimatePresence>
        {activeModal !== null && servicesList[activeModal] && (
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Body */}
            <motion.div
              className="relative w-full max-w-lg bg-[var(--container-color)] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Close pin */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[var(--text-color-light)] hover:text-[var(--title-color)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b border-gray-200/5 pb-4 pr-10">
                <div className="p-3.5 bg-[var(--first-color)]/10 text-[var(--first-color)] rounded-2xl">
                  {(() => {
                    const ModalIcon = iconMap[servicesList[activeModal].icon] || Code;
                    return <ModalIcon size={24} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--title-color)]">
                    {servicesList[activeModal].title}
                  </h3>
                  <span className="text-[11px] text-[var(--first-color)] font-medium uppercase tracking-widest block mt-0.5">
                    Daniel Tulus Services
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-color)] mb-6 leading-relaxed">
                {servicesList[activeModal].description}
              </p>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[var(--title-color)] uppercase tracking-wider block">
                  Detail Pekerjaan:
                </span>
                <ul className="space-y-3">
                  {servicesList[activeModal].checklist && servicesList[activeModal].checklist.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-color)]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.1 }}
                    >
                      <CheckCircle2 size={16} className="text-[var(--first-color)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200/5 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-6 rounded-xl bg-[var(--first-color)] text-[var(--body-color)] font-semibold text-xs hover:bg-[var(--first-color-alt)] cursor-pointer transition-all active:scale-95"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
