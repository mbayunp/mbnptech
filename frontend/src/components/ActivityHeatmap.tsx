import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, Percent, Trophy } from 'lucide-react';

interface HeatmapData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
  type: 'activity' | 'habits' | 'spiritual';
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data, type }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // 1. Build Quick Lookup Map
  const dateMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        map[item.date] = item.count;
      });
    }
    return map;
  }, [data]);

  // 2. Generate 53 weeks x 7 days cells
  const { cells, columns, months } = useMemo(() => {
    const today = new Date();
    
    // Get start date 364 days ago (52 weeks ago)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    
    // Align to Sunday of that week
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const generatedCells = [];
    const tempDate = new Date(startDate);

    for (let i = 0; i < 371; i++) {
      // Format as YYYY-MM-DD local time
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, '0');
      const day = String(tempDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const count = dateMap[dateStr] || 0;
      
      generatedCells.push({
        date: dateStr,
        count,
        dayOfWeek: tempDate.getDay(),
        month: tempDate.getMonth(),
        year: tempDate.getFullYear()
      });

      tempDate.setDate(tempDate.getDate() + 1);
    }

    // Group cells into 53 columns of 7 days
    const cols = [];
    for (let i = 0; i < 53; i++) {
      cols.push(generatedCells.slice(i * 7, (i + 1) * 7));
    }

    // Identify month labels placement
    const monthLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    cols.forEach((col, index) => {
      const firstCell = col[0];
      if (firstCell.month !== lastMonth) {
        monthLabels.push({
          label: monthNames[firstCell.month],
          colIndex: index
        });
        lastMonth = firstCell.month;
      }
    });

    return { cells: generatedCells, columns: cols, months: monthLabels };
  }, [dateMap]);

  // 3. Calculate Streak Stats
  const stats = useMemo(() => {
    let longestStreak = 0;
    let currentStreak = 0;
    let activeDays = 0;
    
    // Sort cells chronologically
    const sortedCells = [...cells].sort((a, b) => a.date.localeCompare(b.date));

    // Calculate longest streak
    let tempStreak = 0;
    sortedCells.forEach(cell => {
      if (cell.count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak (backwards from today)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIndex = sortedCells.findIndex(c => c.date === todayStr);
    
    if (todayIndex !== -1) {
      let checkIdx = todayIndex;
      // If today is empty, check if yesterday was active to keep streak alive
      if (sortedCells[checkIdx].count === 0 && checkIdx > 0 && sortedCells[checkIdx - 1].count > 0) {
        checkIdx--;
      }

      while (checkIdx >= 0 && sortedCells[checkIdx].count > 0) {
        currentStreak++;
        checkIdx--;
      }
    }

    // Consistency Percentage
    const totalDays = 365;
    const consistency = Math.min(Math.round((activeDays / totalDays) * 100), 100);

    // Find Best Month
    const monthlySum: Record<string, number> = {};
    sortedCells.forEach(cell => {
      const key = `${monthNames[cell.month]} ${cell.year}`;
      monthlySum[key] = (monthlySum[key] || 0) + cell.count;
    });

    let bestMonth = 'N/A';
    let maxMonthCount = 0;
    Object.entries(monthlySum).forEach(([monthKey, val]) => {
      if (val > maxMonthCount) {
        maxMonthCount = val;
        bestMonth = monthKey;
      }
    });

    return {
      longestStreak,
      currentStreak,
      consistency,
      bestMonth,
      totalCompletions: activeDays
    };
  }, [cells]);

  // 4. Color level mapping helper
  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (type === 'spiritual') {
      if (count <= 3) return 1;
      if (count <= 6) return 2;
      if (count <= 9) return 3;
      return 4;
    } else if (type === 'habits') {
      if (count === 1) return 1;
      if (count === 2) return 2;
      if (count === 3) return 3;
      return 4;
    } else { // activity
      if (count === 1) return 1;
      if (count <= 3) return 2;
      if (count <= 5) return 3;
      return 4;
    }
  };

  const getCellClass = (level: number) => {
    const base = 'w-[10px] h-[10px] rounded-[2px] transition-colors duration-200 ';
    if (level === 0) {
      return base + 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/20 dark:border-white/[0.02]';
    }

    if (type === 'spiritual') {
      // Teal (Hijau Kebiruan) shades
      switch (level) {
        case 1: return base + 'bg-teal-100 dark:bg-teal-950/40 hover:bg-teal-200 dark:hover:bg-teal-900/60 border border-teal-200/20 dark:border-teal-900/10';
        case 2: return base + 'bg-teal-300 dark:bg-teal-800/60 hover:bg-teal-400 dark:hover:bg-teal-700 border border-teal-450/20 dark:border-teal-700/20';
        case 3: return base + 'bg-teal-500 dark:bg-teal-600/80 hover:bg-teal-650 dark:hover:bg-teal-500 border border-teal-500/20 dark:border-teal-500/30';
        case 4: 
        default: return base + 'bg-teal-600 dark:bg-teal-400 hover:bg-teal-700 dark:hover:bg-teal-350 border border-teal-700/20 dark:border-teal-300/40 shadow-[0_0_10px_rgba(13,148,136,0.35)] dark:shadow-[0_0_10px_rgba(45,212,191,0.45)]';
      }
    } else if (type === 'habits') {
      // Neon Violet/Blue shades
      switch (level) {
        case 1: return base + 'bg-violet-100 dark:bg-violet-950/40 hover:bg-violet-200 dark:hover:bg-violet-900/60 border border-violet-200/20 dark:border-violet-900/10';
        case 2: return base + 'bg-violet-300 dark:bg-violet-800/60 hover:bg-violet-400 dark:hover:bg-violet-700 border border-violet-450/20 dark:border-violet-700/20';
        case 3: return base + 'bg-violet-500 dark:bg-violet-600/80 hover:bg-violet-650 dark:hover:bg-violet-500 border border-violet-500/20 dark:border-violet-500/30';
        case 4:
        default: return base + 'bg-violet-600 dark:bg-violet-400 hover:bg-violet-700 dark:hover:bg-violet-350 border border-violet-700/20 dark:border-violet-300/40 shadow-[0_0_10px_rgba(124,58,237,0.35)] dark:shadow-[0_0_10px_rgba(167,139,250,0.45)]';
      }
    } else {
      // Cyan/Blue shades for overall activity
      switch (level) {
        case 1: return base + 'bg-blue-100 dark:bg-blue-950/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 border border-blue-200/20 dark:border-blue-900/10';
        case 2: return base + 'bg-blue-300 dark:bg-blue-800/60 hover:bg-blue-400 dark:hover:bg-blue-700 border border-blue-450/20 dark:border-blue-700/20';
        case 3: return base + 'bg-blue-500 dark:bg-blue-600/80 hover:bg-blue-650 dark:hover:bg-blue-500 border border-blue-500/20 dark:border-blue-500/30';
        case 4:
        default: return base + 'bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-700 dark:hover:bg-cyan-350 border border-cyan-700/20 dark:border-cyan-300/40 shadow-[0_0_10px_rgba(8,145,178,0.35)] dark:shadow-[0_0_10px_rgba(34,211,238,0.45)]';
      }
    }
  };

  const handleCellHover = (e: React.MouseEvent, cell: typeof cells[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      date: cell.date,
      count: cell.count,
      x: rect.left + rect.width / 2,
      y: rect.top - 40 // Adjust position above the cell
    });
  };

  const formatTooltipText = (count: number, date: string) => {
    let action = 'kontribusi';
    if (type === 'habits') action = 'habit selesai';
    if (type === 'spiritual') action = 'amal ibadah';

    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${count === 0 ? 'Tidak ada' : count} ${action} pada ${formattedDate}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-cyan-900/30 rounded-[2rem] p-6 text-slate-850 dark:text-slate-100 shadow-xl relative overflow-hidden select-none font-mono">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full pointer-events-none bg-blue-500/[0.03] dark:bg-blue-500/5 blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 -mb-20 -ml-20 rounded-full pointer-events-none bg-emerald-500/[0.03] dark:bg-emerald-500/5 blur-[80px]"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-sm font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase">
            {type === 'activity' ? 'SYSTEM CONSISTENCY GRAPH' : type === 'habits' ? 'HABITS CONSISTENCY MATRIX' : 'SPIRITUAL CONSISTENCY MATRIX'}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5">
            Peta konsistensi harian Anda selama 365 hari terakhir.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-bold shrink-0">
          <span>Less</span>
          <div className="w-[10px] h-[10px] rounded-[2px] bg-slate-100 dark:bg-slate-800/50 border border-slate-200/20 dark:border-white/[0.02]" />
          <div className={getCellClass(1).replace('w-[10px] h-[10px]', 'w-[9px] h-[9px]')} />
          <div className={getCellClass(2).replace('w-[10px] h-[10px]', 'w-[9px] h-[9px]')} />
          <div className={getCellClass(3).replace('w-[10px] h-[10px]', 'w-[9px] h-[9px]')} />
          <div className={getCellClass(4).replace('w-[10px] h-[10px]', 'w-[9px] h-[9px]')} />
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="min-w-[620px] flex flex-col gap-1 relative px-1 py-2">
          
          {/* Months Header */}
          <div className="h-4 relative text-[9px] font-bold text-slate-500 dark:text-slate-400">
            {months.map((m, i) => (
              <span
                key={i}
                className="absolute"
                style={{ left: `${m.colIndex * 13 + 30}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex flex-row gap-1">
            {/* Days Labels Column */}
            <div className="flex flex-col gap-[3px] pr-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 justify-between h-[90px] pt-[2px] shrink-0 w-8">
              <span>{dayLabels[1]}</span>
              <span>{dayLabels[3]}</span>
              <span>{dayLabels[5]}</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex flex-row gap-[3px]">
              {columns.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {week.map((cell, rowIdx) => {
                    const level = getLevel(cell.count);
                    return (
                      <div
                        key={rowIdx}
                        className={getCellClass(level)}
                        onMouseEnter={(e) => handleCellHover(e, cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-white/95 dark:bg-[#0B0F19]/95 border border-slate-200 dark:border-white/[0.08] backdrop-blur-md px-3 py-1.5 rounded-xl shadow-2xl text-[10px] text-slate-800 dark:text-slate-200 font-sans tracking-wide transform -translate-x-1/2 pointer-events-none transition-all duration-150"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y
          }}
        >
          <div className="font-bold">{formatTooltipText(hoveredCell.count, hoveredCell.date)}</div>
        </div>
      )}

      {/* Stats Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.03]">
        
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-cyan-900/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <Flame size={18} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-550 dark:text-slate-400 tracking-wider uppercase">Streak Saat Ini</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200">{stats.currentStreak} Hari</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-cyan-900/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-550 dark:text-slate-400 tracking-wider uppercase">Streak Terpanjang</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200">{stats.longestStreak} Hari</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-cyan-900/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <Percent size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-550 dark:text-slate-400 tracking-wider uppercase">Konsistensi</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200">{stats.consistency}%</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-cyan-900/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-550 dark:text-slate-400 tracking-wider uppercase">Bulan Terbaik</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{stats.bestMonth}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ActivityHeatmap;
