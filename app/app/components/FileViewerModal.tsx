"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Printer, FileText, ZoomIn, ZoomOut } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCompose } from "../context/ComposeContext";

export type Attachment = {
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "pdf" | "text" | "file";
  attachmentId?: string;
  size?: number;
  mimeType?: string;
};

interface FileViewerModalProps {
  file: Attachment | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: FileViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);
  const constraintsRef = useRef(null);
  const { openCompose } = useCompose();

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
        className="fixed top-0 bottom-0 right-0 left-[280px] z-[200] bg-white/90 dark:bg-black/90 backdrop-blur-md flex flex-col border-l border-black/10 dark:border-white/10"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Minimal Floating Header */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10 pointer-events-none"
        >
          {/* File Name */}
          <div className="flex items-center">
            <span className="text-black dark:text-white font-medium text-[15px] drop-shadow-sm">{file.name}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pointer-events-auto bg-white/50 dark:bg-black/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
            {file.type === 'image' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.25)); }} className="text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                  <ZoomOut size={18} />
                </button>
                <span className="text-black/70 dark:text-white/80 text-[13px] font-medium min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.25)); }} className="text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                  <ZoomIn size={18} />
                </button>
                <div className="w-[1px] h-5 bg-black/10 dark:bg-white/20 mx-1"></div>
              </>
            )}
            <button onClick={(e) => {
              e.stopPropagation();
              const a = document.createElement('a');
              a.href = file.url;
              a.download = file.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }} className="text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Download">
              <Download size={18} />
            </button>
            <button onClick={(e) => {
              e.stopPropagation();
              onClose();
              openCompose('new', {
                attachments: [{
                  name: file.name,
                  url: file.url,
                  attachmentId: file.attachmentId,
                  size: file.size,
                  mimeType: file.mimeType
                }]
              });
            }} className="text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Share">
              <Share2 size={18} />
            </button>
            <button onClick={(e) => {
              e.stopPropagation();
              if (file.type === 'image') {
                const img = new Image();
                img.src = file.url;
                const win = window.open("");
                if (win) {
                  win.document.write(`<img src="${img.src}" style="max-width:100%;height:auto;" onload="window.print();window.close();" />`);
                  win.document.close();
                }
              }
            }} className="text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Print">
              <Printer size={18} />
            </button>
            <div className="w-[1px] h-5 bg-black/10 dark:bg-white/20 mx-1"></div>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-black/70 dark:text-white/80 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10" title="Close">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div
          ref={constraintsRef}
          className="flex-1 flex items-center justify-center p-8 overflow-hidden relative"
          onClick={e => e.stopPropagation()}
        >
          {file.type === 'image' ? (
            <motion.img
              drag
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoom, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing pointer-events-auto"
            />
          ) : file.type === 'video' ? (
            <motion.video
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: zoom, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={file.url}
              controls
              className="max-w-full max-h-full rounded-lg shadow-2xl pointer-events-auto"
            />
          ) : file.type === 'audio' ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 pointer-events-auto border border-black/10 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                <FileText size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-black dark:text-white font-medium text-center break-all">{file.name}</span>
              <audio src={file.url} controls className="w-full mt-2" />
            </motion.div>
          ) : (file.type === 'pdf' || file.type === 'text') ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl h-full max-h-[85vh] bg-white dark:bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              <iframe 
                src={file.url} 
                className="w-full h-full border-none bg-white" 
                title={file.name}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl h-full max-h-[80vh] bg-white dark:bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-black/10 dark:border-white/10 pointer-events-auto"
            >
              <div className="flex-1 bg-gray-50 dark:bg-[#111] flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 bg-white dark:bg-[#222] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6">
                  <FileText size={40} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No preview available</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center text-sm">
                  This file type cannot be previewed in the browser. Please download the file to view its contents.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Download {file.name}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
