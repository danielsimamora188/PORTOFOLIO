import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { getBiodataFromSupabase } from './supabaseService';
import { Biodata } from './types';

export default function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [biodata, setBiodata] = useState<Biodata | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchBiodata = async () => {
    try {
      const data = await getBiodataFromSupabase();
      if (data) {
        setBiodata(data);
      }
    } catch (e) {
      console.error('Error loading dynamic biodata:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiodata();
    window.addEventListener('biodata-changed', fetchBiodata);
    return () => {
      window.removeEventListener('biodata-changed', fetchBiodata);
    };
  }, []);

  // Dynamically manage standard colors to reflect light/dark mode perfectly
  useEffect(() => {
    const root = document.documentElement;
    if (isLightTheme) {
      root.style.setProperty('--body-color', 'hsl(219, 100%, 99%)');
      root.style.setProperty('--container-color', '#ffffff');
      root.style.setProperty('--title-color', 'hsl(219, 15%, 15%)');
      root.style.setProperty('--text-color', 'hsl(219, 8%, 35%)');
      root.style.setProperty('--text-color-light', 'hsl(219, 8%, 55%)');
      root.style.setProperty('--first-color', 'hsl(207, 90%, 60%)');
      root.style.setProperty('--first-color-alt', 'hsl(207, 90%, 50%)');
    } else {
      root.style.setProperty('--body-color', 'hsl(219, 48%, 8%)');
      root.style.setProperty('--container-color', 'hsl(219, 32%, 12%)');
      root.style.setProperty('--title-color', 'hsl(219, 15%, 95%)');
      root.style.setProperty('--text-color', 'hsl(219, 8%, 75%)');
      root.style.setProperty('--text-color-light', 'hsl(219, 8%, 55%)');
      root.style.setProperty('--first-color', 'hsl(207, 90%, 72%)');
      root.style.setProperty('--first-color-alt', 'hsl(207, 90%, 64%)');
    }
  }, [isLightTheme]);

  // High-performance scroll tracking to adjust active section states
  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'services', 'work', 'contact'];

    const handleScroll = () => {
      const scrollY = window.scrollY + 300; // Offset checking to highlight active navigation

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger instantly
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b111e] text-white font-sans">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full mb-6"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-lg font-bold tracking-widest uppercase mb-1">Loading Portfolio</h2>
          <p className="text-xs text-gray-400">Connecting to database...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-[var(--text-color)] bg-[var(--body-color)] transition-colors duration-300">
      {/* Dynamic theme style overrides */}
      <style>{`
        :root {
          --first-hue: 207;
          --sat: 90%;
          --lig: 72%;
        }
        
        /* Custom scrollbar alignment */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--body-color);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--first-color);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--first-color-alt);
        }
        
        .bg-grid-pattern {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
      `}</style>

      {/* Header section with theme control and status signals */}
      <Header
        isLightTheme={isLightTheme}
        setIsLightTheme={setIsLightTheme}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        biodata={biodata}
      />

      {/* Main Container Layout */}
      <main className="w-full">
        <Home biodata={biodata} />
        <About biodata={biodata} />
        <Skills />
        <Services />
        <Work />
        <Contact biodata={biodata} />
      </main>

      {/* Base Page Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} biodata={biodata} />

      {/* Admin Panel Gate Overlay */}
      {isAdminOpen && (
        <AdminPanel
          isLightTheme={isLightTheme}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
