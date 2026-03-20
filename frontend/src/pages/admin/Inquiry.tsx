// src/pages/admin/Inquiry.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaEnvelope, FaWhatsapp, FaUser, FaPhoneAlt, 
  FaBriefcase, FaMoneyBillWave, FaTrash, FaCheckCircle, 
  FaClock, FaInbox, FaFilter, FaPaperPlane
} from 'react-icons/fa';

interface InquiryData {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  created_at: string;
}

const Inquiry = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch('http://localhost:5000/api/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setInquiries(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [navigate]);

  // --- ACTIONS ---
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchInquiries(); // Refresh data
        Swal.fire({ icon: 'success', title: 'Status Diperbarui', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({ title: 'Hapus Pesan?', text: 'Lead ini akan dihapus permanen.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/inquiries/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          fetchInquiries();
          Swal.fire({ icon: 'success', title: 'Dihapus!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
      } catch (err) { console.error(err); }
    }
  };

  const openDetailModal = (item: InquiryData) => {
    const dateStr = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    // Normalisasi format nomor WA (ganti awalan 0 menjadi 62)
    let waNumber = item.phone.replace(/\D/g, '');
    if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);

    const waText = `Halo Kak ${item.name}, saya Bayu dari MBNP Tech. Saya menerima pesan Anda mengenai pembuatan *${item.service}*. Apakah kita bisa berdiskusi lebih lanjut?`;

    Swal.fire({
      html: `
        <div class="text-left font-sans">
          <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl shrink-0"><i class="fa fa-user"></i></div>
            <div>
              <h3 class="text-xl font-black text-slate-900 leading-tight">${item.name}</h3>
              <p class="text-xs text-slate-500 font-bold">${dateStr}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
              <p class="text-sm font-semibold text-slate-700 break-all">${item.email}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
              <p class="text-sm font-semibold text-slate-700">${item.phone}</p>
            </div>
            <div class="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Layanan</p>
              <p class="text-sm font-bold text-indigo-700">${item.service}</p>
            </div>
            <div class="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <p class="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Budget</p>
              <p class="text-sm font-bold text-amber-700">${item.budget || '-'}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pesan Klien:</p>
            <p class="text-sm text-slate-700 leading-relaxed font-medium">"${item.message}"</p>
          </div>
          
          <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}" target="_blank" class="w-full py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
            Balas via WhatsApp
          </a>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'rounded-[2rem] p-6 max-w-lg' }
    });
  };

  // --- FILTER & STATS ---
  const filteredInquiries = filterStatus === 'All' ? inquiries : inquiries.filter(i => i.status === filterStatus);
  const countNew = inquiries.filter(i => i.status === 'New').length;
  const countContacted = inquiries.filter(i => i.status === 'Contacted').length;
  const countClosed = inquiries.filter(i => i.status === 'Closed').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'Contacted': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Closed': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20 selection:bg-blue-200 selection:text-blue-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FaInbox className="text-indigo-600" /> Inquiry Leads
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola pesan masuk dan prospek klien dari website.</p>
        </div>
      </div>

      {/* 1️⃣ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { title: "Total Leads", val: inquiries.length, icon: <FaEnvelope />, color: "blue" },
          { title: "New (Belum Dibaca)", val: countNew, icon: <FaPaperPlane />, color: "rose" },
          { title: "Contacted", val: countContacted, icon: <FaWhatsapp />, color: "amber" },
          { title: "Closed / Deal", val: countClosed, icon: <FaCheckCircle />, color: "emerald" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
              <h4 className="text-2xl font-black text-slate-800">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 2️⃣ Main Content Area */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 mr-2" />
            {['All', 'New', 'Contacted', 'In Progress', 'Closed'].map(status => (
              <button 
                key={status} onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterStatus === status ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                {status} {status === 'New' && countNew > 0 && <span className="ml-1 text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full">{countNew}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiry List */}
        <div className="p-6">
          {filteredInquiries.length === 0 ? (
            <div className="text-center text-slate-400 py-16 font-medium">Belum ada pesan masuk di kategori ini.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInquiries.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all group flex flex-col">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg font-black shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</p>
                      </div>
                    </div>
                    {/* Status Dropdown */}
                    <select 
                      value={item.status} 
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border outline-none cursor-pointer appearance-none text-center ${getStatusColor(item.status)}`}
                    >
                      <option value="New">NEW</option>
                      <option value="Contacted">CONTACTED</option>
                      <option value="In Progress">IN PROGRESS</option>
                      <option value="Closed">CLOSED</option>
                    </select>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 cursor-pointer" onClick={() => openDetailModal(item)}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1"><FaBriefcase/> {item.service}</span>
                      {item.budget && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded flex items-center gap-1"><FaMoneyBillWave/> {item.budget}</span>}
                    </div>
                    <p className="text-sm text-slate-600 font-medium line-clamp-2 italic">"{item.message}"</p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button onClick={() => openDetailModal(item)} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">Detail</button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"><FaTrash /></button>
                    </div>
                    <a href={`https://wa.me/${item.phone.replace(/\D/g, '').replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors" title="Chat WA">
                      <FaWhatsapp size={16} />
                    </a>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Inquiry;