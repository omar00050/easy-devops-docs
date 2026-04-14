"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Terminal,
  Check,
  Shield,
  Globe,
  Package,
  Zap,
  Database,
  Download,
  Palette,
  ChevronDown,
  Search,
  Wifi,
  Clipboard
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   Aurora Background (ReactBits Aurora pattern)
   ═══════════════════════════════════════════════════ */
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-aurora1" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-aurora2" />
      <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] bg-primary/15 rounded-full blur-[110px] animate-aurora1-delayed" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Particle Field
   ═══════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--color-primary-rgb), ${p.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
}

/* ═══════════════════════════════════════════════════
   Split Text Animation (ReactBits SplitText pattern)
   ═══════════════════════════════════════════════════ */
function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: wi * 0.15 + ci * 0.02 + 0.3,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Typewriter Terminal
   ═══════════════════════════════════════════════════ */
function TypewriterTerminal() {
  const lines = [
    { type: "command" as const, segments: [{ text: "$ ", color: "text-green-400" }, { text: "npm install -g ", color: "text-[#e6edf3]" }, { text: "easy-devops", color: "text-[#d2a8ff]" }] },
    { type: "comment" as const, text: "Installs globally, registers easy-devops command" },
    { type: "blank" as const },
    { type: "command" as const, segments: [{ text: "$ ", color: "text-green-400" }, { text: "easy-devops", color: "text-[#e6edf3]" }] },
    { type: "comment" as const, text: "Interactive CLI launches ✓" },
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const line = lines[currentLine];
    if (!line) return;

    if (line.type === "comment" || line.type === "blank") {
      if (currentLine === lines.length - 1) { setDone(true); return; }
      const t = setTimeout(() => setCurrentLine((p) => p + 1), 400);
      return () => clearTimeout(t);
    }

    const fullText = line.segments.reduce((a, s) => a + s.text, "");
    if (charIndex < fullText.length) {
      const t = setTimeout(() => setCharIndex((p) => p + 1), 35 + Math.random() * 50);
      return () => clearTimeout(t);
    } else {
      if (currentLine === lines.length - 1) {
        setDone(true);
        return;
      }
      const t = setTimeout(() => {
        setCurrentLine((p) => p + 1);
        setCharIndex(0);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [currentLine, charIndex, done]);

  const currentLineData = lines[currentLine];
  if (!currentLineData) return null;

  return (
    <div className="bg-[#0d1117] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl max-w-[560px] mx-auto">
      <div className="flex items-center gap-2 px-5 py-3.5 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center text-[12px] text-[#8b949e] font-mono">terminal</span>
      </div>
      <div className="p-5 font-mono text-sm leading-[1.8] text-[#e6edf3] min-h-[160px]">
        {lines.map((line, li) => {
          if (li > currentLine) return null;

          if (line.type === "blank") {
            return <div key={li} style={{ height: 16 }} />;
          }

          if (line.type === "comment") {
            return (
              <motion.div key={li} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#8b949e] text-xs mt-1">
                {"> "} {line.text}
              </motion.div>
            );
          }

          const fullText = line.segments.reduce((a, s) => a + s.text, "");
          const visibleCount = li === currentLine ? charIndex : fullText.length;
          let acc = "";
          const segments: { text: string; colorClass: string }[] = [];

          for (const seg of line.segments) {
            if (acc.length + seg.text.length <= visibleCount) {
              segments.push({ text: seg.text, colorClass: seg.color });
              acc += seg.text;
            } else {
              const remaining = visibleCount - acc.length;
              segments.push({ text: seg.text.slice(0, remaining), colorClass: seg.color });
              acc = fullText;
              break;
            }
          }

          return (
            <div key={li}>
              {segments.map((s, si) => (
                <span key={si} className={s.colorClass}>{s.text}</span>
              ))}
              {li === currentLine && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-[#e6edf3] -mb-0.5 ml-[1px] align-middle"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Tilt Card (ReactBits TiltCard pattern)
   ═══════════════════════════════════════════════════ */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    setStyle({ transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)` });
  };

  const onMouseLeave = () => setStyle({ transform: "perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)" });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: "transform 150ms ease-out", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   Scroll Reveal
   ═══════════════════════════════════════════════════ */
function ScrollReveal({ children, className, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   Morphing Text
   ═══════════════════════════════════════════════════ */
const featureWords = ["Nginx", "SSL/TLS", "Domains", "Node.js", "Production"];

function MorphingText() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % featureWords.length), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block min-w-[120px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={featureWords[idx]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-primary inline-block"
        >
          {featureWords[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════ */
const features = [
  { icon: <Globe className="w-5 h-5" />, title: "Nginx Management", desc: "Start, stop, reload, and view error logs. Built-in config editor. Automatic installation via apt-get or winget." },
  { icon: <Shield className="w-5 h-5" />, title: "SSL Certificates", desc: "Let's Encrypt via acme-client. HTTP-01, DNS-01, wildcard certs, expiry tracking with color-coded badges." },
  { icon: <Wifi className="w-5 h-5" />, title: "Domain Management", desc: "Reverse proxy configs with SSL, external URLs, wildcards, WebSocket, gzip, rate limiting, security headers." },
  { icon: <Package className="w-5 h-5" />, title: "Node.js Manager", desc: "Switch versions via nvm/nvm-windows. Install/uninstall global packages. Update npm automatically." },
  { icon: <Zap className="w-5 h-5" />, title: "Real-time Updates", desc: "Socket.io powered status updates. Nginx status streams live in the dashboard." },
  { icon: <Database className="w-5 h-5" />, title: "SQLite Storage", desc: "Persistent config in a single SQLite file. No separate database server needed." },
  { icon: <Download className="w-5 h-5" />, title: "Bootstrap Installer", desc: "One-line installers for Linux and Windows. Auto-detects Node.js, installs nvm if needed." },
  { icon: <Palette className="w-5 h-5" />, title: "Themed Dashboard", desc: "Dark and light modes with 5 accent colors. Settings persist in localStorage." },
];

const faqItems = [
  { q: '"easy-devops: command not found" after install?', a: "Open a new terminal so the PATH can update. If it still fails, run npm bin -g and add the output directory to your PATH. Linux users may need to prefix install commands with sudo." },
  { q: "How do I change the dashboard password?", a: "From the CLI, select Settings → set a new password. This updates dashboardPassword in the SQLite database and takes effect immediately." },
  { q: "SSL issuance fails with a 'port 80 in use' error.", a: "HTTP-01 validation requires exclusive access to port 80. Stop nginx before issuing a certificate, then retry. Alternatively, use DNS-01 which does not require stopping nginx." },
  { q: "What is acmeEmail and why is it required?", a: "The acmeEmail setting registers your ACME account with Let's Encrypt. It is required for certificate issuance — Let's Encrypt uses it to send expiry notifications and account recovery." },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.78 0 12.31c0 5.21 3.43 9.64 8.2 11.2.6.11.82-.26.82-.57v-2.23c-3.34.72-4.04-1.59-4.04-1.59-.55-1.37-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.23-3.17-.12-.3-.53-1.5.12-3.12 0 0 1-.32 3.3 1.21a11.5 11.5 0 0 1 6.02 0c2.28-1.53 3.29-1.21 3.29-1.21.66 1.62.25 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.54-2.81 5.53-5.48 5.83.43.37.82 1.09.82 2.2v3.25c0 .31.22.69.82.57C20.57 21.94 24 17.52 24 12.31 24 5.78 18.63.5 12 .5z"/>
    </svg>
  );
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Aurora + Particles (behind hero) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AuroraBackground />
        <ParticleField />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center text-center px-4 pt-16">
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-sm text-muted mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            v1.2.1 — Open Source
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[72px] font-black tracking-tight leading-[1.05] mb-5">
            <SplitText text="DevOps, Made" /> <br />
            <span style={{
              background: 'linear-gradient(to right, var(--color-primary), rgba(var(--color-primary-rgb), 0.7))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block',
              transform: 'translateZ(0)',
            }}>Simple.</span>
          </h1>

          {/* Subtitle with morphing text */}
          <p className="text-base sm:text-lg md:text-xl text-muted max-w-[520px] mx-auto mb-8 leading-relaxed">
            Manage <MorphingText />, and more from a single interactive CLI — or a modern web dashboard.
          </p>

          {/* CTAs — Glowing Button style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link
              href="/docs/installation"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold  rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(var(--color-primary-rgb),0.35)] hover:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_24px_rgba(var(--color-primary-rgb),0.5)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://github.com/omar00050/Easy-DevOps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-foreground bg-surface border border-border rounded-xl hover:bg-primary/[0.04] hover:border-primary transition-all duration-200"
            >
              <GitHubIcon className="w-4 h-4" />
              View on GitHub
            </a>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <TypewriterTerminal />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="mt-12"
          >
            <a href="#features-section" className="text-muted hover:text-primary transition-colors">
              <ChevronDown className="w-6 h-6 animate-bounce mx-auto" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features-section" className="relative z-10 py-28 px-4">
        <ScrollReveal className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Capabilities</div>
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight mb-4">Features</h2>
            <p className="text-muted text-base max-w-[560px] mx-auto">Everything you need to manage a production web server from one tool.</p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <TiltCard className="h-full">
                <div className="h-full bg-surface border border-border rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.08] group">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="w-11 h-11 rounded-xl bg-primary/[0.12] border border-primary/[0.15] flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-2">{f.title}</h3>
                  <p className="text-[13px] text-muted leading-relaxed">{f.desc}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative z-10 py-28 px-4 bg-primary/[0.015]">
        <ScrollReveal className="max-w-4xl mx-auto text-center mb-16">
          <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">How it works</div>
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight mb-4">Three steps to production</h2>
          <p className="text-muted text-base max-w-[480px] mx-auto">Get from zero to a working server with HTTPS in minutes.</p>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-0">
          {[
            { step: "1", label: "Install", desc: "One command to install Easy DevOps globally. The bootstrap installer handles Node.js for you." },
            { step: "2", label: "Configure", desc: "Set your directories, ACME email, and dashboard password in the interactive Settings menu." },
            { step: "3", label: "Manage", desc: "Add domains, issue SSL certs, start nginx — all from the CLI or the web dashboard." },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 text-sm rounded-xl bg-gradient-to-br from-primary to-primary/80 text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    {s.step}
                  </div>
                  {i < 2 && <div className="w-[2px] h-16 bg-primary/20 my-2" />}
                </div>
                <div className="pb-12">
                  <h3 className="text-lg font-bold mb-1">{s.label}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ PLATFORM SUPPORT ═══ */}
      <section id="platforms" className="relative z-10 py-28 px-4">
        <ScrollReveal className="max-w-4xl mx-auto text-center mb-14">
          <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Compatibility</div>
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight mb-4">Works where you work</h2>
          <p className="text-muted text-base max-w-[480px] mx-auto">Full support on both Linux and Windows servers.</p>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScrollReveal delay={0.1}>
            <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="text-3xl mb-4">🐧</div>
              <h3 className="text-lg font-bold mb-3">Linux</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  ["CLI & Dashboard", true],
                  ["Nginx management", true],
                  ["SSL HTTP-01 & DNS-01", true],
                  ["Wildcard certs", true],
                  ["Node.js via nvm", true],
                  ["systemctl service control", true],
                ].map(([feat, ok], i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="text-3xl mb-4">🪟</div>
              <h3 className="text-lg font-bold mb-3">Windows</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  ["CLI & Dashboard", true],
                  ["Nginx management", true],
                  ["SSL HTTP-01 & DNS-01", true],
                  ["Wildcard certs", true],
                  ["Node.js via nvm-windows", true],
                  ["nginx.exe direct control", true],
                ].map(([feat, ok], i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FAQ PREVIEW ═══ */}
      <section id="faq-home" className="relative z-10 py-28 px-4 bg-primary/[0.015]">
        <ScrollReveal className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Help</div>
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} delay={i * 0.1} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/docs/faq" className="text-sm font-medium text-primary hover:underline">
              View all questions →
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
          <div className="relative z-10 text-center p-12">
            <h2 className="text-2xl md:text-4xl font-extrabold  mb-4">Ready to simplify your DevOps?</h2>
            <p className="/70 mb-8 text-sm text-muted md:text-base">Start managing Nginx, SSL, and domains in minutes.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="relative">
                <code className="text-sm bg-black/20  px-4 py-2.5 rounded-lg font-mono">npm install -g easy-devops</code>
                <button
                  onClick={() => { navigator.clipboard.writeText("npm install -g easy-devops"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="absolute -right-1 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
              <Link href="/docs/overview" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm">
                Read the Docs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-border py-10 px-4 text-center text-sm text-muted">
        <div className="flex flex-wrap items-center justify-center gap-5 mb-4">
          <a href="https://github.com/omar00050/Easy-DevOps" target="_blank" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="https://github.com/omar00050/Easy-DevOps/issues" target="_blank" className="hover:text-foreground transition-colors">Issues</a>
          <a href="https://github.com/omar00050/Easy-DevOps/blob/main/CHANGELOG.md" target="_blank" className="hover:text-foreground transition-colors">Changelog</a>
          <a href="https://github.com/omar00050/Easy-DevOps/blob/main/LICENSE" target="_blank" className="hover:text-foreground transition-colors">MIT License</a>
          <a href="https://github.com/omar00050/Easy-DevOps/blob/main/README.md" target="_blank" className="hover:text-foreground transition-colors">README</a>
        </div>
        <p>
          Built with ♥ by{" "}
          <a href="https://farghaly.dev" target="_blank" className="text-primary hover:underline">
            Omar Farghaly
          </a>{" "}
          · Licensed under{" "}
          <a href="https://opensource.org/licenses/MIT" target="_blank" className="text-primary hover:underline">
            MIT
          </a>
        </p>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-foreground hover:text-primary transition-colors text-left">
          <span>{question}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-sm text-muted leading-relaxed">{answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}
