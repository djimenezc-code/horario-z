import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpen, 
  User, 
  Settings, 
  LayoutDashboard,
  Bell,
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for our schedule
interface ClassItem {
  id: string;
  name: string;
  room: string;
  professor: string;
  startTime: string;
  endTime: string;
  color: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const MOCK_CLASSES: ClassItem[] = [
  { id: '1', name: 'Cálculo Multivariable', room: 'Aula 402', professor: 'Dr. Sánchez', startTime: '08:00', endTime: '10:00', color: 'bg-blue-500' },
  { id: '2', name: 'Arquitectura de Software', room: 'Lab de Computación 2', professor: 'Ing. Martínez', startTime: '10:30', endTime: '12:30', color: 'bg-purple-500' },
  { id: '3', name: 'Inteligencia Artificial', room: 'Aula Magna', professor: 'Dra. López', startTime: '14:00', endTime: '16:00', color: 'bg-orange-500' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDay, setSelectedDay] = useState('Lunes');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col p-4">
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">UniSched</h1>
            <span className="text-xs opacity-50 uppercase tracking-widest font-semibold text-blue-400">Pro Edition</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<CalendarIcon size={20} />} 
            label="Mi Horario" 
            isActive={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')} 
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Mis Cursos" 
            isActive={activeTab === 'courses'} 
            onClick={() => setActiveTab('courses')} 
          />
          <NavItem 
            icon={<Bell size={20} />} 
            label="Notificaciones" 
            isActive={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Ajustes" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Perfil" 
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Buscar clases, cursos, profesores..." 
              className="bg-transparent border-none outline-none text-sm w-64 text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 uppercase tracking-tight">David Celis</p>
                <p className="text-xs text-slate-500">Ingeniería de Sistemas</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8 pt-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold text-slate-900 tracking-tight"
                >
                  ¡Hola de nuevo, David!
                </motion.h2>
                <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-bold">Resumen de tu jornada universitaria</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <Plus size={20} />
                <span>Agregar Clase</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Schedule Overview */}
              <div className="lg:col-span-8 space-y-6">
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CalendarIcon size={20} className="text-blue-500" />
                      <span>Calendario Semanal</span>
                    </h3>
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                      {DAYS.map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                            selectedDay === day 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {MOCK_CLASSES.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex items-center gap-6 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-slate-100 pr-6">
                          <span className="text-sm font-bold text-slate-800 tracking-tighter">{item.startTime}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{item.endTime}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                            <h4 className="font-bold text-slate-800 uppercase tracking-tight">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {item.professor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {item.room}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar Stats */}
              <div className="lg:col-span-4 space-y-6">
                <section className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4">Próximo Examen</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex flex-col items-center justify-center">
                          <span className="text-xs font-bold leading-none">MAY</span>
                          <span className="text-xl font-bold leading-none mt-1">12</span>
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">Sistemas Distribuidos</p>
                          <p className="text-xs opacity-60">Examen Parcial I</p>
                        </div>
                      </div>
                      <div className="bg-white/10 px-4 py-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-orange-400" />
                          <span className="text-xs font-bold">10:00 AM</span>
                        </div>
                        <button className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors">Ver Detalles</button>
                      </div>
                    </div>
                  </div>
                  {/* Abstract backdrop decorations */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Tareas Pendientes</h3>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">3 HOY</span>
                  </div>
                  <div className="space-y-4">
                    <TodoItem title="Lab de Redes" deadline="Hoy, 23:59" isCompleted={false} />
                    <TodoItem title="Ensayo de Ética Prof." deadline="Mañana" isCompleted={false} />
                    <TodoItem title="Investigación IA" deadline="15 Mayo" isCompleted={true} />
                  </div>
                </section>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10">
                    <h3 className="text-blue-900 font-bold mb-2">Mi Progreso Académico</h3>
                    <p className="text-blue-700/70 text-xs mb-4 leading-relaxed font-medium">Estás en el 85% de tu meta para este semestre. ¡Sigue así!</p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-full rounded-full w-[85%] relative">
                        <div className="absolute -right-1 -top-1 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm shadow-blue-500/40"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
        isActive 
          ? 'bg-slate-800 text-white font-bold' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>{icon}</span>
        <span className="text-sm font-medium tracking-tight font-sans">{label}</span>
      </div>
      {isActive && <ChevronRight size={14} className="text-blue-500" />}
    </button>
  );
}

function TodoItem({ title, deadline, isCompleted }: { title: string, deadline: string, isCompleted: boolean }) {
  return (
    <div className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${isCompleted ? 'opacity-50' : 'hover:bg-slate-50'}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
        isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-300 group-hover:border-blue-400'
      }`}>
        {isCompleted && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold tracking-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{title}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{deadline}</p>
      </div>
    </div>
  );
}
