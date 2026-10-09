import { type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldProps {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, error, optional, children, htmlFor }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
      >
        {label}
        {optional && (
          <span className="ml-1.5 text-slate-600 normal-case lowercase">— optional</span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface TextInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: TextInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-300 ${
        error
          ? 'border-rose-500/50 focus:border-rose-400'
          : 'border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.05]'
      }`}
    />
  );
}

interface TextAreaProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-300 resize-none ${
        error
          ? 'border-rose-500/50 focus:border-rose-400'
          : 'border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.05]'
      }`}
    />
  );
}

interface OptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

export function OptionChip({ label, selected, onClick, icon }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
        selected
          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface SelectInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: string[];
  error?: boolean;
  icon?: ReactNode;
}

export function SelectInput({
  id,
  value,
  onChange,
  placeholder = 'Select...',
  options,
  error,
  icon,
}: SelectInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          {icon}
        </div>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white outline-none transition-all duration-300 appearance-none cursor-pointer ${
          error
            ? 'border-rose-500/50 focus:border-rose-400'
            : 'border-white/10 focus:border-cyan-500/50'
        }`}
      >
        <option value="" className="bg-onyx-deep">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-onyx-deep">
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
