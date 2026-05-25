import React from 'react';

interface JarvisQuickActionsProps {
  pathname: string;
  onActionSelect: (actionText: string) => void;
}

export const JarvisQuickActions: React.FC<JarvisQuickActionsProps> = ({
  pathname,
  onActionSelect
}) => {
  // Get quick action lists relative to page context
  const getActions = () => {
    if (pathname.includes('/finance')) {
      return [
        { label: 'Saldo Aktif', text: 'Jarvis, berapa saldo aktif saya saat ini?' },
        { label: 'Cek Hutang', text: 'Jarvis, tolong cek daftar hutang saya yang belum lunas.' },
        { label: 'Analisis Pengeluaran', text: 'Jarvis, apa kategori pengeluaran terbesar saya bulan ini?' }
      ];
    }
    if (pathname.includes('/spiritual')) {
      return [
        { label: 'Quran Progress', text: 'Jarvis, tampilkan catatan halaman terakhir baca Quran saya.' },
        { label: 'Evaluasi Ibadah', text: 'Jarvis, sholat apa saja yang sudah saya kerjakan hari ini?' },
        { label: 'Mood & Refleksi', text: 'Jarvis, tampilkan refleksi mood saya hari ini.' }
      ];
    }
    if (pathname.includes('/habits')) {
      return [
        { label: 'Habit Hari Ini', text: 'Jarvis, berapa habit yang sudah saya selesaikan hari ini?' },
        { label: 'Mulai Fokus', text: 'Jarvis, tolong berikan kata motivasi untuk mulai fokus habit.' },
        { label: 'Completion Rate', text: 'Jarvis, berapa persen tingkat penyelesaian habit saya hari ini?' }
      ];
    }
    if (pathname.includes('/wedding')) {
      return [
        { label: 'Sisa Saldo Nikah', text: 'Jarvis, berapa sisa saldo real pernikahan kita?' },
        { label: 'Target Budget', text: 'Jarvis, berapa total anggaran dan pengeluaran nikah saat ini?' },
        { label: 'Agenda Terdekat', text: 'Jarvis, apa saja agenda timeline terdekat pernikahan saya?' }
      ];
    }
    // Default actions
    return [
      { label: 'Cek Keuangan', text: 'Jarvis, berikan ringkasan keuangan saya bulan ini.' },
      { label: 'Streak Habit', text: 'Jarvis, ingatkan saya habit apa yang belum selesai.' },
      { label: 'Tilawah Terakhir', text: 'Jarvis, surah apa terakhir yang saya baca?' }
    ];
  };

  const actions = getActions();

  return (
    <div className="flex flex-wrap gap-2.5 px-6 py-2 bg-slate-950/20 border-t border-cyan-500/5 select-none overflow-x-auto max-h-24">
      {actions.map((act, index) => (
        <button
          key={index}
          onClick={() => onActionSelect(act.text)}
          className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-950/30 border border-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:scale-105 active:scale-95 transition-all text-cyan-400/80 shadow-[0_2px_8px_rgba(6,182,212,0.02)] shrink-0"
        >
          {act.label}
        </button>
      ))}
    </div>
  );
};

export default JarvisQuickActions;
