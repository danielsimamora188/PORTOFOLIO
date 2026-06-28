import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark,
  Headset,
  CreditCard,
  ShieldCheck,
  MessageSquare,
  Wallet,
  PiggyBank,
  Users,
  PhoneCall,
  Briefcase,
  MapPin,
  ArrowRight,
  X,
  CornerDownRight,
  CheckCircle2
} from 'lucide-react';
import { Experience, ServiceItem } from '../types';
import { getExperiencesFromSupabase, getServicesFromSupabase } from '../supabaseService';

const iconMap: Record<string, any> = {
  code: Landmark, // Replaced with Bank icon
  video: Headset, // Replaced with CS icon
  palette: CreditCard, // Replaced with Card icon
  sparkles: ShieldCheck, // Replaced with Security icon
  megaphone: MessageSquare, // Replaced with Chat/Comm icon
  briefcase: Wallet, // Replaced with Wallet
  layers: PiggyBank, // Replaced with Savings
  layout: Users, // Replaced with Customers icon
  camera: PhoneCall // Replaced with Call icon
};

export default function Services() {
  const [activeServiceModal, setActiveServiceModal] = useState<number | null>(null);
  const [activeExpModal, setActiveExpModal] = useState<number | null>(null);
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

    const handleExperiencesChange = () => fetchExperiences();
    const handleServicesChange = () => fetchServices();

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
        
        {/* ================= WORK EXPERIENCE SECTION ================= */}
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
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            Work Experience
          </h3>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {experiencesList.map((exp, idx) => (
            <motion.div
              key={exp.id}
              className={`bg-[var(--container-color)] p-8 rounded-3xl border border-gray-200/5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-start group relative text-left h-full ${
                idx === 2 && experiencesList.length === 3 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="w-full flex justify-between items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-[var(--first-color)]/10 rounded-2xl text-[var(--first-color)] transition-all duration-300 group-hover:scale-110">
                  {exp.imageUrl ? (
                    <img 
                      src={exp.imageUrl} 
                      alt={exp.company} 
                      className="w-7 h-7 object-contain rounded-md"
                      onError={(e) => { 
                        (e.target as any).onerror = null; 
                        (e.target as any).style.display = 'none'; 
                      }}
                    />
                  ) : (
                    <Briefcase size={28} />
                  )}
                </div>
                <span className="text-[10px] font-bold text-[var(--first-color)] px-2.5 py-1 rounded-full bg-blue-500/10 uppercase tracking-wider">
                  {exp.period}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[var(--title-color)] mb-2 pr-2">
                {exp.role}
              </h3>
              <p className="text-xs font-semibold text-gray-400 mb-4 flex items-center gap-1.5">
                <span className="text-[var(--first-color)]">{exp.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-0.5"><MapPin size={10} /> {exp.location}</span>
              </p>

              <p className="text-sm text-[var(--text-color)] mb-8 flex-grow">
                {exp.description}
              </p>

              <button
                onClick={() => setActiveExpModal(idx)}
                className="mt-auto py-2 px-4 rounded-xl text-xs font-semibold text-[var(--first-color)] hover:text-white hover:bg-[var(--first-color)] border border-[var(--first-color)]/20 hover:border-transparent transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ================= SERVICES SECTION ================= */}
        <div className="border-t border-gray-200/5 pt-20 mb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Headset;
              return (
                <motion.div
                  key={index}
                  className={`bg-[var(--container-color)] p-8 rounded-3xl border border-gray-200/5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-start group relative text-left h-full ${
                    index === 2 && servicesList.length === 3 ? 'md:col-span-2 lg:col-span-1' : ''
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
                    onClick={() => setActiveServiceModal(index)}
                    className="mt-auto py-2 px-4 rounded-xl text-xs font-semibold text-[var(--first-color)] hover:text-white hover:bg-[var(--first-color)] border border-[var(--first-color)]/20 hover:border-transparent transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    View More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Experience Modal */}
      <AnimatePresence>
        {activeExpModal !== null && experiencesList[activeExpModal] && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExpModal(null)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-[var(--container-color)] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <button
                onClick={() => setActiveExpModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[var(--text-color-light)] hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b border-gray-200/5 pb-4 pr-10">
                <div className="p-3.5 bg-indigo-500/10 text-[var(--first-color)] rounded-2xl">
                  {experiencesList[activeExpModal].imageUrl ? (
                    <img src={experiencesList[activeExpModal].imageUrl!} alt="Logo" className="w-6 h-6 object-contain" />
                  ) : (
                    <Briefcase size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--title-color)]">
                    {experiencesList[activeExpModal].role}
                  </h3>
                  <span className="text-[11px] text-[var(--first-color)] font-medium uppercase tracking-widest block mt-0.5">
                    {experiencesList[activeExpModal].company}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-color)] mb-6 leading-relaxed">
                {experiencesList[activeExpModal].description}
              </p>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[var(--title-color)] uppercase tracking-wider block">
                  Achievements & Details:
                </span>
                <ul className="space-y-3">
                  {experiencesList[activeExpModal].details && experiencesList[activeExpModal].details.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-color)]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.1 }}
                    >
                      <CornerDownRight size={16} className="text-[var(--first-color)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200/5 flex justify-end">
                <button
                  onClick={() => setActiveExpModal(null)}
                  className="py-2.5 px-6 rounded-xl bg-[var(--first-color)] text-[var(--body-color)] font-semibold text-xs hover:bg-[var(--first-color-alt)] cursor-pointer transition-all active:scale-95"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Services Modal */}
      <AnimatePresence>
        {activeServiceModal !== null && servicesList[activeServiceModal] && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveServiceModal(null)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-[var(--container-color)] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <button
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[var(--text-color-light)] hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b border-gray-200/5 pb-4 pr-10">
                <div className="p-3.5 bg-[var(--first-color)]/10 text-[var(--first-color)] rounded-2xl">
                  {(() => {
                    const ModalIcon = iconMap[servicesList[activeServiceModal].icon] || Headset;
                    return <ModalIcon size={24} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--title-color)]">
                    {servicesList[activeServiceModal].title}
                  </h3>
                  <span className="text-[11px] text-[var(--first-color)] font-medium uppercase tracking-widest block mt-0.5">
                    Daniel Tulus Services
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-color)] mb-6 leading-relaxed">
                {servicesList[activeServiceModal].description}
              </p>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[var(--title-color)] uppercase tracking-wider block">
                  Detail Pekerjaan:
                </span>
                <ul className="space-y-3">
                  {servicesList[activeServiceModal].checklist && servicesList[activeServiceModal].checklist.map((item, index) => (
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
                  onClick={() => setActiveServiceModal(null)}
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
