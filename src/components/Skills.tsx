import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BadgeCheck } from 'lucide-react';
import { SkillCategory } from '../types';
import { getSkillsCategoriesFromSupabase } from '../supabaseService';

export default function Skills() {
  const [skillsList, setSkillsList] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkillsCategoriesFromSupabase();
        setSkillsList(data || []);
      } catch (err) {
        console.error('Error loading skills:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();

    const handleSkillsChange = () => {
      fetchSkills();
    };
    window.addEventListener('skills-changed', handleSkillsChange);
    return () => {
      window.removeEventListener('skills-changed', handleSkillsChange);
    };
  }, []);

  return (
    <section id="skills" className="py-24 bg-[var(--container-color)] relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full">
            My Abilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            My Skills
          </h2>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsList.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              className="bg-[var(--body-color)] p-6 sm:p-8 rounded-3xl border border-gray-200/5 shadow-xl hover:shadow-2xl hover:border-[var(--first-color)]/20 transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: catIdx * 0.15 }}
            >
              {/* Highlight background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--first-color)]/10 to-transparent rounded-bl-full group-hover:from-[var(--first-color)]/20 transition-colors duration-300" />

              <h3 className="text-lg sm:text-xl font-bold text-[var(--title-color)] mb-6 border-b border-gray-200/5 pb-3">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="flex gap-2.5 items-start select-none">
                    <BadgeCheck size={18} className="text-[var(--first-color)] shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-semibold text-[var(--title-color)] leading-tight">
                        {skill.name}
                      </span>
                      {skill.level && (
                        <span className="text-[10px] text-[var(--text-color-light)] font-medium mt-0.5">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
