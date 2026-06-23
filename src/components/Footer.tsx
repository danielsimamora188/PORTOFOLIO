import React from 'react';
import { Linkedin, Instagram, MessageCircle } from 'lucide-react';
import { Biodata } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  biodata?: Biodata;
}

export default function Footer({ onOpenAdmin, biodata }: FooterProps) {
  if (!biodata) return null;

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[var(--container-color)] border-t border-gray-200/5 py-12 pb-28 md:pb-12 text-center select-none relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Logo Title */}
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          {biodata.shortName}
        </h2>

        {/* Navigation Map */}
        <ul className="flex items-center justify-center flex-wrap gap-8 mb-8 text-sm font-medium">
          <li>
            <a
              href="#about"
              onClick={(e) => handleScrollToSection(e, 'about')}
              className="text-[var(--text-color-light)] hover:text-[var(--first-color)] transition-colors duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#services"
              onClick={(e) => handleScrollToSection(e, 'services')}
              className="text-[var(--text-color-light)] hover:text-[var(--first-color)] transition-colors duration-300"
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#work"
              onClick={(e) => handleScrollToSection(e, 'work')}
              className="text-[var(--text-color-light)] hover:text-[var(--first-color)] transition-colors duration-300"
            >
              Portfolio
            </a>
          </li>
          <li>
            <button
              onClick={onOpenAdmin}
              className="text-[var(--text-color-light)] hover:text-blue-500 transition-colors duration-300 text-sm font-medium cursor-pointer"
            >
              Admin Area
            </button>
          </li>
        </ul>

        {/* Social connections */}
        <div className="flex items-center justify-center gap-5 mb-8">
          <a
            href={biodata.linkedin}
            target="_blank"
            className="p-2 w-10 h-10 rounded-xl bg-[var(--body-color)] border border-gray-200/5 text-gray-400 hover:text-[var(--first-color)] hover:border-[var(--first-color)]/20 shadow-sm flex items-center justify-center transition-all duration-300"
            title="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={biodata.instagramLink}
            target="_blank"
            className="p-2 w-10 h-10 rounded-xl bg-[var(--body-color)] border border-gray-200/5 text-gray-400 hover:text-[var(--first-color)] hover:border-[var(--first-color)]/20 shadow-sm flex items-center justify-center transition-all duration-300"
            title="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href={biodata.whatsappLink}
            target="_blank"
            className="p-2 w-10 h-10 rounded-xl bg-[var(--body-color)] border border-gray-200/5 text-gray-400 hover:text-[var(--first-color)] hover:border-[var(--first-color)]/20 shadow-sm flex items-center justify-center transition-all duration-300"
            title="WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
        </div>

        {/* Copyright notice */}
        <span className="text-[11px] text-gray-500 block uppercase tracking-widest leading-6">
          &#169; {new Date().getFullYear()} {biodata.fullName}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
