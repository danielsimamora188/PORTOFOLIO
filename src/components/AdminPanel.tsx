import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  FolderLock, 
  ExternalLink, 
  Database,
  Inbox, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  X, 
  FileText, 
  Save, 
  RefreshCw,
  Clock,
  Briefcase,
  MailOpen,
  GraduationCap,
  Upload
} from 'lucide-react';
import { Project, Experience, Biodata, ServiceItem, SkillCategory, Skill, ContactMessage } from '../types';
import { 
  getProjectsFromSupabase as getProjects, 
  addProjectInSupabase as addProjectInFirestore, 
  updateProjectInSupabase as updateProjectInFirestore, 
  deleteProjectFromSupabase as deleteProjectFromFirestore,
  getContactMessagesFromSupabase as getContactMessages,
  deleteMessageFromSupabase as deleteMessageFromFirestore,
  updateMessageStatusInSupabase as updateMessageStatus,
  getExperiencesFromSupabase as getExperiences,
  addExperienceInSupabase as addExperienceInFirestore,
  updateExperienceInSupabase as updateExperienceInFirestore,
  deleteExperienceFromSupabase as deleteExperienceFromFirestore,
  getBiodataFromSupabase as getBiodataFromFirestore,
  updateBiodataInSupabase as updateBiodataInFirestore,
  getServicesFromSupabase as getServices,
  addServiceInSupabase as addServiceInFirestore,
  updateServiceInSupabase as updateServiceInFirestore,
  deleteServiceFromSupabase as deleteServiceFromFirestore,
  getSkillsCategoriesFromSupabase as getSkillsCategories,
  addSkillCategoryInSupabase as addSkillCategoryInFirestore,
  updateSkillCategoryInSupabase as updateSkillCategoryInFirestore,
  deleteSkillCategoryFromSupabase as deleteSkillCategoryFromFirestore
} from '../supabaseService';

interface AdminPanelProps {
  onClose: () => void;
  isLightTheme: boolean;
}

const PRESET_EMAIL = 'daniel.admin@gmail.com';
const PRESET_PASSWORD = 'danieladmin123';

export default function AdminPanel({ onClose, isLightTheme }: AdminPanelProps) {
  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'experiences' | 'biodata' | 'services' | 'skills'>('projects');

  // Firestore Projects dynamic data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Firestore experiences dynamic data state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);

  // Firestore contact messages dynamic data state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Biodata form & management states
  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [biodataLoading, setBiodataLoading] = useState(false);
  const [isUpdatingBiodata, setIsUpdatingBiodata] = useState(false);
  const [biodataSuccessMsg, setBiodataSuccessMsg] = useState('');
  const [biodataErrorMsg, setBiodataErrorMsg] = useState('');

  const [bioForm, setBioForm] = useState<Biodata>({
    fullName: '',
    shortName: '',
    title: '',
    email: '',
    whatsapp: '',
    whatsappLink: '',
    instagram: '',
    instagramLink: '',
    linkedin: '',
    githubCV: '',
    cvFilename: '',
    aboutMe: '',
    experienceYears: '',
    projectsCompletedCount: '',
    supportAvailability: '',
  });

  // Modal forms states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [selectedDetailMsg, setSelectedDetailMsg] = useState<ContactMessage | null>(null);

  // New/Edit Project Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'web' | 'photography' | 'design' | 'certificate'>('web');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formButtonLink, setFormButtonLink] = useState('');

  // New/Edit Experience Form Fields
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expDetails, setExpDetails] = useState(''); // Newline separated achievements
  const [expImageUrl, setExpImageUrl] = useState('');

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setActionErrorMsg('Ukuran file gambar terlalu besar (maksimal 2MB).');
        return;
      }
      setActionErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExperienceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setActionErrorMsg('Ukuran file logo terlalu besar (maksimal 2MB).');
        return;
      }
      setActionErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setExpImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBiodataErrorMsg('Ukuran file foto profil terlalu besar (maksimal 2MB).');
        return;
      }
      setBiodataErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setBioForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Service management states
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [servicesCountLoading, setServicesCountLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvTitle, setSrvTitle] = useState('');
  const [srvDescription, setSrvDescription] = useState('');
  const [srvIcon, setSrvIcon] = useState('code');
  const [srvChecklist, setSrvChecklist] = useState(''); // Newline separated list

  // Skill management states
  const [skillsCategories, setSkillsCategories] = useState<SkillCategory[]>([]);
  const [skillsCountLoading, setSkillsCountLoading] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillCategoryId, setEditingSkillCategoryId] = useState<string | null>(null);
  const [skCatTitle, setSkCatTitle] = useState('');
  const [skSkillsList, setSkSkillsList] = useState<Skill[]>([]);
  
  const [tempSkillName, setTempSkillName] = useState('');
  const [tempSkillLevel, setTempSkillLevel] = useState<'Advanced' | 'Intermediate' | 'Basic' | ''>('');

  // Status messages
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'project' | 'message' | 'experience' | 'service' | 'skillCategory'; title: string } | null>(null);

  // Load projects and inbox messages on mount
  useEffect(() => {
    // Attempt local auto login session
    const savedSession = localStorage.getItem('daniel_admin_logged');
    if (savedSession === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadProjectsData();
      loadMessagesData();
      loadExperiencesData();
      loadBiodataData();
      loadServicesData();
      loadSkillsData();
    }
  }, [isLoggedIn]);

  // Dynamic message, services, skills changes listener
  useEffect(() => {
    const handleMessagesChange = () => {
      if (isLoggedIn) loadMessagesData();
    };
    const handleServicesChange = () => {
      if (isLoggedIn) loadServicesData();
    };
    const handleSkillsChange = () => {
      if (isLoggedIn) loadSkillsData();
    };
    window.addEventListener('messages-changed', handleMessagesChange);
    window.addEventListener('services-changed', handleServicesChange);
    window.addEventListener('skills-changed', handleSkillsChange);
    return () => {
      window.removeEventListener('messages-changed', handleMessagesChange);
      window.removeEventListener('services-changed', handleServicesChange);
      window.removeEventListener('skills-changed', handleSkillsChange);
    };
  }, [isLoggedIn]);

  const loadProjectsData = async () => {
    setProjectsLoading(true);
    try {
      const projs = await getProjects();
      setProjects(projs);
    } catch (err) {
      console.error(err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadExperiencesData = async () => {
    setExperiencesLoading(true);
    try {
      const exps = await getExperiences();
      setExperiences(exps);
    } catch (err) {
      console.error(err);
    } finally {
      setExperiencesLoading(false);
    }
  };

  const loadMessagesData = async () => {
    setMessagesLoading(true);
    try {
      const msgs = await getContactMessages();
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadBiodataData = async () => {
    setBiodataLoading(true);
    setBiodataErrorMsg('');
    try {
      const bio = await getBiodataFromFirestore();
      if (bio) {
        setBiodata(bio);
        setBioForm(bio);
      }
    } catch (err) {
      console.error(err);
      setBiodataErrorMsg('Gagal memuat data biodata dari database.');
    } finally {
      setBiodataLoading(false);
    }
  };

  const loadServicesData = async () => {
    setServicesCountLoading(true);
    try {
      const srvs = await getServices();
      setServicesList(srvs);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setServicesCountLoading(false);
    }
  };

  const loadSkillsData = async () => {
    setSkillsCountLoading(true);
    try {
      const sks = await getSkillsCategories();
      setSkillsCategories(sks);
    } catch (err) {
      console.error('Error loading skills:', err);
    } finally {
      setSkillsCountLoading(false);
    }
  };

  const handleBiodataUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingBiodata(true);
    setBiodataSuccessMsg('');
    setBiodataErrorMsg('');
    try {
      await updateBiodataInFirestore(bioForm);
      setBiodata(bioForm);
      setBiodataSuccessMsg('Biodata berhasil disimpan ke database!');
      window.dispatchEvent(new CustomEvent('biodata-changed'));
      setTimeout(() => {
        setBiodataSuccessMsg('');
      }, 4000);
    } catch (err) {
      console.error(err);
      setBiodataErrorMsg(`Gagal menyimpan biodata: ${(err as any)?.message || String(err)}`);
    } finally {
      setIsUpdatingBiodata(false);
    }
  };

  // Handle preset Admin Login verify
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === PRESET_EMAIL && password === PRESET_PASSWORD) {
        setIsLoggedIn(true);
        localStorage.setItem('daniel_admin_logged', 'true');
      } else {
        setLoginError('Kredensial salah! Silakan gunakan email & password preset admin.');
      }
      setAuthLoading(false);
    }, 800);
  };

  // Handle Logout process
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('daniel_admin_logged');
    setEmail('');
    setPassword('');
  };

  // Delete message handler
  const handleDeleteMessage = (msgId: string, name: string) => {
    setDeleteConfirm({ id: msgId, type: 'message', title: name });
  };

  // Toggle Read Message state
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    try {
      const newStatus = msg.status === 'read' ? 'unread' : 'read';
      await updateMessageStatus(msg.id, newStatus);
      loadMessagesData();
      if (selectedDetailMsg?.id === msg.id) {
        setSelectedDetailMsg(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open product modal for editing/creation
  const openProjectModal = (mode: 'create' | 'edit', project?: Project) => {
    setModalMode(mode);
    setEditingProjectId(project?.id || null);
    
    setFormTitle(project?.title || '');
    setFormCategory(project?.category || 'web');
    setFormDescription(project?.description || '');
    setFormImageUrl(project?.imageUrl || '');
    setFormButtonLink(project?.buttonLink || '');

    setIsProjectModalOpen(true);
  };

  // Save Project Action handler
  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setActionErrorMsg('Judul dan Deskripsi tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    setActionErrorMsg('');
    setActionSuccessMsg('');

    try {
      const pData = {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        buttonLink: formButtonLink.trim()
      };

      if (modalMode === 'create') {
        const newId = await addProjectInFirestore(pData);
        showTemporarySuccess(`Project "${formTitle}" sukses didaftarkan.`);
      } else if (modalMode === 'edit' && editingProjectId) {
        await updateProjectInFirestore(editingProjectId, pData);
        showTemporarySuccess(`Project "${formTitle}" berhasil diedit.`);
      }

      setIsProjectModalOpen(false);
      loadProjectsData();
      
      // Dispatch custom action so portfolio automatically updates in the background
      window.dispatchEvent(new CustomEvent('portfolio-changed'));
    } catch (err) {
      console.error(err);
      setActionErrorMsg(`Gagal menyimpan project: ${(err as any)?.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Services & Skills modal opening and helper handlers
  const handleOpenServiceModal = (srv: ServiceItem | null = null) => {
    setActionErrorMsg('');
    setActionSuccessMsg('');
    if (srv) {
      setModalMode('edit');
      setEditingServiceId(srv.id || null);
      setSrvTitle(srv.title);
      setSrvDescription(srv.description);
      setSrvIcon(srv.icon);
      setSrvChecklist(srv.checklist.join('\n'));
    } else {
      setModalMode('create');
      setEditingServiceId(null);
      setSrvTitle('');
      setSrvDescription('');
      setSrvIcon('code');
      setSrvChecklist('');
    }
    setIsServiceModalOpen(true);
  };

  const handleOpenSkillModal = (cat: SkillCategory | null = null) => {
    setActionErrorMsg('');
    setActionSuccessMsg('');
    if (cat) {
      setModalMode('edit');
      setEditingSkillCategoryId(cat.id || null);
      setSkCatTitle(cat.title);
      setSkSkillsList([...cat.skills]);
    } else {
      setModalMode('create');
      setEditingSkillCategoryId(null);
      setSkCatTitle('');
      setSkSkillsList([]);
    }
    setIsSkillModalOpen(true);
    setTempSkillName('');
    setTempSkillLevel('');
  };

  const handleAddTempSkill = () => {
    if (!tempSkillName.trim() || !tempSkillLevel) return;
    setSkSkillsList([...skSkillsList, { name: tempSkillName.trim(), level: tempSkillLevel }]);
    setTempSkillName('');
    setTempSkillLevel('');
  };

  const handleRemoveTempSkill = (idx: number) => {
    setSkSkillsList(skSkillsList.filter((_, i) => i !== idx));
  };

  // Experience form modal opening and submission handlers
  const handleOpenExperienceModal = (experience?: Experience) => {
    setActionErrorMsg('');
    setActionSuccessMsg('');
    setModalMode(experience ? 'edit' : 'create');
    setEditingExperienceId(experience?.id || null);
    
    setExpCompany(experience?.company || '');
    setExpLocation(experience?.location || '');
    setExpRole(experience?.role || '');
    setExpPeriod(experience?.period || '');
    setExpDescription(experience?.description || '');
    setExpDetails(experience?.details ? experience.details.join('\n') : '');
    setExpImageUrl(experience?.imageUrl || '');

    setIsExperienceModalOpen(true);
  };

  const handleSaveExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany.trim() || !expRole.trim() || !expPeriod.trim()) {
      setActionErrorMsg('Nama Perusahaan, Jabatan/Role, dan Periode Kerja wajib diisi.');
      return;
    }

    setIsSaving(true);
    setActionErrorMsg('');
    setActionSuccessMsg('');

    try {
      const detailsArray = expDetails
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length > 0);

      const eData = {
        company: expCompany.trim(),
        location: expLocation.trim(),
        role: expRole.trim(),
        period: expPeriod.trim(),
        description: expDescription.trim(),
        details: detailsArray,
        imageUrl: expImageUrl.trim()
      };

      if (modalMode === 'create') {
        await addExperienceInFirestore(eData);
        showTemporarySuccess(`Pengalaman kerja di "${expCompany}" sukses didaftarkan.`);
      } else if (modalMode === 'edit' && editingExperienceId) {
        await updateExperienceInFirestore(editingExperienceId, eData);
        showTemporarySuccess(`Pengalaman kerja di "${expCompany}" berhasil diedit.`);
      }

      setIsExperienceModalOpen(false);
      loadExperiencesData();
      
      // Dispatch custom event to sync with services list dynamically
      window.dispatchEvent(new CustomEvent('experiences-changed'));
    } catch (err) {
      console.error(err);
      setActionErrorMsg(`Gagal menyimpan pengalaman kerja: ${(err as any)?.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Project Delete Action handler
  const handleDeleteProject = (id: string, title: string) => {
    setDeleteConfirm({ id, type: 'project', title });
  };

  // Experience Delete Action handler
  const handleDeleteExperience = (id: string, role: string, company: string) => {
    setDeleteConfirm({ id, type: 'experience', title: `${role} di ${company}` });
  };

  // Service Delete Action handler
  const handleDeleteService = (id: string, title: string) => {
    setDeleteConfirm({ id, type: 'service', title });
  };

  // Skill Category Delete Action handler
  const handleDeleteSkillCategory = (id: string, title: string) => {
    setDeleteConfirm({ id, type: 'skillCategory', title });
  };

  // Service Submission handler
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setActionErrorMsg('');
    setActionSuccessMsg('');
    try {
      const checklistArray = srvChecklist
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length > 0);

      const serviceObj = {
        title: srvTitle,
        description: srvDescription,
        icon: srvIcon,
        checklist: checklistArray
      };

      if (modalMode === 'edit' && editingServiceId) {
        await updateServiceInFirestore(editingServiceId, serviceObj);
        showTemporarySuccess('Layanan berhasil diperbarui!');
      } else {
        await addServiceInFirestore(serviceObj);
        showTemporarySuccess('Layanan baru berhasil ditambahkan!');
      }
      setIsServiceModalOpen(false);
      loadServicesData();
      window.dispatchEvent(new CustomEvent('services-changed'));
    } catch (err) {
      console.error(err);
      setActionErrorMsg(`Gagal menyimpan detail layanan: ${(err as any)?.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Skill Category Submission handler
  const handleSkillCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setActionErrorMsg('');
    setActionSuccessMsg('');
    try {
      const categoryObj = {
        title: skCatTitle,
        skills: skSkillsList
      };

      if (modalMode === 'edit' && editingSkillCategoryId) {
        await updateSkillCategoryInFirestore(editingSkillCategoryId, categoryObj);
        showTemporarySuccess('Kategori keahlian berhasil diperbarui!');
      } else {
        await addSkillCategoryInFirestore(categoryObj);
        showTemporarySuccess('Kategori keahlian baru berhasil ditambahkan!');
      }
      setIsSkillModalOpen(false);
      loadSkillsData();
      window.dispatchEvent(new CustomEvent('skills-changed'));
    } catch (err) {
      console.error(err);
      setActionErrorMsg(`Gagal menyimpan kategori keahlian: ${(err as any)?.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Perform the actual deletion after custom modal confirmation
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'project') {
        await deleteProjectFromFirestore(deleteConfirm.id);
        showTemporarySuccess(`Project "${deleteConfirm.title}" berhasil dihapus.`);
        loadProjectsData();
        window.dispatchEvent(new CustomEvent('portfolio-changed'));
      } else if (deleteConfirm.type === 'experience') {
        await deleteExperienceFromFirestore(deleteConfirm.id);
        showTemporarySuccess(`Pengalaman kerja "${deleteConfirm.title}" berhasil dihapus.`);
        loadExperiencesData();
        window.dispatchEvent(new CustomEvent('experiences-changed'));
      } else if (deleteConfirm.type === 'service') {
        await deleteServiceFromFirestore(deleteConfirm.id);
        showTemporarySuccess(`Layanan "${deleteConfirm.title}" berhasil dihapus.`);
        loadServicesData();
        window.dispatchEvent(new CustomEvent('services-changed'));
      } else if (deleteConfirm.type === 'skillCategory') {
        await deleteSkillCategoryFromFirestore(deleteConfirm.id);
        showTemporarySuccess(`Kategori keahlian "${deleteConfirm.title}" berhasil dihapus.`);
        loadSkillsData();
        window.dispatchEvent(new CustomEvent('skills-changed'));
      } else {
        await deleteMessageFromFirestore(deleteConfirm.id);
        showTemporarySuccess('Pesan inbox berhasil dihapus dari database.');
        loadMessagesData();
        if (selectedDetailMsg?.id === deleteConfirm.id) {
          setSelectedDetailMsg(null);
        }
      }
    } catch (err) {
      setActionErrorMsg(`Gagal menghapus ${
        deleteConfirm.type === 'project' 
          ? 'proyek' 
          : deleteConfirm.type === 'experience' 
            ? 'pengalaman kerja' 
            : deleteConfirm.type === 'service'
              ? 'layanan'
              : deleteConfirm.type === 'skillCategory'
                ? 'kategori keahlian'
                : 'pesan'
      }.`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const showTemporarySuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => {
      setActionSuccessMsg('');
    }, 4500);
  };

  return (
    <div className="fixed inset-0 min-h-screen z-[999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl transition-all duration-300">
      <div 
        className={`w-full max-w-5xl rounded-3xl shadow-2xl border flex flex-col overflow-hidden max-h-[92vh] ${
          isLightTheme 
            ? 'bg-neutral-50 border-neutral-200 text-neutral-800' 
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        
        {/* Banner header bar */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <FolderLock size={22} className="text-blue-100" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Daniel Tulus</h1>
              <p className="text-[10px] text-blue-100/80 font-semibold tracking-wider uppercase">Portal Database & Admin Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Close Admin Portal"
          >
            <X size={18} />
          </button>
        </div>

        {/* LOGIN GATE SCREEN */}
        {!isLoggedIn ? (
          <div className="flex-grow p-8 sm:p-12 flex flex-col justify-center items-center">
            <motion.div 
              className={`w-full max-w-md p-8 rounded-3xl border shadow-xl ${
                isLightTheme ? 'bg-white border-neutral-200' : 'bg-slate-950/40 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock size={28} />
                </div>
                <h2 className="text-xl font-bold">Admin Sign In Required</h2>
                <p className="text-xs text-[var(--text-color-light)] mt-1.5">Masuk untuk mengelola data works & inbox pesan.</p>
              </div>

              {/* Preset credentials cue for demo purpose */}
              <div className="p-3.5 mb-6 rounded-xl text-[11px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
                <span className="font-bold underline block mb-1">Demo Admin Credentials:</span>
                <div>Email: {PRESET_EMAIL}</div>
                <div>Pass: {PRESET_PASSWORD}</div>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400/90 font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-gray-200/15 focus:border-blue-500/50 focus:outline-none text-xs"
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-gray-200/15 focus:border-blue-500/50 focus:outline-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold font-semibold cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {authLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>Sign In <Sparkles size={14} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          
          /* REGISTERED ADMIN PANEL INTERFACE */
          <div className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Sidebar navigation */}
            <div className={`w-full md:w-[220px] p-2 md:p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r gap-1 md:gap-2 select-none shrink-0 scrollbar-none flex-nowrap ${
              isLightTheme ? 'bg-neutral-100 border-neutral-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="hidden md:block px-3 py-1 text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Menu</div>
              
              <button
                onClick={() => setActiveTab('projects')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer ${
                  activeTab === 'projects' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <Database size={14} className="md:w-[15px] md:h-[15px]" />
                Portfolio Works
              </button>

              <button
                onClick={() => setActiveTab('experiences')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer ${
                  activeTab === 'experiences' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <Briefcase size={14} className="md:w-[15px] md:h-[15px]" />
                Pengalaman Kerja
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center justify-between gap-2.5 md:gap-3 transition-all cursor-pointer ${
                  activeTab === 'messages' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Inbox size={14} className="md:w-[15px] md:h-[15px]" />
                  Inbox Pesan
                </div>
                {messages.filter(m => m.status === 'unread').length > 0 && (
                  <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    {messages.filter(m => m.status === 'unread').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('biodata')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer ${
                  activeTab === 'biodata' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <User size={14} className="md:w-[15px] md:h-[15px]" />
                <span>Biodata Saya</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer ${
                  activeTab === 'services' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <Sparkles size={14} className="md:w-[15px] md:h-[15px]" />
                <span>My Services</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`shrink-0 md:w-full py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer ${
                  activeTab === 'skills' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-[var(--text-color-light)] hover:bg-indigo-500/5 hover:text-blue-500'
                }`}
              >
                <GraduationCap size={14} className="md:w-[15px] md:h-[15px]" />
                <span>My Skills</span>
              </button>

              <div className="flex-grow hidden md:block" />

              <button
                onClick={handleLogout}
                className="shrink-0 md:w-full md:mt-4 py-2 px-2.5 md:p-3 rounded-lg md:rounded-xl text-left text-[11px] md:text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 md:gap-2 transition-all cursor-pointer"
              >
                <LogOut size={14} className="md:w-[15px] md:h-[15px]" />
                Sign Out / Exit
              </button>
            </div>

            {/* Sub-Contents Area */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto flex flex-col">
              
              {actionSuccessMsg && (
                <div className="p-3.5 mb-4 rounded-2xl text-xs bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 font-semibold flex items-center gap-2 animate-fadeIn select-all">
                  <CheckCircle2 size={16} className="shrink-0" />
                  {actionSuccessMsg}
                </div>
              )}

              {actionErrorMsg && (
                <div className="p-3.5 mb-4 rounded-2xl text-xs bg-red-500/15 border border-red-500/25 text-red-400 font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={16} className="shrink-0 transform rotate-45" />
                  {actionErrorMsg}
                </div>
              )}

              {/* TAB 1: WORK PORTFOLIO MANAGER */}
              {activeTab === 'projects' && (
                <div className="flex-grow flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" /> 
                        Kelola Portfolio Works
                      </h2>
                      <p className="text-xs text-[var(--text-color-light)] mt-1">Buat, modifikasi, dan hapus proyek portfolio yang tersimpan di Firestore.</p>
                    </div>
                    <button
                      onClick={() => openProjectModal('create')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <Plus size={16} />
                      Tambah Karya Baru
                    </button>
                  </div>

                  {projectsLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-semibold">Mengambil data dari Firestore...</span>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200/10 rounded-3xl p-8">
                      <Database size={40} className="mx-auto text-gray-500 mb-3" />
                      <h3 className="text-sm font-bold">Database Web Kosong</h3>
                      <p className="text-xs text-[var(--text-color-light)] max-w-sm mx-auto mt-2 leading-relaxed">
                        Tidak ada project ditemukan. Anda bisa merefresh atau menekan tombol Tambah Karya Baru di atas.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-200/5 shadow-md">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b border-gray-200/5 font-bold uppercase tracking-wider text-[10px] ${
                            isLightTheme ? 'bg-neutral-100 text-neutral-600' : 'bg-slate-950/60 text-slate-400'
                          }`}>
                            <th className="py-4 px-5">Nama Karya</th>
                            <th className="py-4 px-4">Kategori</th>
                            <th className="py-4 px-4 hidden md:table-cell">Deskripsi</th>
                            <th className="py-4 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((proj) => (
                            <tr key={proj.id} className={`border-b border-gray-200/5 hover:bg-indigo-500/[0.02] last:border-0 ${
                              isLightTheme ? 'hover:bg-neutral-100/50' : 'hover:bg-slate-950/20'
                            }`}>
                              <td className="py-4 px-5 font-bold text-[var(--title-color)]">
                                <span className="block">{proj.title}</span>
                                {proj.buttonLink && (
                                  <a 
                                    href={proj.buttonLink} 
                                    target="_blank" 
                                    className="text-[10px] text-blue-500 font-semibold flex items-center gap-1 mt-1 hover:underline w-fit"
                                  >
                                    View link <ExternalLink size={10} />
                                  </a>
                                )}
                              </td>
                              <td className="py-4 px-4 select-none">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  proj.category === 'web' ? 'bg-blue-500/10 text-blue-500' :
                                  proj.category === 'photography' ? 'bg-emerald-500/10 text-emerald-500' :
                                  proj.category === 'design' ? 'bg-fuchsia-500/10 text-fuchsia-500' :
                                  'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {proj.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-400 max-w-xs truncate hidden md:table-cell">
                                {proj.description}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button
                                    onClick={() => openProjectModal('edit', proj)}
                                    className="p-2 rounded-xl border border-gray-200/10 text-gray-400 hover:text-blue-500 hover:border-blue-500/20 transition-all cursor-pointer"
                                    title="Edit data"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                                    className="p-2 rounded-xl border border-gray-200/10 text-gray-400 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                                    title="Hapus data"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WORK EXPERIENCE MANAGER */}
              {activeTab === 'experiences' && (
                <div className="flex-grow flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" /> 
                        Kelola Pengalaman Kerja
                      </h2>
                      <p className="text-xs text-[var(--text-color-light)] mt-1">Buat, modifikasi, dan hapus riwayat pengalaman kerja yang tersimpan di Firestore.</p>
                    </div>
                    <button
                      onClick={() => handleOpenExperienceModal()}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <Plus size={16} />
                      Tambah Pengalaman
                    </button>
                  </div>

                  {experiencesLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-mono tracking-wider">Retrieving cloud experiences datastore...</span>
                    </div>
                  ) : experiences.length === 0 ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 text-center gap-3">
                      <Briefcase size={40} className="text-gray-600 animate-bounce" />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--title-color)]">No Experiences Logged</h4>
                        <p className="text-xs text-[var(--text-color-light)] mt-1">Database kosong. Daftarkan pengalaman kerja Anda yang pertama.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200/5 shadow-inner">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                            isLightTheme ? 'bg-neutral-50/50 text-neutral-500 border-neutral-100' : 'bg-slate-900/30 text-gray-400 border-slate-800'
                          }`}>
                            <th className="py-3.5 px-4.5">Perusahaan</th>
                            <th className="py-3.5 px-4.5">Role / Jabatan</th>
                            <th className="py-3.5 px-4.5">Periode</th>
                            <th className="py-3.5 px-4.5">Lokasi</th>
                            <th className="py-3.5 px-4.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/5 text-xs">
                          {experiences.map((exp) => (
                            <tr 
                              key={exp.id} 
                              className={`transition-colors duration-150 ${
                                isLightTheme ? 'hover:bg-neutral-100/50' : 'hover:bg-slate-900/25'
                              }`}
                            >
                              <td className="py-4.5 px-4.5">
                                <div className="flex items-center gap-2">
                                  {exp.imageUrl ? (
                                    <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-950/25 border border-gray-200/5 shrink-0 flex items-center justify-center p-0.5">
                                      <img 
                                        src={exp.imageUrl} 
                                        alt={exp.company} 
                                        className="w-full h-full object-contain rounded"
                                        onError={(e) => { 
                                          (e.target as any).onerror = null; 
                                          (e.target as any).style.display = 'none'; 
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-500 shrink-0 flex items-center justify-center font-bold text-[10px]">
                                      {(exp.company || '').substring(0, 1).toUpperCase() || 'E'}
                                    </div>
                                  )}
                                  <span className="font-semibold text-[var(--title-color)]">{exp.company}</span>
                                </div>
                              </td>
                              <td className="py-4.5 px-4.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  isLightTheme ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'
                                }`}>
                                  {exp.role}
                                </span>
                              </td>
                              <td className="py-4.5 px-4.5">
                                <span className="text-gray-400 font-mono text-[11px]">{exp.period}</span>
                              </td>
                              <td className="py-4.5 px-4.5 text-gray-400">
                                <span>{exp.location}</span>
                              </td>
                              <td className="py-4.5 px-4.5">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button
                                    onClick={() => handleOpenExperienceModal(exp)}
                                    className="p-2 rounded-xl border border-gray-200/10 text-gray-400 hover:text-blue-500 hover:border-blue-500/20 transition-all cursor-pointer"
                                    title="Edit data"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExperience(exp.id, exp.role, exp.company)}
                                    className="p-2 rounded-xl border border-gray-200/10 text-gray-400 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer"
                                    title="Hapus data"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INBOX MESSAGE BOX */}
              {activeTab === 'messages' && (
                <div className="flex-grow flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl font-extrabold flex items-center gap-2">
                      <Inbox size={20} className="text-blue-500" />
                      Client Messages Inbox
                    </h2>
                    <p className="text-xs text-[var(--text-color-light)] mt-1">Inkuiri kontak dan konsultasi projects yang masuk melalui formulir website.</p>
                  </div>

                  {messagesLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-semibold">Mengambil inkuiri inbox...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200/10 rounded-3xl p-8">
                      <Inbox size={40} className="mx-auto text-gray-500 mb-3" />
                      <h3 className="text-sm font-bold">Kotak Masuk Kosong</h3>
                      <p className="text-xs text-[var(--text-color-light)] max-w-sm mx-auto mt-2 leading-relaxed">
                        Belum ada pesan yang disubmisi di portfolio. Formulir kontak real di website didesain menyimpan ke Firestore.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left side: items index */}
                      <div className="lg:col-span-5 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => setSelectedDetailMsg(msg)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col text-left hover:scale-[1.01] ${
                              selectedDetailMsg?.id === msg.id
                                ? 'border-blue-600 bg-blue-600/5 shadow-md'
                                : msg.status === 'unread'
                                ? 'border-indigo-500/25 bg-indigo-500/[0.02]'
                                : 'border-gray-200/5 hover:border-gray-200/10 bg-[var(--container-color)]/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2.5 mb-1.5">
                              <span className="font-bold text-xs truncate max-w-[120px] text-[var(--title-color)]">
                                {msg.name}
                              </span>
                              <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1 shrink-0">
                                <Clock size={10} />
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 truncate block mb-1">
                              {msg.email}
                            </span>
                            <p className="text-[10px] text-gray-500 line-clamp-1 italic">
                              "{msg.message}"
                            </p>

                            {/* Unread dot signal */}
                            {msg.status === 'unread' && (
                              <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Right side: item detailed reader */}
                      <div className="lg:col-span-7">
                        {selectedDetailMsg ? (
                          <div className={`p-6 rounded-3xl border ${
                            isLightTheme ? 'bg-white border-neutral-200' : 'bg-slate-950/40 border-slate-800'
                          }`}>
                            <div className="flex items-center justify-between border-b border-gray-200/5 pb-4.5 mb-5.5 gap-4">
                              <div className="text-left">
                                <h3 className="font-extrabold text-sm text-[var(--title-color)]">
                                  {selectedDetailMsg.name}
                                </h3>
                                <span className="text-xs text-blue-500 select-all tracking-wide">
                                  {selectedDetailMsg.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleMessageRead(selectedDetailMsg)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                                    selectedDetailMsg.status === 'read'
                                      ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/10'
                                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10 hover:bg-indigo-500/20'
                                  }`}
                                >
                                  {selectedDetailMsg.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(selectedDetailMsg.id, selectedDetailMsg.name)}
                                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 border border-transparent hover:border-red-500/10 hover:bg-red-500/5 transition-all cursor-pointer"
                                  title="Delete message"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="text-left space-y-4">
                              <span className="text-[9px] uppercase tracking-widest text-orange-500 font-bold bg-orange-500/10 py-1 px-3 rounded-full">
                                Message Body
                              </span>
                              <p className="text-xs text-[var(--text-color)] bg-[var(--body-color)] p-4 sm:p-5 rounded-2xl border border-gray-200/5 leading-relaxed overflow-y-auto max-h-[25vh] whitespace-pre-wrap font-sans select-all">
                                {selectedDetailMsg.message}
                              </p>

                              <div className="pt-3 border-t border-gray-200/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                                <span>UTC LOG: {selectedDetailMsg.createdAt}</span>
                                <a 
                                  href={`mailto:${selectedDetailMsg.email}?subject=Balasan: Tanya Proyek Daniel Tulus`}
                                  className="text-blue-500 font-bold hover:underline"
                                >
                                  Reply via Email
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 rounded-3xl border border-dashed border-gray-200/5 flex flex-col justify-center items-center text-gray-500 text-xs">
                            <MailOpen size={30} className="mb-2" />
                            Pilih pesan inbox di samping untuk meluncurkan detail pembacaan.
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: BIODATA EDIT FORM */}
              {activeTab === 'biodata' && (
                <div className="flex-grow flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2 text-left">
                        <User size={20} className="text-blue-500" />
                        Kelola Biodata Diri & Kontak
                      </h2>
                      <p className="text-xs text-[var(--text-color-light)] mt-1 text-left">Perbarui profil biodata Anda secara real-time di database Firestore.</p>
                    </div>
                  </div>

                  {biodataLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-mono tracking-wider">Mengambil data profil dari Firestore...</span>
                    </div>
                  ) : (
                    <form onSubmit={handleBiodataUpdate} className="space-y-6">
                      {biodataSuccessMsg && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          {biodataSuccessMsg}
                        </div>
                      )}
                      
                      {biodataErrorMsg && (
                        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold flex items-center gap-2">
                          <X size={16} />
                          {biodataErrorMsg}
                        </div>
                      )}

                      <div className="bg-[var(--container-color)]/30 border border-gray-200/5 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
                        
                        <div className="border-b border-gray-200/5 pb-4">
                          <h3 className="font-extrabold text-sm text-[var(--title-color)] uppercase tracking-wider text-xs">Identitas & Headline</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                            <input
                              type="text"
                              required
                              value={bioForm.fullName}
                              onChange={(e) => setBioForm({ ...bioForm, fullName: e.target.value })}
                              placeholder="Contoh: Daniel Tulus"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Pendek (Branding)</label>
                            <input
                              type="text"
                              required
                              value={bioForm.shortName}
                              onChange={(e) => setBioForm({ ...bioForm, shortName: e.target.value })}
                              placeholder="Contoh: Daniel"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Headline Profesi (Title)</label>
                            <input
                              type="text"
                              required
                              value={bioForm.title}
                              onChange={(e) => setBioForm({ ...bioForm, title: e.target.value })}
                              placeholder="Contoh: Frontend Developer & Video Editor"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                              <span>Foto Profil (Avatar)</span>
                              <span className="text-[9px] font-normal lowercase text-gray-500">(URL atau upload)</span>
                            </label>
                            
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={bioForm.avatarUrl || ''}
                                onChange={(e) => setBioForm({ ...bioForm, avatarUrl: e.target.value })}
                                placeholder="Masukkan URL Foto Profil (https://...) atau upload di bawah"
                                className="w-full p-2.5 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                              />
                              
                              <div className="flex items-center gap-3">
                                <label className="flex-grow flex items-center justify-center border border-dashed border-gray-300/20 hover:border-blue-500/50 rounded-xl p-2.5 bg-[var(--body-color)]/40 hover:bg-blue-500/5 cursor-pointer transition-all gap-2 text-xs font-bold text-gray-400 hover:text-blue-500">
                                  <Upload size={14} />
                                  <span>Upload Foto Profil Baru</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarImageUpload}
                                    className="hidden"
                                  />
                                </label>
                                
                                {bioForm.avatarUrl && (
                                  <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-gray-200/5 bg-slate-950/20 group">
                                    <img 
                                      src={bioForm.avatarUrl} 
                                      alt="Foto Profil Preview" 
                                      className="w-full h-full object-cover"
                                      onError={(e)=>{ 
                                        (e.target as any).onerror = null; 
                                        (e.target as any).src = 'https://placehold.co/100x100?text=Foto'; 
                                      }} 
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBioForm({ ...bioForm, avatarUrl: '' })}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity cursor-pointer"
                                      title="Hapus foto"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-b border-gray-200/5 pb-4 pt-4">
                          <h3 className="font-extrabold text-sm text-[var(--title-color)] uppercase tracking-wider text-xs">Kontak & Sosial Media</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Hubungi</label>
                            <input
                              type="email"
                              required
                              value={bioForm.email}
                              onChange={(e) => setBioForm({ ...bioForm, email: e.target.value })}
                              placeholder="daniel.tulus@gmail.com"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
                            <input
                              type="url"
                              value={bioForm.linkedin}
                              onChange={(e) => setBioForm({ ...bioForm, linkedin: e.target.value })}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">No WhatsApp (Display)</label>
                            <input
                              type="text"
                              value={bioForm.whatsapp}
                              onChange={(e) => setBioForm({ ...bioForm, whatsapp: e.target.value })}
                              placeholder="Contoh: +62 812-3456-7890"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Link WhatsApp Direct</label>
                            <input
                              type="url"
                              value={bioForm.whatsappLink}
                              onChange={(e) => setBioForm({ ...bioForm, whatsappLink: e.target.value })}
                              placeholder="https://wa.me/6281234567890"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Instagram Username</label>
                            <input
                              type="text"
                              value={bioForm.instagram}
                              onChange={(e) => setBioForm({ ...bioForm, instagram: e.target.value })}
                              placeholder="Contoh: @danieltls"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Link Instagram Profile</label>
                            <input
                              type="url"
                              value={bioForm.instagramLink}
                              onChange={(e) => setBioForm({ ...bioForm, instagramLink: e.target.value })}
                              placeholder="https://instagram.com/username"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>
                        </div>

                        <div className="border-b border-gray-200/5 pb-4 pt-4">
                          <h3 className="font-extrabold text-sm text-[var(--title-color)] uppercase tracking-wider text-xs">CV & Resume</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Download Link CV / Portofolio PDF</label>
                            <input
                              type="text"
                              value={bioForm.githubCV}
                              onChange={(e) => setBioForm({ ...bioForm, githubCV: e.target.value })}
                              placeholder="Link Google Drive, Github, atau static path"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Filename CV Baru</label>
                            <input
                              type="text"
                              value={bioForm.cvFilename}
                              onChange={(e) => setBioForm({ ...bioForm, cvFilename: e.target.value })}
                              placeholder="Contoh: CV_Daniel_Tulus.pdf"
                              className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                            />
                          </div>
                        </div>

                        <div className="border-b border-gray-200/5 pb-4 pt-4">
                          <h3 className="font-extrabold text-sm text-[var(--title-color)] uppercase tracking-wider text-xs">Sekilas Profil & Statistik</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">About Me Bio (Paragraf lengkap)</label>
                            <textarea
                              required
                              rows={5}
                              value={bioForm.aboutMe}
                              onChange={(e) => setBioForm({ ...bioForm, aboutMe: e.target.value })}
                              placeholder="Tuliskan cerita biografi, pengenalan diri, dan keahlian inti Anda..."
                              className="w-full p-4 rounded-2xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] leading-relaxed resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pengalaman Kerja</label>
                              <input
                                type="text"
                                value={bioForm.experienceYears}
                                onChange={(e) => setBioForm({ ...bioForm, experienceYears: e.target.value })}
                                placeholder="Contoh: 03+ Years"
                                className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] text-center font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Proyek Selesai</label>
                              <input
                                type="text"
                                value={bioForm.projectsCompletedCount}
                                onChange={(e) => setBioForm({ ...bioForm, projectsCompletedCount: e.target.value })}
                                placeholder="Contoh: 15+ Finished"
                                className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] text-center font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ketersediaan Support</label>
                              <input
                                type="text"
                                value={bioForm.supportAvailability}
                                onChange={(e) => setBioForm({ ...bioForm, supportAvailability: e.target.value })}
                                placeholder="Contoh: Online 24/7"
                                className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] text-center font-bold"
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end p-2">
                        <button
                          type="submit"
                          disabled={isUpdatingBiodata}
                          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-blue-500/10 cursor-pointer text-xs active:scale-95 duration-150 flex items-center gap-2"
                        >
                          {isUpdatingBiodata ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Menyimpan Profil...
                            </>
                          ) : (
                            <>
                              <Save size={14} />
                              Simpan ke Cloud Firestore 
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: MY SERVICES MANAGER */}
              {activeTab === 'services' && (
                <div className="flex-grow flex flex-col gap-5 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <Sparkles size={20} className="text-blue-500" />
                        Kelola Layanan Jasa (My Services)
                      </h2>
                      <p className="text-xs text-[var(--text-color-light)] mt-1">Perbarui, tambah, atau hapus penawaran jasa layanan profesional Anda secara instan.</p>
                    </div>
                    <button
                      onClick={() => handleOpenServiceModal(null)}
                      className="shrink-0 py-2.5 px-4.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all self-start sm:self-auto shadow-md shadow-blue-500/10"
                    >
                      <Plus size={14} /> Add Service
                    </button>
                  </div>

                  {servicesCountLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-semibold">Mengambil daftar layanan...</span>
                    </div>
                  ) : servicesList.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200/10 rounded-3xl p-8">
                      <Sparkles size={40} className="mx-auto text-gray-500 mb-3 animate-pulse" />
                      <h3 className="text-sm font-bold">Layanan Jasa Kosong</h3>
                      <p className="text-xs text-[var(--text-color-light)] max-w-sm mx-auto mt-2 leading-relaxed">
                        Belum ada data services di Firestore. Inisialisasi awal akan membuat data preset secara otomatis.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {servicesList.map((srv) => (
                        <div 
                          key={srv.id} 
                          className={`p-6 rounded-3xl border flex flex-col h-full justify-between transition-all group ${
                            isLightTheme ? 'bg-white border-neutral-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                isLightTheme ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'
                              }`}>
                                Icon: {srv.icon}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--title-color)] mb-2">{srv.title}</h3>
                            <p className="text-xs text-[var(--text-color-light)] line-clamp-3 mb-4 leading-relaxed">{srv.description}</p>
                            
                            <div className="border-t border-gray-200/5 pt-3 mb-4">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Checklist detail ({srv.checklist.length}):</span>
                              <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                {srv.checklist.map((item, idx) => (
                                  <li key={idx} className="text-[11px] text-[var(--text-color)] flex items-start gap-1">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span className="line-clamp-1">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-200/5">
                            <button
                              onClick={() => handleOpenServiceModal(srv)}
                              className="flex-grow py-2 rounded-xl text-center text-xs font-bold border border-gray-200/10 hover:text-blue-500 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id || '', srv.title)}
                              className="py-2 px-3 rounded-xl border border-gray-200/10 text-gray-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                              title="Delete service"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: MY SKILLS CATEGORY MANAGER */}
              {activeTab === 'skills' && (
                <div className="flex-grow flex flex-col gap-5 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <GraduationCap size={20} className="text-blue-500" />
                        Kelola Kategori Keahlian (My Skills)
                      </h2>
                      <p className="text-xs text-[var(--text-color-light)] mt-1">Kelompokkan keahlian teknis serta tingkat proficiency Anda di database Firestore.</p>
                    </div>
                    <button
                      onClick={() => handleOpenSkillModal(null)}
                      className="shrink-0 py-2.5 px-4.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all self-start sm:self-auto shadow-md shadow-blue-500/10"
                    >
                      <Plus size={14} /> Add Category
                    </button>
                  </div>

                  {skillsCountLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center py-20 gap-3">
                      <RefreshCw size={32} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500 font-semibold">Mengambil daftar kategori...</span>
                    </div>
                  ) : skillsCategories.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200/10 rounded-3xl p-8">
                      <GraduationCap size={40} className="mx-auto text-gray-500 mb-3" />
                      <h3 className="text-sm font-bold">Kategori Keahlian Kosong</h3>
                      <p className="text-xs text-[var(--text-color-light)] max-w-sm mx-auto mt-2 leading-relaxed">
                        Belum ada kategori keahlian terdaftar. Inisialisasi awal akan memigrasikan data preset secara otomatis.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {skillsCategories.map((cat) => (
                        <div 
                          key={cat.id} 
                          className={`p-6 rounded-3xl border flex flex-col h-full justify-between transition-all ${
                            isLightTheme ? 'bg-white border-neutral-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-gray-200/5 pb-3 mb-4">
                              <h3 className="text-base sm:text-lg font-extrabold text-[var(--title-color)]">{cat.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                isLightTheme ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {cat.skills.length} Skills
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {cat.skills.map((sk, sIdx) => (
                                <div 
                                  key={sIdx}
                                  className={`px-3 py-1.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                                    isLightTheme ? 'bg-neutral-50 border-neutral-100 text-neutral-700' : 'bg-slate-950/40 border-slate-800/80 text-gray-300'
                                  }`}
                                >
                                  <span className="font-semibold">{sk.name}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    sk.level === 'Advanced' 
                                      ? 'bg-emerald-500/10 text-emerald-400' 
                                      : sk.level === 'Intermediate' 
                                        ? 'bg-blue-500/10 text-blue-400' 
                                        : 'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    {sk.level}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-200/5">
                            <button
                              onClick={() => handleOpenSkillModal(cat)}
                              className="flex-grow py-2 rounded-xl text-center text-xs font-bold border border-gray-200/10 hover:text-blue-500 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> Edit Kategori
                            </button>
                            <button
                              onClick={() => handleDeleteSkillCategory(cat.id || '', cat.title)}
                              className="py-2 px-3 rounded-xl border border-gray-200/10 text-gray-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                              title="Hapus Kategori"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* MODAL WINDOW FOR ADDING AND EDITING PORTFOLIO WORK VALUES */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${
                isLightTheme ? 'bg-white border-white' : 'bg-slate-900 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-left mb-6">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Database size={18} className="text-blue-500" />
                  {modalMode === 'create' ? 'Tambah Proyek Baru' : 'Edit Proyek'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Formulir isian data project langsung di database Firestore.</p>
              </div>

              <form onSubmit={handleSaveProjectSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kategori Karya</label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                  >
                    <option value="web">Web Application</option>
                    <option value="photography">Photography</option>
                    <option value="design">Graphic Design / Video Edit</option>
                    <option value="certificate">Professional Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama / Judul Project</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Web Portofolioku V2"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Penjelasan / Deskripsi Ringkas</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detail deskripsi rincian karya proyek..."
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <span>Gambar Project / Karya</span>
                    <span className="text-[9px] font-normal lowercase text-gray-500">(URL link atau upload)</span>
                  </label>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="Masukkan URL Gambar (https://...) atau upload di bawah"
                      className="w-full p-2.5 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-grow flex items-center justify-center border border-dashed border-gray-300/20 hover:border-blue-500/50 rounded-xl p-2.5 bg-[var(--body-color)]/40 hover:bg-blue-500/5 cursor-pointer transition-all gap-2 text-xs font-bold text-gray-400 hover:text-blue-500">
                        <Upload size={14} />
                        <span>Upload File Gambar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProjectImageUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {formImageUrl && (
                        <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-gray-200/5 bg-slate-950/20 group">
                          <img 
                            src={formImageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e)=>{ 
                              (e.target as any).onerror = null; 
                              (e.target as any).src = 'https://placehold.co/100x100?text=Preview'; 
                            }} 
                          />
                          <button
                            type="button"
                            onClick={() => setFormImageUrl('')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity cursor-pointer"
                            title="Hapus gambar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">External Action Link (Optional)</label>
                  <input
                    type="url"
                    value={formButtonLink}
                    onChange={(e) => setFormButtonLink(e.target.value)}
                    placeholder="https://github.com/... atau link demo"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200/5">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200/5 text-gray-400 hover:text-[var(--title-color)] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <><Save size={14} /> Simpan Data</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isServiceModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${
                isLightTheme ? 'bg-white border-white' : 'bg-slate-900 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button 
                onClick={() => setIsServiceModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-left mb-6">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" />
                  {modalMode === 'create' ? 'Tambah Layanan Baru' : 'Edit Layanan'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Formulir isian data penawaran jasa layanan ke Firestore.</p>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Layanan</label>
                  <input
                    type="text"
                    required
                    value={srvTitle}
                    onChange={(e) => setSrvTitle(e.target.value)}
                    placeholder="Contoh: Professional Video Editing"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Preset Icon</label>
                    <select
                      value={srvIcon}
                      onChange={(e) => setSrvIcon(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    >
                      <option value="code">Code / Development</option>
                      <option value="video">Video Editing</option>
                      <option value="palette">Graphic / Palette</option>
                      <option value="sparkles">Sparkles / Creative</option>
                      <option value="megaphone">Megaphone / Marketing</option>
                      <option value="briefcase">Briefcase / Professional</option>
                      <option value="layers">Layers / Design</option>
                      <option value="layout">Layout / UI</option>
                      <option value="camera">Camera / Photography</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Penjelasan / Deskripsi Layanan</label>
                  <textarea
                    required
                    rows={3}
                    value={srvDescription}
                    onChange={(e) => setSrvDescription(e.target.value)}
                    placeholder="Contoh: Mendesain konten video berkualitas industri..."
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] resize-none font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Rincian Fitur Checklist (Satu per baris)</label>
                  <textarea
                    required
                    rows={4}
                    value={srvChecklist}
                    onChange={(e) => setSrvChecklist(e.target.value)}
                    placeholder="Slicing dari Figma ke HTML CSS bersih&#10;Integritas database relasional, API proxy"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] font-mono leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200/5">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200/5 text-gray-400 hover:text-[var(--title-color)] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <><Save size={14} /> Simpan Layanan</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isSkillModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${
                isLightTheme ? 'bg-white border-white' : 'bg-slate-900 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button 
                onClick={() => setIsSkillModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-left mb-6">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-500" />
                  {modalMode === 'create' ? 'Tambah Kategori Keahlian' : 'Edit Kategori Keahlian'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Formulir isian data kelompok & list skills ke Firestore.</p>
              </div>

              <form onSubmit={handleSkillCategorySubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Kelompok Kategori</label>
                  <input
                    type="text"
                    required
                    value={skCatTitle}
                    onChange={(e) => setSkCatTitle(e.target.value)}
                    placeholder="Contoh: Frontend Web Development"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] font-semibold"
                  />
                </div>

                {/* Added Skills list inside category */}
                <div className="border border-gray-200/5 rounded-2xl p-4 bg-[var(--body-color)]/50 max-h-48 overflow-y-auto">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Daftar Keahlian ({skSkillsList.length})</label>
                  {skSkillsList.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic py-2">Belum ada spesifik skill yang ditambahkan ke kategori ini.</p>
                  ) : (
                    <div className="space-y-2">
                      {skSkillsList.map((skill, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                            isLightTheme ? 'bg-white border-neutral-200/60' : 'bg-slate-950/60 border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--title-color)]">{skill.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              skill.level === 'Advanced' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : skill.level === 'Intermediate' 
                                  ? 'bg-blue-500/10 text-blue-400' 
                                  : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {skill.level}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTempSkill(idx)}
                            className="p-1 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subform to add skill category inner skill */}
                <div className={`p-4 rounded-2xl border ${
                  isLightTheme ? 'bg-neutral-100 border-neutral-200/70' : 'bg-slate-900 border-slate-800'
                }`}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Input Spesifik Skill Baru:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-[9px]">Nama Skill (Contoh: React)</label>
                      <input
                        type="text"
                        value={tempSkillName}
                        onChange={(e) => setTempSkillName(e.target.value)}
                        placeholder="React / Canva / Premiere"
                        className="w-full p-2.5 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-[9px]">Tingkat Tingkatan</label>
                      <div className="flex gap-2">
                        <select
                          value={tempSkillLevel}
                          onChange={(e: any) => setTempSkillLevel(e.target.value)}
                          className="flex-grow p-2.5 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                        >
                          <option value="">Pilih Level...</option>
                          <option value="Advanced">Advanced / Mahir</option>
                          <option value="Intermediate">Intermediate / Menengah</option>
                          <option value="Basic">Basic / Dasar</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddTempSkill}
                          className="px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
                          title="Tambah skill"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200/5">
                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200/5 text-gray-400 hover:text-[var(--title-color)] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <><Save size={14} /> Simpan Kategori</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isExperienceModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${
                isLightTheme ? 'bg-white border-white' : 'bg-slate-900 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button 
                onClick={() => setIsExperienceModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-left mb-6">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-500" />
                  {modalMode === 'create' ? 'Tambah Pengalaman Baru' : 'Edit Pengalaman'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Formulir isian data riwayat pengalaman kerja langsung di database Firestore.</p>
              </div>

              <form onSubmit={handleSaveExperienceSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Perusahaan</label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Contoh: PT Bank XYZ"
                      className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Lokasi Kerja</label>
                    <input
                      type="text"
                      required
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      placeholder="Contoh: Jakarta, Indonesia"
                      className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jabatan / Role</label>
                    <input
                      type="text"
                      required
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Contoh: Senior Developer"
                      className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Periode / Durasi</label>
                    <input
                      type="text"
                      required
                      value={expPeriod}
                      onChange={(e) => setExpPeriod(e.target.value)}
                      placeholder="Contoh: Okt 2021 - Jan 2022"
                      className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Rangkuman / Deskripsi Singkat</label>
                  <textarea
                    required
                    rows={2}
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    placeholder="Contoh: Terpilih sebagai Frontline representative..."
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <span>Logo Perusahaan / Icon (Optional)</span>
                    <span className="text-[9px] font-normal lowercase text-gray-500">(URL link atau upload)</span>
                  </label>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={expImageUrl}
                      onChange={(e) => setExpImageUrl(e.target.value)}
                      placeholder="Masukkan URL Logo (https://...) atau upload di bawah"
                      className="w-full p-2.5 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)]"
                    />
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-grow flex items-center justify-center border border-dashed border-gray-300/20 hover:border-blue-500/50 rounded-xl p-2.5 bg-[var(--body-color)]/40 hover:bg-blue-500/5 cursor-pointer transition-all gap-2 text-xs font-bold text-gray-400 hover:text-blue-500">
                        <Upload size={14} />
                        <span>Upload File Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleExperienceImageUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {expImageUrl && (
                        <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-gray-200/5 bg-slate-950/20 group">
                          <img 
                            src={expImageUrl} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                            onError={(e)=>{ 
                              (e.target as any).onerror = null; 
                              (e.target as any).src = 'https://placehold.co/100x100?text=Logo'; 
                            }} 
                          />
                          <button
                            type="button"
                            onClick={() => setExpImageUrl('')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity cursor-pointer"
                            title="Hapus Logo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pencapaian / Prestasi (Satu per baris)</label>
                  <textarea
                    rows={4}
                    value={expDetails}
                    onChange={(e) => setExpDetails(e.target.value)}
                    placeholder="Mengelola ledger balance dengan akurat&#10;Melatih 5 staff administrasi junior"
                    className="w-full p-3 rounded-xl bg-[var(--body-color)] border border-gray-200/5 focus:border-blue-500/50 focus:outline-none text-xs text-[var(--title-color)] font-mono leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200/5">
                  <button
                    type="button"
                    onClick={() => setIsExperienceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200/5 text-gray-400 hover:text-[var(--title-color)] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <><Save size={14} /> Simpan Data</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[1010] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative text-left ${
                isLightTheme ? 'bg-white border-white' : 'bg-slate-900 border-slate-800'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-500/10 text-gray-400 hover:text-[var(--title-color)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--title-color)]">
                    Konfirmasi Hapus
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Apakah Anda yakin ingin menghapus {
                      deleteConfirm.type === 'project' 
                        ? 'proyek portfolio' 
                        : deleteConfirm.type === 'experience' 
                          ? 'riwayat pengalaman kerja' 
                          : deleteConfirm.type === 'service'
                            ? 'layanan jasa'
                            : deleteConfirm.type === 'skillCategory'
                              ? 'kategori kelompok keahlian'
                              : 'pesan inbox'
                    } ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              {/* Show item details */}
              <div className={`p-4 rounded-xl border mb-6 text-xs ${
                isLightTheme ? 'bg-neutral-100 border-neutral-200' : 'bg-slate-950/50 border-slate-800/60'
              }`}>
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Item yang dipilih:</span>
                <span className="font-semibold text-[var(--title-color)] font-mono block truncate">
                  {deleteConfirm.title}
                </span>
                <span className="text-[10px] text-gray-400 block mt-1">ID: {deleteConfirm.id}</span>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-200/5 pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200/5 text-gray-400 hover:text-[var(--title-color)] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/10 active:scale-95 transition-all"
                >
                  Ya, Hapus Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
