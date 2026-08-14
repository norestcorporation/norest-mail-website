import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Upload, X, File, ImageIcon, FileText, CheckCircle2, HardDrive, Clock, Star, Share2, Plus } from "lucide-react";
import clsx from "clsx";

export interface CloudFile {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
}

const INITIAL_FILES: CloudFile[] = [
  { id: '1', name: 'Project_Proposal_Q3.pdf', size: 1024 * 2400, type: 'application/pdf', date: 'Oct 12, 2023' },
  { id: '2', name: 'Design_Assets_v2.zip', size: 1024 * 15000, type: 'application/zip', date: 'Oct 10, 2023' },
  { id: '3', name: 'Team_Photo_Offsite.jpg', size: 1024 * 3400, type: 'image/jpeg', date: 'Sep 28, 2023' },
  { id: '4', name: 'Q2_Financials.xlsx', size: 1024 * 800, type: 'application/vnd.ms-excel', date: 'Aug 15, 2023' },
  { id: '5', name: 'Marketing_Video_Draft.mp4', size: 1024 * 45000, type: 'video/mp4', date: 'Oct 01, 2023' },
  { id: '6', name: 'Client_Notes.txt', size: 1024 * 12, type: 'text/plain', date: 'Oct 14, 2023' },
];

export function CloudStorageModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (file: any) => void }) {
  const [files, setFiles] = useState<CloudFile[]>(INITIAL_FILES);
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      const newCloudFiles = uploadedFiles.map((f, i) => ({
        id: `uploaded-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
      setFiles(prev => [...newCloudFiles, ...prev]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelect = (cf: CloudFile) => {
    const mockFile = new window.File([""], cf.name, { type: cf.type });
    Object.defineProperty(mockFile, 'size', { value: cf.size });
    onSelect(mockFile);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getIconColor = (type: string) => {
    if (type.includes('image')) return 'text-pink-500 bg-pink-50 dark:bg-pink-500/10';
    if (type.includes('pdf')) return 'text-red-500 bg-red-50 dark:bg-red-500/10';
    if (type.includes('video')) return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10';
    if (type.includes('zip') || type.includes('compressed')) return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
    return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
  };

  const getIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={22} />;
    if (type.includes('pdf')) return <FileText size={22} />;
    return <File size={22} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cloud-storage-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex w-[850px] max-w-[95vw] h-[550px] bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Left Sidebar */}
            <div className="w-[240px] bg-black border-r border-black/5 dark:border-white/5 flex flex-col pt-6 pb-4 shrink-0">
              <div className="px-6 mb-8 flex items-center gap-3">
                <img src="/logo/logo-01.png" alt="Norest" className="w-8 h-8 object-contain invert brightness-0" />
                <div>
                  <h3 className="font-bold text-white text-[15px] tracking-tight">Norest Cloud</h3>
                </div>
              </div>

              <div className="flex flex-col gap-1 px-3">
                <button onClick={() => setActiveTab('all')} className={clsx("flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all", activeTab === 'all' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5")}>
                  <HardDrive size={18} /> All Files
                </button>
                <button onClick={() => setActiveTab('recent')} className={clsx("flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all", activeTab === 'recent' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5")}>
                  <Clock size={18} /> Recent
                </button>
                <button onClick={() => setActiveTab('shared')} className={clsx("flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all", activeTab === 'shared' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5")}>
                  <Share2 size={18} /> Shared with me
                </button>
                <button onClick={() => setActiveTab('starred')} className={clsx("flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all", activeTab === 'starred' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5")}>
                  <Star size={18} /> Starred
                </button>
              </div>

              <div className="mt-auto px-6">
                <div className="bg-[#111111] rounded-xl p-4 border border-white/5 shadow-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[12px] font-bold text-gray-200">Storage</span>
                    <span className="text-[10px] font-semibold text-white">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-white w-[45%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-400">45 GB of 100 GB used</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-black">
              {/* Header Actions */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-black/5 dark:border-white/5">
                <h2 className="text-[20px] font-bold text-gray-900 dark:text-white capitalize tracking-tight">
                  {activeTab === 'all' ? 'All Files' : activeTab}
                </h2>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                    multiple
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[13px] font-bold hover:opacity-80 transition-opacity"
                  >
                    <Plus size={16} strokeWidth={3} /> Upload New
                  </button>
                  <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-gray-50 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 rounded-full text-gray-600 dark:text-gray-300 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-8 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {files.map((file, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={file.id}
                      onClick={() => handleSelect(file)}
                      className="group flex flex-col p-4 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl cursor-pointer hover:border-black/20 dark:hover:border-white/30 transition-all relative"
                    >
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-black dark:text-white transition-opacity z-10">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-4", getIconColor(file.type))}>
                        {getIcon(file.type)}
                      </div>

                      <div className="w-full">
                        <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 truncate w-full tracking-tight mb-1" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          <span>{formatSize(file.size)}</span>
                          <span>{file.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
