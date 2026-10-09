import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, X, AlertCircle,
  RefreshCw, FileCheck, Sparkles, File
} from 'lucide-react';
import type { ResumeFile } from '@/types/resume';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_EXT = ['.pdf', '.doc', '.docx'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(type: string) {
  if (type === 'application/pdf') return '📄';
  return '📝';
}

type UploadState = 'idle' | 'dragover' | 'uploading' | 'success' | 'error';

interface Props {
  resumeFile: ResumeFile | null;
  onFileChange: (file: ResumeFile | null) => void;
  error?: string;
}

export default function StepUploadResume({ resumeFile, onFileChange, error }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>(resumeFile ? 'success' : 'idle');
  const [uploadProgress, setUploadProgress] = useState(resumeFile ? 100 : 0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragDepth, setDragDepth] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return 'Only PDF, DOC, and DOCX files are supported.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size must be under ${MAX_SIZE_MB} MB. Your file is ${formatBytes(file.size)}.`;
    }
    return null;
  };

  const simulateUpload = useCallback((file: File) => {
    const validErr = validateFile(file);
    if (validErr) {
      setValidationError(validErr);
      setUploadState('error');
      onFileChange(null);
      return;
    }

    setValidationError(null);
    setUploadState('uploading');
    setUploadProgress(0);

    let progress = 0;
    progressTimerRef.current = setInterval(() => {
      // Simulate realistic non-linear upload progress
      const increment = progress < 30 ? 8 : progress < 60 ? 5 : progress < 85 ? 3 : 1;
      progress = Math.min(progress + increment, 98);
      setUploadProgress(progress);

      if (progress >= 98) {
        clearInterval(progressTimerRef.current!);
        setTimeout(() => {
          setUploadProgress(100);
          setUploadState('success');
          onFileChange({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          });
        }, 400);
      }
    }, 80);
  }, [onFileChange]);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    simulateUpload(file);
  }, [simulateUpload]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(d => d + 1);
    setUploadState('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(d => {
      const next = d - 1;
      if (next <= 0) setUploadState(resumeFile ? 'success' : 'idle');
      return Math.max(next, 0);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(0);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setUploadState('idle');
    setUploadProgress(0);
    setValidationError(null);
    onFileChange(null);
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const isDragOver = uploadState === 'dragover';
  const isUploading = uploadState === 'uploading';
  const isSuccess = uploadState === 'success';
  const isError = uploadState === 'error';

  return (
    <div className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drop Zone */}
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
              ${isDragOver
                ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                : isError
                  ? 'border-rose-500/50 bg-rose-500/5'
                  : isUploading
                    ? 'border-cyan-500/50 bg-cyan-500/5 cursor-not-allowed'
                    : 'border-white/15 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5'
              }`}
          >
            {/* Animated gradient border on drag */}
            {isDragOver && (
              <div className="absolute inset-0 rounded-2xl opacity-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 animate-pulse pointer-events-none" />
            )}

            <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              {isUploading ? (
                <UploadingState progress={uploadProgress} />
              ) : isError ? (
                <ErrorState error={validationError} />
              ) : (
                <IdleState isDragOver={isDragOver} />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <SuccessCard
              file={resumeFile!}
              onRemove={handleRemove}
              onReplace={handleReplace}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* External validation error (from wizard) */}
      {error && !validationError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-rose-400"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </motion.p>
      )}

      {/* Accepted formats note */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <span className="text-xs text-slate-600">Accepted formats:</span>
        {ACCEPTED_EXT.map(ext => (
          <span
            key={ext}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-400 uppercase"
          >
            {ext}
          </span>
        ))}
        <span className="text-xs text-slate-600 ml-auto">Max {MAX_SIZE_MB} MB</span>
      </div>

      {/* Feature hints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {[
          { icon: FileCheck, label: 'ATS Score', desc: 'Know your ATS pass rate' },
          { icon: Sparkles, label: 'AI Analysis', desc: 'Skills & gap detection' },
          { icon: FileText, label: 'Suggestions', desc: 'Actionable improvements' },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">{label}</p>
              <p className="text-[10px] text-slate-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IdleState({ isDragOver }: { isDragOver: boolean }) {
  return (
    <>
      <motion.div
        animate={isDragOver ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative"
      >
        <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${isDragOver ? 'opacity-60' : 'opacity-20'}`}
          style={{ background: 'radial-gradient(circle, #06B6D4, #3B82F6)' }}
        />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
          <Upload className={`w-7 h-7 transition-colors duration-300 ${isDragOver ? 'text-cyan-300' : 'text-cyan-500'}`} />
        </div>
      </motion.div>

      <div>
        <p className="font-display font-semibold text-base text-white mb-1">
          {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
        </p>
        <p className="text-sm text-slate-500">
          {isDragOver
            ? 'Release to start uploading'
            : 'Drag & drop your file here, or click to browse'}
        </p>
      </div>
    </>
  );
}

function UploadingState({ progress }: { progress: number }) {
  return (
    <>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-16 h-16 -rotate-90 absolute" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="url(#uploadGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
            className="transition-all duration-150"
          />
          <defs>
            <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <File className="w-6 h-6 text-cyan-400 relative z-10" />
      </div>

      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Uploading…</span>
          <span className="text-sm font-mono text-cyan-400">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: 'linear' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">Processing your file securely…</p>
      </div>
    </>
  );
}

function ErrorState({ error }: { error: string | null }) {
  return (
    <>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center"
      >
        <AlertCircle className="w-7 h-7 text-rose-400" />
      </motion.div>
      <div>
        <p className="font-display font-semibold text-base text-rose-300 mb-1">Upload failed</p>
        <p className="text-sm text-slate-500">{error ?? 'Invalid file. Please try again.'}</p>
        <p className="text-xs text-cyan-400 mt-2">Click to try again</p>
      </div>
    </>
  );
}

function SuccessCard({
  file,
  onRemove,
  onReplace,
}: {
  file: ResumeFile;
  onRemove: () => void;
  onReplace: () => void;
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-xl" />
            <div className="relative w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
              {getFileIcon(file.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-display font-semibold text-white text-sm truncate">{file.name}</p>
              <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                <CheckCircle2 className="w-3 h-3" />
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>

            {/* Animated success bar */}
            <div className="mt-3 w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              />
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={onRemove}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            File uploaded successfully
          </div>
          <button
            onClick={onReplace}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors duration-200"
          >
            <RefreshCw className="w-3 h-3" />
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}
