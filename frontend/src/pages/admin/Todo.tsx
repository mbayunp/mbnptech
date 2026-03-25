// src/pages/admin/Todo.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaCheckCircle, FaClock, FaTimes, FaTasks,
  FaPlus, FaPlay, FaPause, FaStop, FaArrowRight, FaTrash
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { API_URL } from '../../config/api';

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'Low' | 'Medium' | 'High';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  targetPomo: number;
  completedPomo: number;
  deadline: string;
}

const Todo = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // TARIK STATE POMODORO DARI ADMINLAYOUT
  const { 
    timerMode, timeLeft, isActive, activeTaskId, 
    setActiveTaskId, switchMode, toggleTimer, handleTimerComplete 
  } = useOutletContext<any>();

  const fetchTodoData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API_URL}/api/todos`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token'); navigate('/login'); return;
      }

      if (result.success) {
        setTasks(result.data.tasks);
        setChartData(result.data.chartData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoData();
    window.addEventListener('pomodoro-completed', fetchTodoData);
    return () => window.removeEventListener('pomodoro-completed', fetchTodoData);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // KALKULASI PROGRESS BAR (NORMAL TIME)
  // ==========================================
  const totalTimeForMode = timerMode === 'focus' ? 25 * 60 : timerMode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const timerPercent = ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100;

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newTask = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLInputElement).value,
      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
      deadline: (form.elements.namedItem('deadline') as HTMLInputElement).value,
      targetPomo: parseInt((form.elements.namedItem('pomo') as HTMLInputElement).value)
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/todos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newTask)
      });
      if (res.ok) {
        form.reset(); fetchTodoData();
        Swal.fire({ icon: 'success', title: 'Task Ditambahkan', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      }
    } catch (err) { Swal.fire('Error', 'Gagal menambah task', 'error'); }
  };

  const moveTask = async (id: string, newStatus: TaskStatus) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: newStatus })
      });
    } catch (err) { fetchTodoData(); }
  };

  const deleteTask = async (id: string) => {
    const result = await Swal.fire({ title: 'Hapus Task?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (activeTaskId === id) {
          setActiveTaskId(null);
          localStorage.removeItem('pomo_activeTaskId');
        }
        fetchTodoData();
      } catch (err) { Swal.fire('Error', 'Gagal menghapus task', 'error'); }
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div></div>;

  return (
    <div className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20 px-4 md:px-0 selection:bg-blue-100">
      
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">To Do & Focus</h2>
        <p className="mt-1 text-sm text-slate-500">Manajemen tugas dan waktu fokus ala Pomodoro.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Task", val: tasks.length, icon: <FaTasks />, color: "blue" },
          { title: "Task Selesai", val: tasks.filter(t => t.status === 'done').length, icon: <FaCheckCircle />, color: "emerald" },
          { title: "Task Pending", val: tasks.filter(t => t.status !== 'done').length, icon: <FaClock />, color: "amber" },
          { title: "Sesi Fokus", val: `${tasks.reduce((acc, t) => acc + (t.completedPomo || 0), 0)} Pomo`, icon: <FaTimes />, color: "red" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-2xl`}><div className={`text-${item.color}-600`}>{item.icon}</div></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</p>
              <h4 className="text-xl font-black text-slate-800">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 mb-8 bg-white border shadow-sm rounded-2xl border-slate-100">
        <h3 className="mb-4 font-black text-md text-slate-800">⚡ Quick Add Task</h3>
        <form onSubmit={handleAddTask} className="grid items-end grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Judul Task</label>
            <input name="title" required type="text" placeholder="Misal: Belajar React Query..." className="w-full p-2.5 mt-1 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm font-bold" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
            <input name="category" required list="catList" placeholder="Kategori" className="w-full p-2.5 mt-1 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm" />
            <datalist id="catList"><option value="Kerja" /><option value="Coding" /><option value="Belajar" /><option value="Project" /><option value="Pribadi" /></datalist>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Prioritas</label>
            <select name="priority" className="w-full p-2.5 mt-1 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm font-bold">
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Pomo</label>
              <input name="pomo" type="number" required min="1" max="10" defaultValue="1" className="w-full p-2.5 mt-1 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm font-black text-center" />
            </div>
            <div className="w-1/2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label>
              <input name="deadline" type="date" required className="w-full p-2.5 mt-1 rounded-xl border border-slate-200 bg-slate-50 outline-none text-xs" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex justify-center items-center gap-2">
            <FaPlus /> Tambah
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <h3 className="mb-4 text-lg font-black text-slate-800">🗂️ Task Board</h3>
          <div className="grid flex-1 grid-cols-3 gap-4 overflow-hidden">
            {['todo', 'in_progress', 'done'].map((col) => (
              <div key={col} className={`p-3 rounded-xl flex flex-col gap-3 overflow-y-auto custom-scrollbar border ${col === 'todo' ? 'bg-slate-50 border-slate-100' : col === 'in_progress' ? 'bg-blue-50/50 border-blue-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-sm font-bold capitalize">{col.replace('_', ' ')}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">{tasks.filter(t => t.status === col).length}</span>
                </div>
                {tasks.filter(t => t.status === col).map(task => (
                  <div key={task.id} className={`bg-white p-4 rounded-xl shadow-sm border ${activeTaskId === task.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-100'} group relative transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{task.priority}</span>
                      <button onClick={() => deleteTask(task.id)} className="transition-opacity opacity-0 text-slate-300 hover:text-red-500 group-hover:opacity-100"><FaTrash size={12} /></button>
                    </div>
                    <h5 className={`font-bold text-sm mb-1 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>{task.title}</h5>
                    <p className="text-[10px] text-slate-500 mb-3">{task.category} • 🍅 {task.completedPomo}/{task.targetPomo}</p>
                    <div className="flex gap-2">
                      {col !== 'done' && (
                        <button onClick={() => setActiveTaskId(task.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${activeTaskId === task.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          {activeTaskId === task.id ? 'Active' : 'Fokus'}
                        </button>
                      )}
                      {col === 'todo' && <button onClick={() => moveTask(task.id, 'in_progress')} className="flex items-center justify-center w-8 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"><FaArrowRight size={10} /></button>}
                      {col === 'in_progress' && (
                        <>
                          <button onClick={() => moveTask(task.id, 'todo')} className="flex items-center justify-center w-8 rotate-180 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-200"><FaArrowRight size={10} /></button>
                          <button onClick={() => moveTask(task.id, 'done')} className="flex items-center justify-center w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><FaCheckCircle size={10} /></button>
                        </>
                      )}
                      {col === 'done' && <button onClick={() => moveTask(task.id, 'in_progress')} className="text-[10px] font-bold text-blue-500 underline">Undone</button>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden h-[600px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex bg-white/10 p-1 rounded-xl mb-8 w-full max-w-[250px]">
              <button onClick={() => switchMode('focus')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${timerMode === 'focus' ? 'bg-red-500 shadow-md scale-105' : 'text-white/60 hover:text-white'}`}>Focus</button>
              <button onClick={() => switchMode('shortBreak')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${timerMode === 'shortBreak' ? 'bg-emerald-500 shadow-md scale-105' : 'text-white/60 hover:text-white'}`}>Short</button>
              <button onClick={() => switchMode('longBreak')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${timerMode === 'longBreak' ? 'bg-blue-500 shadow-md scale-105' : 'text-white/60 hover:text-white'}`}>Long</button>
            </div>

            <div className="h-12 mb-8 text-center">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Active Task</p>
              <h4 className="px-4 text-lg font-black text-blue-300 line-clamp-1">
                {activeTaskId ? tasks.find(t => t.id === activeTaskId)?.title : 'Pilih task di Board'}
              </h4>
            </div>

            <div className="relative flex items-center justify-center w-56 h-56 mb-8">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="112" cy="112" r="105" fill="none"
                  stroke={timerMode === 'focus' ? '#EF4444' : timerMode === 'shortBreak' ? '#10B981' : '#3B82F6'}
                  strokeWidth="6" strokeDasharray={660} strokeDashoffset={660 - (660 * timerPercent) / 100}
                  strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="text-center">
                <h1 className="text-6xl font-black tracking-tighter tabular-nums">{formatTime(timeLeft)}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => switchMode(timerMode)} className="flex items-center justify-center w-12 h-12 transition-colors rounded-full bg-white/10 hover:bg-white/20 text-white/70" title="Reset">
                <FaStop />
              </button>
              <button onClick={toggleTimer} className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-105 shadow-xl ${isActive ? 'bg-amber-400 text-amber-900' : 'bg-white text-slate-900'}`}>
                {isActive ? <FaPause /> : <FaPlay className="ml-1" />}
              </button>
              <button onClick={handleTimerComplete} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/70 font-bold text-[10px]" title="Skip">
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
          <h3 className="mb-6 text-lg font-black text-slate-800">📈 Focus Session (7 Hari)</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="focus" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {chartData.map((_entry, index) => <Cell key={`cell-${index}`} fill="#2563EB" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
          <h3 className="mb-6 text-lg font-black text-slate-800">🏆 Riwayat Selesai</h3>
          <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider sticky top-0">
                  <th className="p-3 font-bold rounded-l-lg">Task</th>
                  <th className="p-3 font-bold text-center rounded-r-lg">Pomo</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tasks.filter(t => t.status === 'done').map(task => (
                  <tr key={task.id} className="border-b border-slate-50">
                    <td className="p-3 font-bold text-slate-700">{task.title}</td>
                    <td className="p-3 font-black text-center text-red-500">🍅 {task.completedPomo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;