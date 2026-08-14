"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Printer, FileText, ZoomIn, ZoomOut } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export type Attachment = {
  name: string;
  url: string;
  type: "image" | "file";
};

interface FileViewerModalProps {
  file: Attachment | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: FileViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!file || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="file-viewer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 bottom-0 right-0 left-[300px] z-[200] bg-black/80 backdrop-blur-md flex flex-col border-l border-white/10"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              {file.type === 'image' ? (
                <img src={file.url} alt="thumbnail" className="w-6 h-6 object-cover rounded" />
              ) : (
                <FileText size={20} className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-[15px]">{file.name}</span>
              <span className="text-white/60 text-[13px]">{file.type === 'image' ? 'Image File' : 'Document File'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {file.type === 'image' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.25)); }} className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                  <ZoomOut size={20} />
                </button>
                <span className="text-white/80 text-[13px] font-medium min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.25)); }} className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                  <ZoomIn size={20} />
                </button>
                <div className="w-[1px] h-6 bg-white/20 mx-2"></div>
              </>
            )}
            <button className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Download size={20} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Share2 size={20} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
              <Printer size={20} />
            </button>
            <div className="w-[1px] h-6 bg-white/20 mx-2"></div>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/10 bg-white/5 border border-white/10 relative z-50">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div
          className="flex-1 flex items-center justify-center p-8 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {file.type === 'image' ? (
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoom, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl h-full max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Mock PDF Toolbar */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-center gap-6 text-gray-600 text-sm">
                <button className="hover:text-black">1 / 5</button>
                <div className="w-[1px] h-4 bg-gray-300"></div>
                <button className="hover:text-black">-</button>
                <span>100%</span>
                <button className="hover:text-black">+</button>
              </div>
              {/* Mock PDF Content */}
              <div className="flex-1 bg-gray-200/50 p-8 overflow-y-auto flex justify-center">
                <div className="w-full max-w-2xl bg-white min-h-[1056px] shadow-sm border border-gray-300 p-12">
                  <div className="h-8 w-1/3 bg-gray-200 rounded mb-8"></div>
                  <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded mb-8"></div>

                  <div className="h-48 w-full bg-blue-50/50 rounded mb-8 border-2 border-dashed border-blue-100 flex items-center justify-center text-blue-300 font-medium">Chart or Diagram placeholder</div>

                  <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
