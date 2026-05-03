import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- CONFIGURACIÓN & ESTILOS ---
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const diasFiltro = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const colores = ['indigo', 'cyan', 'fuchsia', 'amber'];

const colorThemes = {
  indigo:  { 
    border: 'border-indigo-500/50', 
    text: 'text-indigo-400', 
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.2)]', 
    badge: 'bg-indigo-500', 
    gradient: 'from-indigo-500/10 to-transparent' 
  },
  cyan: { 
    border: 'border-cyan-400/50', 
    text: 'text-cyan-400', 
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]', 
    badge: 'bg-cyan-400', 
    gradient: 'from-cyan-400/10 to-transparent' 
  },
  fuchsia: { 
    border: 'border-fuchsia-500/50', 
    text: 'text-fuchsia-400', 
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.2)]', 
    badge: 'bg-fuchsia-500', 
    gradient: 'from-fuchsia-500/10 to-transparent' 
  },
  amber: { 
    border: 'border-amber-400/50', 
    text: 'text-amber-400', 
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]', 
    badge: 'bg-amber-400', 
    gradient: 'from-amber-400/10 to-transparent' 
  },
};

const STORAGE_KEY = 'academix-neural-flow';

export default function AcademiXFlow() {
  const [clases, setClases] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [busqueda, setBusqueda] = useState('');
  const [diaFiltro, setDiaFiltro] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horaActual, setHoraActual] = useState(new Date());
  const [alertas, setAlertas] = useState([]);
  const alertasDisparadas = useRef(new Set());

  // Persistencia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clases));
  }, [clases]);

  // Loop de tiempo y alertas
  useEffect(() => {
    const timer = setInterval(() => {
      const ahora = new Date();
      setHoraActual(ahora);
      
      // Lógica de Alerta Capibara (Chequeo cada minuto exacto)
      if (ahora.getSeconds() === 0) {
        const diaHoy = diasSemana[ahora.getDay()];
        clases.forEach(clase => {
          if (clase.dia === diaHoy) {
            const [h, m] = clase.horario.split(' - ')[0].split(':').map(Number);
            const diff = (new Date(ahora).setHours(h, m, 0, 0) - ahora) / 60000;
            const key = `${ahora.toDateString()}-${clase.id}`;
            if (diff <= 5 && diff > 0 && !alertasDisparadas.current.has(key)) {
              alertasDisparadas.current.add(key);
              setAlertas(prev => [...prev, clase.materia]);
            }
          }
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clases]);

  const clasesFiltradas = useMemo(() => clases.filter(c => (
    (c.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
     c.profesor.toLowerCase().includes(busqueda.toLowerCase())) &&
    (diaFiltro === 'Todos' || c.dia === diaFiltro)
  )), [clases, busqueda, diaFiltro]);

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-sans overflow-x-hidden relative">
      
      {/* --- FONDO CINÉTICO --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-fuchsia-900/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* --- NOTIFICACIONES --- */}
      <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4">
        {alertas.map((msg, i) => (
          <div key={i} className="bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500">
            <span className="text-3xl">🦫</span>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocolo Activo</p>
              <p className="text-sm font-bold text-white">Clase en 5 min: {msg}</p>
            </div>
            <button onClick={() => setAlertas(prev => prev.filter((_, idx) => idx !== i))} className="ml-4 text-slate-500 hover:text-white">×</button>
          </div>
        ))}
      </div>

      {/* --- NAVEGACIÓN --- */}
      <nav className="sticky top-0 z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4 group">
          <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:rotate-6 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">AcademiX<span className="text-indigo-500 not-italic">Flow</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Neural Interface v3.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-2xl font-mono font-black text-white tracking-tighter leading-none">
              {horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">{horaActual.toLocaleDateString('es-ES', { weekday: 'long' })}</p>
          </div>
          <button onClick={() => setModalAbierto(true)} className="relative group overflow-hidden bg-white text-black px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            <span className="relative z-10">+ New Module</span>
            <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 relative">
        
        {/* --- DASHBOARD STATS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Módulos', val: clases.length, color: 'text-indigo-400' },
            { label: 'Carga Semanal', val: `${clases.length * 2}h`, color: 'text-cyan-400' },
            { label: 'Estado Sistema', val: 'Online', color: 'text-emerald-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </section>

        {/* --- FILTROS --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <div className="relative w-full max-w-xl group">
            <input 
              type="text" 
              placeholder="Deep search: Materia o Docente..." 
              className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-3xl focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600 focus:bg-white/10"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <svg className="w-6 h-6 absolute left-5 top-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 overflow-x-auto max-w-full">
            {diasFiltro.map(dia => (
              <button 
                key={dia} 
                onClick={() => setDiaFiltro(dia)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${diaFiltro === dia ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID DE MÓDULOS --- */}
        {clasesFiltradas.length === 0 ? (
          <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            <div className="text-5xl mb-4 opacity-20">📡</div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No se detectan señales en este cuadrante</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {clasesFiltradas.map(clase => {
              const theme = colorThemes[clase.color] || colorThemes.indigo;
              return (
                <div 
                  key={clase.id} 
                  className={`group relative bg-gradient-to-br ${theme.gradient} bg-slate-900 border ${theme.border} p-10 rounded-[3rem] transition-all hover:-translate-y-3 shadow-2xl ${theme.glow}`}
                >
                  <div className="flex justify-between items-start mb-10">
                    <span className={`${theme.badge} text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em]`}>
                      {clase.tipo}
                    </span>
                    <button 
                      onClick={() => setClases(prev => prev.filter(c => c.id !== clase.id))} 
                      className="h-10 w-10 flex items-center justify-center rounded-full border border-white/5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-8 leading-[1.1] tracking-tight group-hover:text-white transition-colors uppercase italic">
                    {clase.materia}
                  </h3>

                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">👤</div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Docente Titular</p>
                        <p className="text-sm font-bold text-slate-200">{clase.profesor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">📍</div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coordenadas</p>
                        <p className="text-sm font-bold text-slate-200">{clase.sala}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{clase.dia}</p>
                      <p className="text-2xl font-mono font-black text-white tracking-tighter">{clase.horario}</p>
                    </div>
                    <div className={`h-14 w-14 rounded-3xl ${theme.badge} flex items-center justify-center text-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- MODAL NEURAL FORM --- */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#050810]/95 backdrop-blur-md" onClick={() => setModalAbierto(false)} />
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.target);
              const nueva = {
                id: Date.now(),
                materia: d.get('materia'),
                profesor: d.get('profesor') || 'N/A',
                sala: d.get('sala') || 'TBD',
                dia: d.get('dia'),
                horario: `${d.get('hI')} - ${d.get('hF')}`,
                tipo: d.get('tipo'),
                color: d.get('color')
              };
              setClases(prev => [...prev, nueva]);
              setModalAbierto(false);
            }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-4xl font-black text-white mb-10 tracking-tighter uppercase italic">Inject Module</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Materia *</label>
                <input name="materia" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Docente</label>
                <input name="profesor" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Día</label>
                <select name="dia" className="w-full bg-slate-800 border border-white/10 p-4 rounded-2xl outline-none text-white appearance-none">
                  {diasSemana.slice(1).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ubicación</label>
                <input name="sala" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white" />
              </div>
              <div className="flex gap-4">
                <input type="time" name="hI" defaultValue="08:00" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-white" />
                <input type="time" name="hF" defaultValue="10:00" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual ID</label>
                <div className="flex gap-3">
                  {colores.map(c => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="color" value={c} defaultChecked={c === 'indigo'} className="hidden peer" />
                      <div className={`h-10 w-10 rounded-xl ${colorThemes[c].badge} border-4 border-transparent peer-checked:border-white transition-all`} />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Abort</button>
              <button type="submit" className="flex-[2] bg-indigo-600 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">Initialize Module</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}