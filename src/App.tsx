import React, { useState, useMemo, useEffect, useRef } from 'react';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const diasFiltro = ['Todos', ...diasSemana.slice(1, 6)]; // Lun-Vie
const colores = ['indigo', 'cyan', 'fuchsia', 'amber'];

const colorThemes = {
  indigo:  { border: 'border-indigo-500',  text: 'text-indigo-400',  glow: 'shadow-indigo-500/20',  badge: 'bg-indigo-500',  icon: 'text-indigo-400'  },
  cyan:    { border: 'border-cyan-400',    text: 'text-cyan-400',    glow: 'shadow-cyan-400/20',    badge: 'bg-cyan-400',    icon: 'text-cyan-400'    },
  fuchsia: { border: 'border-fuchsia-500', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20', badge: 'bg-fuchsia-500', icon: 'text-fuchsia-400' },
  amber:   { border: 'border-amber-400',   text: 'text-amber-400',   glow: 'shadow-amber-400/20',   badge: 'bg-amber-400',   icon: 'text-amber-400'   },
};

const clasesIniciales = [
  { id: 1, materia: 'Inteligencia Artificial', profesor: 'Dr. Alan Turing', sala: 'Lab 04 - Core', dia: 'Lunes', horario: '08:00 - 10:30', tipo: 'Teórica', color: 'indigo' },
  { id: 2, materia: 'Desarrollo Web Fullstack', profesor: 'Ing. Ada Lovelace', sala: 'Virtual Hub A', dia: 'Miércoles', horario: '11:00 - 13:00', tipo: 'Práctica', color: 'cyan' },
];

const STORAGE_KEY = 'academix-flow-clases';

export default function AcademiXFlow() {
  const [clases, setClases] = useState(() => {
    if (typeof window === 'undefined') return clasesIniciales;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : clasesIniciales;
    } catch { return clasesIniciales; }
  });
  const [busqueda, setBusqueda] = useState('');
  const [diaFiltro, setDiaFiltro] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horaActual, setHoraActual] = useState(new Date());

  // FIX: Cola de alertas en vez de un solo valor para no perder notificaciones simultáneas
  const [alertas, setAlertas] = useState([]);
  const alertasDisparadas = useRef(new Set());

  // FIX: Ref para evitar que el efecto de alertas se reinicie cada vez que cambia `clases`
  const clasesRef = useRef(clases);
  useEffect(() => { clasesRef.current = clases; }, [clases]);

  // Persistencia
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clases)); } catch {}
  }, [clases]);

  // FIX: Un solo intervalo de 1s que maneja tanto el reloj como las alertas (cada 15s)
  useEffect(() => {
    const checkAlertas = (ahora) => {
      const diaHoy = diasSemana[ahora.getDay()];
      const stampDia = ahora.toISOString().slice(0, 10);

      for (const clase of clasesRef.current) {
        if (clase.dia !== diaHoy) continue;
        const [horaInicio] = clase.horario.split(' - ');
        const [h, m] = horaInicio.split(':').map(Number);
        const fechaClase = new Date(ahora);
        fechaClase.setHours(h, m, 0, 0);
        const diffMin = Math.round((fechaClase - ahora) / 60000);
        const key = `${stampDia}-${clase.id}`;
        if (diffMin <= 5 && diffMin >= -1 && !alertasDisparadas.current.has(key)) {
          alertasDisparadas.current.add(key);
          setAlertas(prev => [...prev, clase.materia]);
        }
      }
    };

    const id = setInterval(() => {
      const ahora = new Date();
      setHoraActual(ahora);
      if (ahora.getSeconds() % 15 === 0) checkAlertas(ahora);
    }, 1000);

    // Ejecutar de inmediato al montar
    const ahora = new Date();
    setHoraActual(ahora);
    checkAlertas(ahora);

    return () => clearInterval(id);
  }, []); // Sin dependencias: no se reinicia nunca

  const clasesFiltradas = useMemo(() => clases.filter(c => (
    (c.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
     c.profesor.toLowerCase().includes(busqueda.toLowerCase())) &&
    (diaFiltro === 'Todos' || c.dia === diaFiltro)
  )), [clases, busqueda, diaFiltro]);

  const agregarClase = (nueva) => {
    setClases(prev => [...prev, { ...nueva, id: Date.now() }]);
    setModalAbierto(false);
  };

  const eliminarClase = (id) => setClases(prev => prev.filter(c => c.id !== id));

  // FIX: Cerrar la primera alerta de la cola al presionar ×
  const cerrarAlerta = () => setAlertas(prev => prev.slice(1));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* FIX: Notificación muestra la primera alerta de la cola */}
      {alertas.length > 0 && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/50 p-5 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center gap-5">
            <div className="relative">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <div className="text-4xl">🦫</div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Protocolo Capibara</p>
              <p className="text-sm font-bold text-white">Inicio en 5 min: {alertas[0]}</p>
              {alertas.length > 1 && (
                <p className="text-xs text-slate-400 mt-1">+{alertas.length - 1} alerta(s) más</p>
              )}
            </div>
            <button onClick={cerrarAlerta} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            AcademiX<span className="text-indigo-500 not-italic">Flow</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden lg:block text-right">
            <p className="text-xl font-mono font-bold text-white leading-none">
              {horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">
              {horaActual.toLocaleDateString('es-ES', { weekday: 'long' })}
            </p>
          </div>
          <button onClick={() => setModalAbierto(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-lg shadow-indigo-600/20">
            + Agregar clase
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tight mb-2">Terminal Académica</h2>
            <p className="text-slate-400 font-medium">Control central de flujo de asignaturas y laboratorios.</p>
          </div>
          <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            {diasFiltro.map(dia => (
              <button key={dia} onClick={() => setDiaFiltro(dia)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${diaFiltro === dia ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                {dia}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-12 relative group">
          <input type="text" placeholder="Filtrar por núcleo o docente..."
            className="w-full bg-slate-900/50 border border-slate-800 p-5 pl-14 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-600"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <svg className="w-6 h-6 absolute left-5 top-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        {clasesFiltradas.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500">No hay clases que coincidan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clasesFiltradas.map(clase => {
              const theme = colorThemes[clase.color] || colorThemes.indigo;
              return (
                <div key={clase.id} className={`group relative bg-slate-900 border ${theme.border} p-8 rounded-[2.5rem] transition-all hover:-translate-y-2 shadow-2xl ${theme.glow}`}>
                  <div className="flex justify-between items-start mb-8">
                    <span className={`${theme.badge} text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter`}>{clase.tipo}</span>
                    {/* FIX: aria-label con nombre de la clase para accesibilidad */}
                    <button onClick={() => eliminarClase(clase.id)} className="text-slate-600 hover:text-red-400 text-sm" aria-label={`Eliminar ${clase.materia}`}>✕</button>
                  </div>
                  <h3 className={`text-2xl font-black text-white mb-6 leading-[1.1] group-hover:${theme.text} transition-colors`}>{clase.materia}</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${theme.icon}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <span className="text-sm font-bold">{clase.profesor}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${theme.icon}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                      <span className="text-sm font-bold">{clase.sala}</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{clase.dia}</p>
                      <p className="text-lg font-mono font-bold text-white">{clase.horario}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalAbierto && <ModalNuevaClase onClose={() => setModalAbierto(false)} onSave={agregarClase} />}
    </div>
  );
}

function ModalNuevaClase({ onClose, onSave }) {
  const [form, setForm] = useState({
    materia: '', profesor: '', sala: '', dia: 'Lunes',
    horaInicio: '08:00', horaFin: '10:00', tipo: 'Teórica', color: 'indigo',
  });

  // FIX: Nombre descriptivo en vez de `set` genérico
  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.materia.trim()) return;

    // FIX: Validación de que horaFin sea posterior a horaInicio
    if (form.horaFin <= form.horaInicio) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    onSave({
      materia: form.materia.trim(),
      profesor: form.profesor.trim() || '—',
      sala: form.sala.trim() || '—',
      dia: form.dia,
      horario: `${form.horaInicio} - ${form.horaFin}`,
      tipo: form.tipo,
      color: form.color,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h3 className="text-2xl font-black text-white mb-2">Nueva clase</h3>
        <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="Materia" value={form.materia} onChange={e => updateField('materia', e.target.value)} required />
        <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="Profesor" value={form.profesor} onChange={e => updateField('profesor', e.target.value)} />
        <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="Sala" value={form.sala} onChange={e => updateField('sala', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <select className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" value={form.dia} onChange={e => updateField('dia', e.target.value)}>
            {diasSemana.slice(1).map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" value={form.tipo} onChange={e => updateField('tipo', e.target.value)}>
            <option>Teórica</option><option>Práctica</option><option>Laboratorio</option>
          </select>
          <input type="time" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" value={form.horaInicio} onChange={e => updateField('horaInicio', e.target.value)} />
          <input type="time" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" value={form.horaFin} onChange={e => updateField('horaFin', e.target.value)} />
        </div>
        <div className="flex gap-2">
          {colores.map(c => (
            <button type="button" key={c} onClick={() => updateField('color', c)}
              className={`h-9 w-9 rounded-full border-2 ${form.color === c ? 'border-white' : 'border-transparent'} ${colorThemes[c].badge}`} />
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-full text-slate-400 hover:text-white">Cancelar</button>
          <button type="submit" className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Guardar</button>
        </div>
      </form>
    </div>
  );
}