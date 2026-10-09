import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';

// Brand icons removed from lucide-react — using inline SVGs
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function CtaFooter({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <>
      {/* CTA Banner */}
      <section id="pricing" className="relative py-24 md:py-32 section-padding">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-3xl rounded-full" />

          <div className="relative glass-card overflow-hidden p-10 md:p-16 text-center">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

            {/* Terminal-style top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-black/20">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] font-mono text-slate-600 ml-2">
                careeriq@engine:~$
              </span>
            </div>

            <div className="relative pt-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display font-bold text-2xl md:text-4xl lg:text-5xl gradient-text mb-4 text-balance"
              >
                Bridge the gap between your MCA degree and top-tier tech
                placements.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-slate-400 max-w-xl mx-auto mb-8"
              >
                Start free. Upload your resume and get a full career readiness
                report in under 60 seconds. No credit card required.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center"
              >
                <button onClick={onGetStarted} className="glow-button flex items-center gap-2 group text-base px-8 py-3.5">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6 justify-center flex-wrap">
                {[
                  'No credit card',
                  '60-second setup',
                  'Cancel anytime',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-xs text-slate-500"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 mt-12">
        <div className="section-padding py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 blur-md rounded-full" />
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Career<span className="text-cyan-400">IQ</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {['Capabilities', 'How It Works', 'Roadmap', 'Roles', 'Pricing'].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-slate-500 hover:text-cyan-300 transition-colors duration-300"
                  >
                    {link}
                  </a>
                )
              )}
            </div>

            {/* Status + socials */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-medium">
                  All Systems Operational
                </span>
              </div>
              <div className="flex items-center gap-3">
                {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © 2026 CareerIQ Intelligence Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Security', 'Status'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
