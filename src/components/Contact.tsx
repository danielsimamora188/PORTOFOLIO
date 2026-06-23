import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageCircle, Instagram, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import { Biodata } from '../types';
import { addContactMessageInSupabase } from '../supabaseService';

export default function Contact({ biodata }: { biodata?: Biodata }) {
  if (!biodata) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const contactCards = [
    {
      icon: Mail,
      title: 'Email',
      value: biodata.email,
      link: `mailto:${biodata.email}`,
      actionText: 'Write me via email',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: biodata.whatsapp,
      link: biodata.whatsappLink,
      actionText: 'Message me on WhatsApp',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: biodata.instagram,
      link: biodata.instagramLink,
      actionText: 'DM on Instagram',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Harap isi semua kolom formulir!');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await addContactMessageInSupabase(name.trim(), email.trim(), message.trim());
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Dispatch event to refresh admin console on new inbox arrival if open
      window.dispatchEvent(new CustomEvent('messages-changed'));
      
      // Auto dismiss success state after 5s
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form messages:', error);
      setErrorMessage('Terjadi kesalahan saat mengirim pesan ke server database.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[var(--body-color)] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Contact Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[var(--first-color)] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--title-color)] mt-3">
            Contact Me
          </h2>
          <div className="w-12 h-1 bg-[var(--first-color)] mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          {/* Left Column: Cards */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-lg font-bold text-[var(--title-color)] text-center md:text-left mb-4 uppercase tracking-wider text-xs">
              Talk to Me
            </h3>

            {contactCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-[var(--container-color)] p-5 rounded-3xl border border-gray-200/5 shadow-md flex flex-col items-center text-center hover:border-[var(--first-color)]/20 transition-all duration-300 group hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="p-3 bg-[var(--first-color)]/10 text-[var(--first-color)] rounded-xl mb-3">
                    <IconComponent size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--title-color)] mb-1">
                    {card.title}
                  </h4>
                  <span className="text-xs text-[var(--text-color-light)] mb-3 select-all">
                    {card.value}
                  </span>
                  <a
                    href={card.link}
                    target="_blank"
                    className="text-xs font-semibold text-[var(--first-color)] group-hover:underline flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    {card.actionText} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-7">
            <h3 className="text-lg font-bold text-[var(--title-color)] text-center md:text-left mb-4 uppercase tracking-wider text-xs">
              Write Me Your Project
            </h3>

            <motion.div
              className="bg-[var(--container-color)] p-6 sm:p-8 rounded-3xl border border-gray-200/5 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring' }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4 animate-bounce">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-xl font-bold text-[var(--title-color)] mb-2">
                      Pesan Terkirim Sukses!
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--text-color-light)] max-w-xs leading-relaxed">
                      Terima kasih telah menghubungi. Pesan Anda telah disampaikan langsung ke email Daniel Tulus. Respons akan segera dikirim.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 py-2.5 px-6 rounded-xl bg-[var(--first-color)] text-[var(--body-color)] font-semibold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Error Alerts */}
                    {errorMessage && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center font-medium">
                        {errorMessage}
                      </div>
                    )}

                    {/* Input Name field */}
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-400 absolute top-2.5 left-4 uppercase tracking-widest pointer-events-none select-none">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama Anda..."
                        className="w-full pt-7 pb-2 px-4 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-[var(--first-color)]/50 focus:outline-none text-sm text-[var(--title-color)] placeholder-gray-500 transition-all shadow-inner"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-400 absolute top-2.5 left-4 uppercase tracking-widest pointer-events-none select-none">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email aktif..."
                        className="w-full pt-7 pb-2 px-4 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-[var(--first-color)]/50 focus:outline-none text-sm text-[var(--title-color)] placeholder-gray-500 transition-all shadow-inner"
                      />
                    </div>

                    {/* Project/Message Context */}
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-400 absolute top-2.5 left-4 uppercase tracking-widest pointer-events-none select-none">
                        Pesan Proyek
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Deskripsikan ide proyek Anda di sini..."
                        className="w-full pt-7 pb-3 px-4 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-[var(--first-color)]/50 focus:outline-none text-sm text-[var(--title-color)] placeholder-gray-500 transition-all shadow-inner resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`py-3 px-8 rounded-2xl bg-gradient-to-r from-[var(--first-color)] to-indigo-500 hover:to-[var(--first-color-alt)] text-[var(--body-color)] font-bold text-sm shadow-md hover:shadow-blue-500/10 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                          isSubmitting ? 'opacity-80 pointer-events-none' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--body-color)] animate-duration-100" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message <Send size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
