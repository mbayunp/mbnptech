-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Waktu pembuatan: 13 Mar 2026 pada 10.21
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mbnp_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `achieved_year` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `achievements`
--

INSERT INTO `achievements` (`id`, `user_id`, `title`, `category`, `description`, `achieved_year`, `created_at`) VALUES
(1, 2, 'Lulus S1 Teknik Informatika UIN Bandung', 'Education', 'Menyelesaikan pendidikan sarjana.', 2024, '2026-03-13 06:58:25'),
(2, 2, 'Full Stack Developer', 'Career', 'Berkarir profesional sebagai Full Stack Engineer.', 2024, '2026-03-13 06:58:25'),
(3, 2, 'Rilis Portal Garut Satu Data', 'Project', 'Membangun sistem portal data terintegrasi.', 2025, '2026-03-13 06:58:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `module`, `action`, `title`, `description`, `data`, `created_at`) VALUES
(1, 2, 'system', 'login', 'Login Sistem', 'Admin berhasil login ke dashboard.', NULL, '2026-03-13 05:37:33'),
(2, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran Makan Siang dicatat.', '{\"category\": \"Makan\", \"amount\": 35000}', '2026-03-12 07:37:33'),
(3, 2, 'habits', 'complete', 'Habit Selesai', 'Mengerjakan Habit: Coding / Mengerjakan Projek.', NULL, '2026-03-12 07:37:33'),
(4, 2, 'life_planning', 'update', 'Progress Goal Diperbarui', 'Target IELTS progress naik menjadi 40%.', '{\"previous\": 20, \"current\": 40}', '2026-03-11 07:37:33'),
(5, 2, 'achievements', 'create', 'Achievement Baru', 'Menambahkan pencapaian Rilis Portal Garut Satu Data.', NULL, '2026-03-10 07:37:33'),
(6, 2, 'finance', 'create', 'Pemasukan Baru', 'Pemasukan Freelance Website dicatat.', '{\"category\": \"Project\", \"amount\": 2500000}', '2026-03-09 07:37:33'),
(7, 2, 'habits', 'complete', 'Habit Selesai', 'Mengerjakan Habit: Latihan Soal CPNS.', NULL, '2026-03-08 07:37:33'),
(8, 2, 'finance', 'delete', 'Transaksi Dihapus', 'Satu baris riwayat transaksi dihapus.', NULL, '2026-03-13 07:44:39'),
(9, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp10000 dicatat.', '{\"category\":\"CASH\",\"amount\":10000,\"description\":\"Buka Puasa\"}', '2026-03-13 07:44:50'),
(10, 2, 'todo', 'create', 'Task Baru Dibuat', 'Menambahkan task: Website Picme Update Styling', '{\"priority\":\"Medium\",\"category\":\"Kerja\"}', '2026-03-13 07:48:08'),
(11, 2, 'todo', 'create', 'Task Baru Dibuat', 'Menambahkan task: Zoom Bahasa Jepang Jam 3-5', '{\"priority\":\"High\",\"category\":\"Belajar\"}', '2026-03-13 07:48:49'),
(12, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikerjakan.', NULL, '2026-03-13 08:32:44'),
(13, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikerjakan.', NULL, '2026-03-13 08:52:12'),
(14, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 08:52:24'),
(15, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 09:18:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `debts`
--

CREATE TABLE `debts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `remaining_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `debts`
--

INSERT INTO `debts` (`id`, `user_id`, `name`, `total_amount`, `remaining_amount`, `created_at`, `due_date`) VALUES
(5, 2, 'Cicilan Gopay', 900000.00, 900000.00, '2026-03-13 00:28:28', '2026-04-02'),
(6, 2, 'Shopee', 1200000.00, 1200000.00, '2026-03-13 00:28:45', '2026-05-04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `debt_payments`
--

CREATE TABLE `debt_payments` (
  `id` int(11) NOT NULL,
  `debt_id` int(11) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_date` date NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `finances`
--

CREATE TABLE `finances` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `finances`
--

INSERT INTO `finances` (`id`, `user_id`, `date`, `category`, `description`, `amount`, `type`, `created_at`) VALUES
(16, 2, '2026-03-13', 'Saldo BJB', '', 200000.00, 'income', '2026-03-13 00:29:39'),
(17, 2, '2026-03-13', 'Saldo Dana', '', 100000.00, 'income', '2026-03-13 00:29:53'),
(18, 2, '2026-03-11', 'Cash', 'THR Bidang', 500000.00, 'income', '2026-03-13 04:42:19'),
(19, 2, '2026-03-13', 'Saldo Dana', 'Wifi Mamah', 50000.00, 'expense', '2026-03-13 07:22:53'),
(21, 2, '2026-03-13', 'CASH', 'Buka Puasa', 10000.00, 'expense', '2026-03-13 07:44:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `goals`
--

CREATE TABLE `goals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `target_value` decimal(15,2) NOT NULL,
  `current_value` decimal(15,2) DEFAULT 0.00,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `habits`
--

CREATE TABLE `habits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `target_per_week` int(11) DEFAULT 5,
  `color` varchar(50) DEFAULT 'blue',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `habits`
--

INSERT INTO `habits` (`id`, `user_id`, `title`, `target_per_week`, `color`, `created_at`) VALUES
(1, 2, 'Latihan Bahasa Jepang (Zoom)', 2, 'emerald', '2026-03-13 06:58:25'),
(2, 2, 'Latihan Soal CPNS', 4, 'blue', '2026-03-13 06:58:25'),
(3, 2, 'Coding / Mengerjakan Projek', 5, 'indigo', '2026-03-13 06:58:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `habit_logs`
--

CREATE TABLE `habit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `habit_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `life_plans`
--

CREATE TABLE `life_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('vision','timeline','career','education','finance','relationship') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `target_year` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `life_plans`
--

INSERT INTO `life_plans` (`id`, `user_id`, `category`, `title`, `description`, `progress`, `target_year`, `status`, `created_at`) VALUES
(1, 2, 'timeline', 'Karir stabil & Portofolio MBNP Tech berkembang', '', 30, 2026, 'current', '2026-03-13 06:58:25'),
(2, 2, 'timeline', 'Lulus Seleksi CPNS / Lanjut S2', 'Diskominfo Provinsi Jawa Barat', 10, 2026, 'current', '2026-03-13 06:58:25'),
(3, 2, 'timeline', 'Kuliah Luar Negeri / Gaji 2 Digit', 'Scholarship & Programmer', 0, 2027, 'upcoming', '2026-03-13 06:58:25'),
(4, 2, 'timeline', 'Mobil Pertama', '', 0, 2027, 'upcoming', '2026-03-13 06:58:25'),
(5, 2, 'career', 'Full Stack Developer', 'Target posisi profesional selanjutnya', 50, 2027, 'current', '2026-03-13 06:58:25'),
(6, 2, 'career', 'Pranata Komputer (CPNS)', 'Target pengabdian negara', 30, 2026, 'upcoming', '2026-03-13 06:58:25'),
(7, 2, 'education', 'S2 Teknik Informatika di Jepang (MEXT)', 'Persiapan bahasa dan dokumen', 30, 2028, 'upcoming', '2026-03-13 06:58:25'),
(8, 2, 'finance', 'Dana Darurat (Emergency Fund)', 'Rp 50.000.000', 0, 2026, 'current', '2026-03-13 06:58:25'),
(9, 2, 'finance', 'Upgrade Motor CBR', 'Rp 8.000.000 All In', 20, 2026, 'current', '2026-03-13 06:58:25'),
(10, 2, 'timeline', 'Menikah', NULL, 0, 2028, 'upcoming', '2026-03-13 07:16:22'),
(11, 2, 'relationship', 'Tunangan', '', 20, 2027, 'current', '2026-03-13 07:21:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pomodoro_sessions`
--

CREATE TABLE `pomodoro_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pomodoro_sessions`
--

INSERT INTO `pomodoro_sessions` (`id`, `user_id`, `task_id`, `duration`, `created_at`) VALUES
(1, 2, 2, 1500, '2026-03-13 01:46:50'),
(2, 2, 2, 1500, '2026-03-13 04:36:05'),
(3, 2, 3, 1500, '2026-03-13 08:52:24'),
(4, 2, 5, 1500, '2026-03-13 09:18:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Umum',
  `priority` enum('Low','Medium','High') DEFAULT 'Medium',
  `status` enum('todo','in_progress','done') DEFAULT 'todo',
  `target_pomo` int(11) DEFAULT 1,
  `completed_pomo` int(11) DEFAULT 0,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `category`, `priority`, `status`, `target_pomo`, `completed_pomo`, `deadline`, `created_at`, `updated_at`) VALUES
(1, 2, 'Backend Garut Satu Data', 'Kerja', 'High', 'todo', 1, 0, '2026-03-13', '2026-03-13 00:55:28', '2026-03-13 00:55:38'),
(2, 2, 'Halaman Pemeriksaan Backend', 'Kerja', 'Medium', 'done', 3, 2, '2026-03-13', '2026-03-13 01:08:52', '2026-03-13 06:47:10'),
(3, 2, 'Website MBNP Project', 'Pribadi', 'Medium', 'in_progress', 4, 1, '2026-03-13', '2026-03-13 07:38:17', '2026-03-13 08:52:24'),
(4, 2, 'Website Picme Update Styling', 'Kerja', 'Medium', 'todo', 2, 0, '2026-03-13', '2026-03-13 07:48:08', '2026-03-13 07:48:08'),
(5, 2, 'Zoom Bahasa Jepang Jam 3-5', 'Belajar', 'High', 'in_progress', 3, 1, '2026-03-13', '2026-03-13 07:48:49', '2026-03-13 09:18:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(2, 'Muhammad Bayu Nurdiansyah Putra', 'muhammadbayunp@gmail.com', '$2b$10$PcKOb7sTfHFChCxb5x2R2.NaOD90my5nLzKKuzy/nUe2RDadTpjDi', '2026-03-12 10:05:29');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `debts`
--
ALTER TABLE `debts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `debt_id` (`debt_id`);

--
-- Indeks untuk tabel `finances`
--
ALTER TABLE `finances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `habits`
--
ALTER TABLE `habits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `habit_logs`
--
ALTER TABLE `habit_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_habit_date` (`habit_id`,`log_date`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `life_plans`
--
ALTER TABLE `life_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `pomodoro_sessions`
--
ALTER TABLE `pomodoro_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indeks untuk tabel `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `debts`
--
ALTER TABLE `debts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `finances`
--
ALTER TABLE `finances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `habits`
--
ALTER TABLE `habits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `habit_logs`
--
ALTER TABLE `habit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `life_plans`
--
ALTER TABLE `life_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `pomodoro_sessions`
--
ALTER TABLE `pomodoro_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `debts`
--
ALTER TABLE `debts`
  ADD CONSTRAINT `debts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD CONSTRAINT `debt_payments_ibfk_1` FOREIGN KEY (`debt_id`) REFERENCES `debts` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `finances`
--
ALTER TABLE `finances`
  ADD CONSTRAINT `finances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `habits`
--
ALTER TABLE `habits`
  ADD CONSTRAINT `habits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `habit_logs`
--
ALTER TABLE `habit_logs`
  ADD CONSTRAINT `habit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `habit_logs_ibfk_2` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `life_plans`
--
ALTER TABLE `life_plans`
  ADD CONSTRAINT `life_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pomodoro_sessions`
--
ALTER TABLE `pomodoro_sessions`
  ADD CONSTRAINT `pomodoro_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pomodoro_sessions_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `todos`
--
ALTER TABLE `todos`
  ADD CONSTRAINT `todos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
