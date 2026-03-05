import { useState, useEffect, useRef } from 'react';

// Particle star component
const ParticleField = () => {
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: Math.random() * 0.8 + 0.2,
            boxShadow: `0 0 ${p.size * 2}px rgba(168, 85, 247, 0.5)`,
          }}
        />
      ))}
    </div>
  );
};

// Circuit pattern SVG
const CircuitPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M10 10h80v80h-80z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
        <circle cx="10" cy="10" r="2" fill="currentColor" className="text-purple-500"/>
        <circle cx="90" cy="10" r="2" fill="currentColor" className="text-purple-500"/>
        <circle cx="10" cy="90" r="2" fill="currentColor" className="text-purple-500"/>
        <circle cx="90" cy="90" r="2" fill="currentColor" className="text-purple-500"/>
        <path d="M50 10v30M10 50h30M90 50h-30M50 90v-30" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
        <circle cx="50" cy="40" r="3" fill="currentColor" className="text-pink-500"/>
        <circle cx="40" cy="50" r="3" fill="currentColor" className="text-pink-500"/>
        <circle cx="60" cy="50" r="3" fill="currentColor" className="text-pink-500"/>
        <circle cx="50" cy="60" r="3" fill="currentColor" className="text-pink-500"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit)"/>
  </svg>
);

// Glowing brain visualization
const BrainVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);
      time += 0.02;

      // Draw neural connections
      const centerX = w / 2;
      const centerY = h / 2;
      const nodes: { x: number; y: number }[] = [];

      // Generate brain-shaped nodes
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const radiusX = 80 + Math.sin(angle * 3 + time) * 15;
        const radiusY = 60 + Math.cos(angle * 2 + time) * 10;
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;
        nodes.push({ x, y });
      }

      // Inner nodes
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2 + time * 0.5;
        const radius = 40 + Math.sin(time + i) * 10;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        nodes.push({ x, y });
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other) => {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw electric pulses
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const idx1 = Math.floor((time * 3 + i * 7) % nodes.length);
        const idx2 = Math.floor((time * 2 + i * 11) % nodes.length);
        const n1 = nodes[idx1];
        const n2 = nodes[idx2];

        const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
        gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.9)');
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        const midX = (n1.x + n2.x) / 2 + Math.sin(time * 5 + i) * 20;
        const midY = (n1.y + n2.y) / 2 + Math.cos(time * 5 + i) * 20;
        ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
        ctx.stroke();
      }

      // Draw nodes with glow
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        glow.addColorStop(0, `rgba(168, 85, 247, ${0.8 + pulse * 0.2})`);
        glow.addColorStop(0.5, `rgba(236, 72, 153, ${0.4 + pulse * 0.3})`);
        glow.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 opacity-30 blur-xl animate-pulse" />

      {/* Helmet frame */}
      <div className="absolute inset-2 md:inset-4 rounded-full border-4 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.5),inset_0_0_30px_rgba(168,85,247,0.3)]" />

      {/* Glass effect */}
      <div className="absolute inset-4 md:inset-6 rounded-full bg-gradient-to-br from-purple-900/40 via-transparent to-cyan-900/40 backdrop-blur-sm" />

      {/* Brain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-4 md:inset-6 rounded-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Helmet shine */}
      <div className="absolute top-4 left-1/4 w-1/3 h-8 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm" />
    </div>
  );
};

// Stat card component
const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="group relative p-4 md:p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/0 to-purple-500/0 group-hover:from-cyan-400/10 group-hover:to-purple-500/10 transition-all duration-300" />
    <div className="relative">
      <span className="text-2xl md:text-3xl">{icon}</span>
      <div className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs md:text-sm text-purple-300/70 uppercase tracking-wider mt-1">{label}</div>
    </div>
  </div>
);

// Feature item
const FeatureItem = ({ title, description, delay }: { title: string; description: string; delay: number }) => (
  <div
    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-2 h-2 md:w-3 md:h-3 mt-1.5 md:mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
    <div>
      <h3 className="font-semibold text-white text-sm md:text-base">{title}</h3>
      <p className="text-purple-300/60 text-xs md:text-sm mt-1">{description}</p>
    </div>
  </div>
);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setPulseCount(p => p + Math.floor(Math.random() * 100) + 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden relative">
      {/* Background layers */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950/50 via-purple-950/30 to-[#050510]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)]" />
      <ParticleField />
      <CircuitPattern />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero section */}
        <header className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top badge */}
          <div className="mb-6 md:mb-8 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-xs md:text-sm tracking-widest uppercase animate-pulse">
            Neural Interface Active
          </div>

          {/* Brain visualization */}
          <div className="relative">
            <BrainVisualization />

            {/* Robot body hint */}
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-24 md:w-32 h-12 md:h-16 bg-gradient-to-b from-purple-600/50 to-transparent rounded-t-3xl border-t-2 border-x-2 border-purple-500/50" />
          </div>

          {/* Title */}
          <h1 className="mt-8 md:mt-12 text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-center">
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              NEURO
            </span>
            <span className="block text-2xl md:text-4xl lg:text-5xl mt-1 md:mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SYNTHETIC INTELLIGENCE
            </span>
          </h1>

          <p className="mt-4 md:mt-6 max-w-xl text-center text-purple-300/70 text-sm md:text-base lg:text-lg px-4">
            Advanced neural network processing unit. Quantum-enhanced cognitive architecture
            with real-time synaptic visualization.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md px-4">
            <button className="flex-1 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm md:text-base tracking-wide hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 active:scale-95">
              INITIALIZE
            </button>
            <button className="flex-1 px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-cyan-400/50 text-cyan-400 font-bold text-sm md:text-base tracking-wide hover:bg-cyan-400/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
              LEARN MORE
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-purple-400/50 text-xs tracking-widest">SCROLL</span>
            <div className="w-6 h-10 rounded-full border-2 border-purple-400/30 flex justify-center">
              <div className="w-1 h-2 mt-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* Stats section */}
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mb-8 md:mb-12 text-purple-300">
              SYSTEM METRICS
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <StatCard icon="🧠" value={`${(pulseCount * 1.5).toLocaleString()}`} label="Neural Pulses" />
              <StatCard icon="⚡" value="99.97%" label="Sync Rate" />
              <StatCard icon="🔮" value="∞" label="Processing" />
              <StatCard icon="💫" value="ACTIVE" label="Quantum Core" />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mb-8 md:mb-12 text-purple-300">
              CORE CAPABILITIES
            </h2>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <FeatureItem
                title="Quantum Neural Processing"
                description="Parallel computation across infinite probability states"
                delay={0}
              />
              <FeatureItem
                title="Synaptic Visualization"
                description="Real-time neural pathway mapping and optimization"
                delay={100}
              />
              <FeatureItem
                title="Adaptive Learning Matrix"
                description="Self-evolving cognitive architecture"
                delay={200}
              />
              <FeatureItem
                title="Holographic Interface"
                description="Immersive 3D data representation system"
                delay={300}
              />
              <FeatureItem
                title="Temporal Analytics"
                description="Predictive modeling with quantum coherence"
                delay={400}
              />
              <FeatureItem
                title="Bio-Electric Sync"
                description="Seamless human-machine neural bridging"
                delay={500}
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-24 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full border border-pink-500/30 text-pink-400 text-xs mb-4 md:mb-6">
              BETA ACCESS AVAILABLE
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              READY TO EVOLVE?
            </h2>
            <p className="mt-3 md:mt-4 text-purple-300/60 text-sm md:text-base">
              Join the neural network. Become part of the collective intelligence.
            </p>
            <button className="mt-6 md:mt-8 px-8 md:px-12 py-3 md:py-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-sm md:text-base tracking-wider hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] transition-all duration-300 hover:scale-110 active:scale-95">
              CONNECT NOW
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 md:py-8 border-t border-purple-500/10">
          <div className="text-center text-purple-400/40 text-xs md:text-sm">
            Requested by @neuroaibase · Built by @clonkbot
          </div>
        </footer>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default App;
