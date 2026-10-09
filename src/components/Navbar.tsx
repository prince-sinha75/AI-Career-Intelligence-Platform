import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

const navItems = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar({
  onAnalyzeCareer,
  onLogin,
}: {
  onAnalyzeCareer: () => void;
  onLogin: () => void;
}) {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [loginOpen, setLoginOpen]     = useState(false);
  const [signUpOpen, setSignUpOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow = (loginOpen || signUpOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loginOpen, signUpOpen]);

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div
          className={`relative flex items-center justify-between w-full max-w-5xl px-4 md:px-6 py-2.5 rounded-full backdrop-blur-md border transition-all duration-500 ${
            scrolled
              ? 'bg-black/60 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-black/40 border-white/10'
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group z-10"
            onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full group-hover:bg-cyan-400/60 transition-all duration-500" />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Career<span className="text-cyan-400">IQ</span>
            </span>
          </a>

          {/* Desktop nav — absolutely centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 text-sm text-slate-300 hover:text-cyan-300 transition-colors duration-300 rounded-full hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2 z-10">
            <button
              onClick={() => setLoginOpen(true)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={onAnalyzeCareer}
              className="glow-button text-sm flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-glow" />
              Analyze Career
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-4 rounded-2xl backdrop-blur-xl bg-black/70 border border-white/10 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-slate-300 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                  className="px-4 py-2.5 text-sm text-slate-300 hover:text-white text-left transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileOpen(false); onAnalyzeCareer(); }}
                  className="glow-button text-sm justify-center flex"
                >
                  Analyze Career
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Login Modal */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => { setLoginOpen(false); onLogin(); }}
        onCreateAccount={openSignUp}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSignUpSuccess={() => { setSignUpOpen(false); onLogin(); }}
        onBackToLogin={openLogin}
      />
    </>
  );
}

// ─── Shared modal shell ───────────────────────────────────────────────────────

function ModalShell({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
              <div className="p-7">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Logo row used in both modals ─────────────────────────────────────────────

function ModalLogo() {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full" />
        <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <span className="font-display font-bold text-base text-white">
        Career<span className="text-cyan-400">IQ</span>
      </span>
    </div>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────

function LoginModal({
  open,
  onClose,
  onLoginSuccess,
  onCreateAccount,
}: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onCreateAccount: () => void;
}) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!open) { setEmail(''); setPassword(''); setShowPass(false); setLoading(false); setError(''); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim())                                    { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))       { setError('Please enter a valid email address.'); return; }
    if (!password)                                        { setError('Please enter your password.'); return; }
    if (password.length < 6)                              { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    setTimeout(() => { setLoading(false); onLoginSuccess(); }, 1400);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <ModalLogo />
          <h2 className="font-display font-bold text-xl text-white mt-3">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-0.5">Sign in to continue to your dashboard.</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Email">
          <IconInput icon={<Mail className="w-4 h-4" />}>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com" autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <FormField label="Password">
          <IconInput icon={<Lock className="w-4 h-4" />} trailing={
            <button type="button" onClick={() => setShowPass(p => !p)} className="text-slate-500 hover:text-slate-300 transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••" autoComplete="current-password"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <InlineError error={error} />

        <div className="flex justify-end">
          <button type="button" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors duration-300">Forgot password?</button>
        </div>

        <SubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
      </form>

      <Divider text="Don't have an account?" />

      <button
        onClick={onCreateAccount}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/50 transition-all duration-300"
      >
        Create Free Account
        <ArrowRight className="w-4 h-4" />
      </button>
    </ModalShell>
  );
}

// ─── Sign Up Modal ────────────────────────────────────────────────────────────

function SignUpModal({
  open,
  onClose,
  onSignUpSuccess,
  onBackToLogin,
}: {
  open: boolean;
  onClose: () => void;
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}) {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!open) { setName(''); setEmail(''); setPassword(''); setConfirm(''); setShowPass(false); setLoading(false); setError(''); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim())                                         { setError('Please enter your full name.'); return; }
    if (!email.trim())                                        { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))           { setError('Please enter a valid email address.'); return; }
    if (!password)                                            { setError('Please enter a password.'); return; }
    if (password.length < 6)                                  { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm)                                 { setError('Passwords do not match.'); return; }

    setLoading(true);
    setTimeout(() => { setLoading(false); onSignUpSuccess(); }, 1600);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <ModalLogo />
          <h2 className="font-display font-bold text-xl text-white mt-3">Create your account</h2>
          <p className="text-sm text-slate-500 mt-0.5">Start your AI-powered career journey today.</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Full Name">
          <IconInput icon={<User className="w-4 h-4" />}>
            <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Aarav Sharma" autoComplete="name"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <FormField label="Email">
          <IconInput icon={<Mail className="w-4 h-4" />}>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com" autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <FormField label="Password">
          <IconInput icon={<Lock className="w-4 h-4" />} trailing={
            <button type="button" onClick={() => setShowPass(p => !p)} className="text-slate-500 hover:text-slate-300 transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Min. 6 characters" autoComplete="new-password"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <FormField label="Confirm Password">
          <IconInput icon={<Lock className="w-4 h-4" />}>
            <input type={showPass ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(''); }}
              placeholder="Re-enter your password" autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300" />
          </IconInput>
        </FormField>

        <InlineError error={error} />

        <SubmitButton loading={loading} label="Create Account" loadingLabel="Creating account…" />
      </form>

      <Divider text="Already have an account?" />

      <button
        onClick={onBackToLogin}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:border-white/20 hover:text-white transition-all duration-300"
      >
        Sign In Instead
        <ArrowRight className="w-4 h-4" />
      </button>
    </ModalShell>
  );
}

// ─── Small shared primitives ──────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function IconInput({ icon, trailing, children }: { icon: React.ReactNode; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</div>
      {children}
      {trailing && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
  );
}

function InlineError({ error }: { error: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs text-rose-400 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full glow-button flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
      {loading ? (
        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingLabel}</>
      ) : (
        <>{label}<ArrowRight className="w-4 h-4" /></>
      )}
    </button>
  );
}

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-white/[0.08]" />
      <span className="text-xs text-slate-600">{text}</span>
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}
