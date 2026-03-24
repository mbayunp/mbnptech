-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 24 Mar 2026 pada 05.26
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
(3, 2, 'Rilis Portal Garut Satu Data', 'Project', 'Membangun sistem portal data terintegrasi.', 2025, '2026-03-13 06:58:25'),
(4, 2, 'Rilis Website Picme Studio', 'Project', 'Pembuatan awal memakan waktu 3 Bulan dan saya bangga ini project kedua saya yang dikerjakan sendiri', 2025, '2026-03-13 09:56:45'),
(5, 2, 'Rilis Website UKBI Garut Dinas Pendidikan', 'Project', 'Mendapatkan kerja sama dengan Ibu Kiki Kabid KBPS kemudian pengerjaan memakan waktu 1 minggu', 2026, '2026-03-13 09:57:51'),
(6, 2, 'Motor CBR 150R 2017 Repsol', 'Finance', 'Aset Kendaraan Pertama saya yang sangat berharga dan membuat saya bisa bepergian keluar kota dengan tenang', 2025, '2026-03-13 09:59:21'),
(7, 2, 'HP Redmi Note 14 Pro 5G', 'Finance', 'Hp yang insyaallah jangka panjang saya pakai dan diberikan dana talang oleh kaka perempuan saya Rianti', 2025, '2026-03-13 10:00:13'),
(8, 2, 'Trail Run 30km Batu Raden Forest Run Purwokerto', 'Personal', 'Lari memakan waktu 6 jam dan saya bangga bisa menyelesaikannya\n', 2025, '2026-03-13 10:01:27'),
(9, 2, 'Magang BSI Bandung Buah Batu 2', 'Career', 'Posisi sebagai Intership Digital Marketing selama 4 Bulan dan mendapat banyak pengalaman dari Ibu Putri, Pak Tedi dan karyawan bsi bubat lainnya', 2024, '2026-03-13 10:02:40'),
(10, 2, 'IT Technical Support PT IMN Business Group', 'Career', 'Setelah Lebaran saya mendapat kerja sebagai IT dan bertahan selama 5 Bulan di Cileunyi ', 2025, '2026-03-13 10:03:23'),
(11, 2, 'Programmer Diskominfo Garut', 'Career', 'Berada di Bidang Statistik dan alhamdulillah mendapat lingkungan yang support dari Ibu Kiki, Pa Asfre, Pa Indra dan lainnya', 2025, '2026-03-13 10:04:28'),
(12, 2, 'Rilis Website Bidang Statistik', 'Project', 'Membuat website sistem administrasi online untuk memudahkan kerja bidang dalam jangka panjang\n', 2026, '2026-03-13 10:05:48');

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
(15, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 09:18:13'),
(16, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 09:28:57'),
(17, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 09:33:10'),
(18, 2, 'todo', 'complete', 'Status Task Diperbarui', 'Task dipindah menjadi status: diselesaikan.', NULL, '2026-03-13 09:34:00'),
(19, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-13 09:37:46'),
(20, 2, 'todo', 'delete', 'Task Dihapus', 'Satu task telah dihapus dari board.', NULL, '2026-03-13 09:38:06'),
(21, 2, 'habits', 'create', 'Habit Baru', 'Mulai membangun kebiasaan: Lari', NULL, '2026-03-13 09:46:00'),
(22, 2, 'life_planning', 'create', 'Life Plan Baru', 'Menambahkan target baru: Umroh.', NULL, '2026-03-13 09:47:12'),
(23, 2, 'life_planning', 'update', 'Life Plan Diperbarui', 'Target: Umroh diupdate.', NULL, '2026-03-13 09:47:32'),
(24, 2, 'life_planning', 'update', 'Life Plan Diperbarui', 'Target: Umroh diupdate.', NULL, '2026-03-13 09:47:49'),
(25, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Rilis Website Picme Studio.', NULL, '2026-03-13 09:56:45'),
(26, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Rilis Website UKBI Garut Dinas Pendidikan.', NULL, '2026-03-13 09:57:51'),
(27, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Motor CBR 150R 2017 Repsol.', NULL, '2026-03-13 09:59:21'),
(28, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: HP Redmi Note 14 Pro 5G.', NULL, '2026-03-13 10:00:13'),
(29, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Trail Run 30km Batu Raden Forest Run Purwokerto.', NULL, '2026-03-13 10:01:27'),
(30, 2, 'achievements', 'delete', 'Achievement Dihapus', 'Satu rekam jejak pencapaian telah dihapus.', NULL, '2026-03-13 10:01:46'),
(31, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Magang BSI Bandung Buah Batu 2.', NULL, '2026-03-13 10:02:40'),
(32, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: IT Technical Support PT IMN Business Group.', NULL, '2026-03-13 10:03:23'),
(33, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Programmer Diskominfo Garut.', NULL, '2026-03-13 10:04:28'),
(34, 2, 'achievements', 'create', 'Achievement Baru! 🏆', 'Menambahkan pencapaian: Rilis Website Bidang Statistik.', NULL, '2026-03-13 10:05:48'),
(35, 2, 'system', 'login', 'Login Berhasil', 'User Muhammad Bayu Nurdiansyah Putra masuk ke dalam dashboard admin.', NULL, '2026-03-20 03:08:07'),
(36, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: subuh', NULL, '2026-03-20 03:41:56'),
(37, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: dzuhur', NULL, '2026-03-20 03:41:57'),
(38, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: ashar', NULL, '2026-03-20 03:41:58'),
(39, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: dhuha', NULL, '2026-03-20 03:41:59'),
(40, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: subuh', NULL, '2026-03-20 03:42:23'),
(41, 2, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.', NULL, '2026-03-20 04:19:58'),
(42, 2, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.', NULL, '2026-03-20 04:20:02'),
(43, 2, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.', NULL, '2026-03-20 04:20:05'),
(44, 2, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.', NULL, '2026-03-20 04:20:08'),
(45, 2, 'system', 'update', 'Status Lead Diubah', 'Status inquiry dari Muhammad Bayu Nurdiansyah Putra diubah menjadi Contacted', NULL, '2026-03-20 04:22:38'),
(46, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp200000 dicatat.', '{\"category\":\"Lebaran\",\"amount\":200000,\"description\":\"\"}', '2026-03-20 04:48:38'),
(47, 2, 'finance', 'update', 'Transaksi Diedit', 'Perubahan data transaksi pada kategori CASH.', NULL, '2026-03-20 04:49:09'),
(48, 2, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.', NULL, '2026-03-20 04:49:27'),
(49, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: dzuhur', NULL, '2026-03-20 09:27:59'),
(50, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: ashar', NULL, '2026-03-20 09:28:17'),
(51, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: puasa_senin', NULL, '2026-03-20 09:28:27'),
(52, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: ashar', NULL, '2026-03-20 09:33:08'),
(53, 2, 'habits', 'complete', 'Habit Selesai ✔️', 'Menyelesaikan habit: Coding / Mengerjakan Projek.', NULL, '2026-03-20 09:38:20'),
(54, 2, 'habits', 'complete', 'Habit Selesai ✔️', 'Menyelesaikan habit: Latihan Bahasa Jepang (Zoom).', NULL, '2026-03-20 09:38:28'),
(55, 2, 'todo', 'create', 'Task Baru Dibuat', 'Menambahkan task: Menyelesaikan lms jepang', '{\"priority\":\"High\",\"category\":\"Belajar\"}', '2026-03-20 16:40:33'),
(56, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikerjakan.', NULL, '2026-03-20 16:40:38'),
(57, 2, 'todo', 'complete', 'Status Task Diperbarui', 'Task dipindah menjadi status: diselesaikan.', NULL, '2026-03-20 16:40:46'),
(58, 2, 'todo', 'complete', 'Status Task Diperbarui', 'Task dipindah menjadi status: diselesaikan.', NULL, '2026-03-20 16:40:47'),
(59, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikerjakan.', NULL, '2026-03-20 16:40:52'),
(60, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikembalikan ke To Do.', NULL, '2026-03-20 16:41:04'),
(61, 2, 'todo', 'update', 'Status Task Diperbarui', 'Task dipindah menjadi status: dikerjakan.', NULL, '2026-03-20 16:41:07'),
(62, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-20 16:41:14'),
(63, 2, 'habits', 'complete', 'Habit Selesai ✔️', 'Menyelesaikan habit: Lari.', NULL, '2026-03-20 16:43:36'),
(64, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: ashar', NULL, '2026-03-20 16:44:26'),
(65, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: maghrib', NULL, '2026-03-20 16:44:28'),
(66, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: isya', NULL, '2026-03-20 16:44:30'),
(67, 2, 'finance', 'create', 'Hutang Baru Dicatat', 'Hutang: Gearset', '{\"amount\":250000}', '2026-03-20 17:16:51'),
(68, 2, 'finance', 'create', 'Hutang Baru Dicatat', 'Hutang: Dias', '{\"amount\":200000}', '2026-03-20 17:17:26'),
(69, 2, 'finance', 'complete', 'Cicilan Dibayar', 'Melakukan pembayaran cicilan sebesar Rp50000.', '{\"amount\":50000}', '2026-03-20 17:22:40'),
(70, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp300000 dicatat.', '{\"category\":\"Sedekah\",\"amount\":300000,\"description\":\"THR\"}', '2026-03-20 17:23:24'),
(71, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp100000 dicatat.', '{\"category\":\"Motor\",\"amount\":100000,\"description\":\"Service laher dan bensin\"}', '2026-03-20 17:23:53'),
(72, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp5000 dicatat.', '{\"category\":\"Memberi\",\"amount\":5000,\"description\":\"\"}', '2026-03-20 17:35:46'),
(73, 2, 'finance', 'create', 'Pemasukan Baru', 'Pemasukan sebesar Rp200000 dicatat.', '{\"category\":\"Pinjaman\",\"amount\":200000,\"description\":\"Bapa\"}', '2026-03-20 17:37:56'),
(74, 2, 'finance', 'create', 'Pengeluaran Baru', 'Pengeluaran sebesar Rp200000 dicatat.', '{\"category\":\"Memberi\",\"amount\":200000,\"description\":\"Bapa\"}', '2026-03-20 17:38:10'),
(75, 2, 'finance', 'update', 'Transaksi Diedit', 'Perubahan data transaksi pada kategori Pinjaman.', NULL, '2026-03-20 17:38:32'),
(76, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: subuh', NULL, '2026-03-20 18:09:48'),
(77, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: subuh', NULL, '2026-03-20 18:09:51'),
(78, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: tahajud', NULL, '2026-03-20 18:09:52'),
(79, 2, 'system', 'login', 'Login Berhasil', 'User Muhammad Bayu Nurdiansyah Putra masuk ke dalam dashboard admin.', NULL, '2026-03-21 10:37:00'),
(80, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: subuh', NULL, '2026-03-21 10:37:21'),
(81, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: dzuhur', NULL, '2026-03-21 10:37:21'),
(82, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: ashar', NULL, '2026-03-21 10:37:23'),
(83, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: maghrib', NULL, '2026-03-21 10:37:24'),
(84, 2, 'life_planning', 'update', 'Ibadah Diupdate', 'Mengupdate status ibadah: isya', NULL, '2026-03-21 10:37:24'),
(85, 2, 'system', 'update', 'Profil Diperbarui', 'Melakukan perubahan pada informasi profil diri.', NULL, '2026-03-21 10:51:06'),
(86, 2, 'todo', 'complete', 'Pomodoro Selesai 🍅', 'Menyelesaikan sesi fokus selama 25 menit.', NULL, '2026-03-21 11:01:35'),
(87, 2, 'system', 'login', 'Login Berhasil', 'User Muhammad Bayu Nurdiansyah Putra masuk ke dalam dashboard admin.', NULL, '2026-03-21 11:02:07'),
(88, 2, 'habits', 'complete', 'Habit Selesai ✔️', 'Menyelesaikan habit: Coding / Mengerjakan Projek.', NULL, '2026-03-21 11:02:32'),
(89, 2, 'life_planning', 'update', 'Life Plan Diperbarui', 'Target: Upgrade Motor CBR diupdate.', NULL, '2026-03-21 11:09:09'),
(90, 2, 'life_planning', 'update', 'Visi & Misi Diperbarui', 'Pembaruan arah kompas dan masterplan hidup utama.', NULL, '2026-03-21 11:13:50'),
(91, 2, 'life_planning', 'create', 'Life Plan Baru', 'Menambahkan target baru: Laptop Baru.', NULL, '2026-03-21 11:21:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `amalan_daily`
--

CREATE TABLE `amalan_daily` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `dzikir_pagi` tinyint(1) DEFAULT 0,
  `dzikir_petang` tinyint(1) DEFAULT 0,
  `istighfar` tinyint(1) DEFAULT 0,
  `sholawat` tinyint(1) DEFAULT 0,
  `sedekah` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `amalan_daily`
--

INSERT INTO `amalan_daily` (`id`, `user_id`, `log_date`, `dzikir_pagi`, `dzikir_petang`, `istighfar`, `sholawat`, `sedekah`, `created_at`) VALUES
(1, 2, '2026-03-20', 0, 0, 0, 0, 0, '2026-03-20 03:30:18');

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
(5, 2, 'Cicilan Gopay', 900000.00, 850000.00, '2026-03-13 00:28:28', '2026-04-02'),
(6, 2, 'Shopee', 1200000.00, 1200000.00, '2026-03-13 00:28:45', '2026-05-04'),
(7, 2, 'Gearset', 250000.00, 250000.00, '2026-03-20 17:16:51', '2026-04-02'),
(8, 2, 'Dias', 200000.00, 200000.00, '2026-03-20 17:17:26', '2026-04-02');

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
-- Struktur dari tabel `doa_pribadi`
--

CREATE TABLE `doa_pribadi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `doa_pribadi`
--

INSERT INTO `doa_pribadi` (`id`, `user_id`, `title`, `category`, `content`, `created_at`) VALUES
(1, 2, 'Doa Setelah Sholat', 'Harian', 'Allahumma antassalam waminkassalam tabarakta ya dzal jalali wal ikram.', '2026-03-20 03:30:18'),
(2, 2, 'Doa Rezeki Lancar', 'Rezeki', 'Allahumma inni as aluka rizqan thayyiban wa ilman nafi\'an wa \'amalan mutaqabbalan.', '2026-03-20 03:30:18'),
(3, 2, 'Doa Ketika Sedih', 'Emosional', 'Allahumma inni a’udzubika minal hammi wal hazan, wal ‘ajzi wal kasal...', '2026-03-20 03:30:18');

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
(21, 2, '2026-03-13', 'CASH', 'Buka Puasa', 10000.00, 'expense', '2026-03-13 07:44:50'),
(22, 2, '2026-03-19', 'CASH', 'Lebaran', 200000.00, 'expense', '2026-03-20 04:48:38'),
(23, 2, '2026-03-21', 'Sedekah', 'THR', 300000.00, 'expense', '2026-03-20 17:23:24'),
(24, 2, '2026-03-21', 'Motor', 'Service laher dan bensin', 100000.00, 'expense', '2026-03-20 17:23:53'),
(25, 2, '2026-03-20', 'Memberi', '', 5000.00, 'expense', '2026-03-20 17:35:46'),
(26, 2, '2026-03-20', 'Pinjaman', 'Dias', 200000.00, 'income', '2026-03-20 17:37:56'),
(27, 2, '2026-03-21', 'Memberi', 'Bapa', 200000.00, 'expense', '2026-03-20 17:38:10');

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
(3, 2, 'Coding / Mengerjakan Projek', 5, 'indigo', '2026-03-13 06:58:25'),
(4, 2, 'Lari', 5, 'rose', '2026-03-13 09:46:00');

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

--
-- Dumping data untuk tabel `habit_logs`
--

INSERT INTO `habit_logs` (`id`, `user_id`, `habit_id`, `log_date`, `created_at`) VALUES
(1, 2, 3, '2026-03-20', '2026-03-20 09:38:20'),
(2, 2, 1, '2026-03-20', '2026-03-20 09:38:28'),
(3, 2, 4, '2026-03-20', '2026-03-20 16:43:36'),
(4, 2, 3, '2026-03-21', '2026-03-21 11:02:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ibadah_daily`
--

CREATE TABLE `ibadah_daily` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `subuh` tinyint(1) DEFAULT 0,
  `dzuhur` tinyint(1) DEFAULT 0,
  `ashar` tinyint(1) DEFAULT 0,
  `maghrib` tinyint(1) DEFAULT 0,
  `isya` tinyint(1) DEFAULT 0,
  `dhuha` tinyint(1) DEFAULT 0,
  `tahajud` tinyint(1) DEFAULT 0,
  `puasa_senin` tinyint(1) DEFAULT 0,
  `puasa_kamis` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ibadah_daily`
--

INSERT INTO `ibadah_daily` (`id`, `user_id`, `log_date`, `subuh`, `dzuhur`, `ashar`, `maghrib`, `isya`, `dhuha`, `tahajud`, `puasa_senin`, `puasa_kamis`, `created_at`) VALUES
(1, 2, '2026-03-20', 1, 1, 1, 1, 1, 0, 0, 1, 0, '2026-03-20 03:30:18'),
(14, 2, '2026-03-21', 1, 1, 1, 1, 1, 0, 1, 0, 0, '2026-03-20 18:09:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `service` varchar(100) NOT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('New','Contacted','In Progress','Closed') DEFAULT 'New',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `service`, `budget`, `message`, `status`, `created_at`) VALUES
(5, 'Muhammad Bayu Nurdiansyah Putra', 'muhammadbayunp@gmail.com', '089663933263', 'Website Company Profile', '< 5 juta', 'web ', 'Contacted', '2026-03-20 04:19:42');

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
(9, 2, 'finance', 'Upgrade Motor CBR', 'Rp 8.000.000 All In', 40, 2026, 'current', '2026-03-13 06:58:25'),
(10, 2, 'timeline', 'Menikah', NULL, 0, 2028, 'upcoming', '2026-03-13 07:16:22'),
(11, 2, 'relationship', 'Tunangan', '', 20, 2027, 'current', '2026-03-13 07:21:06'),
(12, 2, 'finance', 'Umroh', 'Rp. 30.000.000', 0, 2027, 'upcoming', '2026-03-13 09:47:12'),
(13, 2, 'finance', 'Laptop Baru', '8-10 JT', 0, 2026, 'upcoming', '2026-03-21 11:21:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `life_vision`
--

CREATE TABLE `life_vision` (
  `user_id` int(11) NOT NULL,
  `statement` text NOT NULL,
  `values_list` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `life_vision`
--

INSERT INTO `life_vision` (`user_id`, `statement`, `values_list`, `updated_at`) VALUES
(2, 'Menjadi pribadi yang unggul di bidang teknologi, berintegritas, dan bermanfaat bagi masyarakat melalui pengembangan sistem digital, pendidikan, serta kontribusi nyata dalam kemajuan teknologi dan data di Indonesia', '[\"Mengembangkan Keahlian Teknologi Secara Berkelanjutan\",\"Membangun Karir Profesional yang Stabil dan Berdampak\",\"Melanjutkan Pendidikan untuk Memperluas Wawasan\",\"Membangun Stabilitas Keuangan dan Kemandirian\"]', '2026-03-21 11:13:50');

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
(4, 2, 5, 1500, '2026-03-13 09:18:13'),
(5, 2, 5, 1500, '2026-03-13 09:28:57'),
(6, 2, 5, 1500, '2026-03-13 09:33:09'),
(7, 2, 5, 1500, '2026-03-13 09:37:46'),
(8, 2, 6, 1500, '2026-03-20 16:41:14'),
(9, 2, 6, 1500, '2026-03-21 11:01:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `quran_last_read`
--

CREATE TABLE `quran_last_read` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `surah` varchar(100) NOT NULL,
  `ayat` int(11) NOT NULL,
  `page` int(11) NOT NULL,
  `juz` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `quran_last_read`
--

INSERT INTO `quran_last_read` (`id`, `user_id`, `surah`, `ayat`, `page`, `juz`, `updated_at`) VALUES
(1, 2, 'Al-Baqarah', 120, 18, 2, '2026-03-20 03:30:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `spiritual_reflections`
--

CREATE TABLE `spiritual_reflections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `gratitude` text DEFAULT NULL,
  `mistake` text DEFAULT NULL,
  `improvement` text DEFAULT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spiritual_reflections`
--

INSERT INTO `spiritual_reflections` (`id`, `user_id`, `log_date`, `gratitude`, `mistake`, `improvement`, `mood`, `created_at`) VALUES
(1, 2, '2026-03-20', '', NULL, NULL, 'bersyukur', '2026-03-20 03:30:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `spiritual_settings`
--

CREATE TABLE `spiritual_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quran_target_page` int(11) DEFAULT 1,
  `puasa_senin_kamis` tinyint(1) DEFAULT 1,
  `doa_after_sholat` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spiritual_settings`
--

INSERT INTO `spiritual_settings` (`id`, `user_id`, `quran_target_page`, `puasa_senin_kamis`, `doa_after_sholat`, `updated_at`) VALUES
(1, 2, 1, 1, 1, '2026-03-20 04:27:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `theme` varchar(20) DEFAULT 'light',
  `language` varchar(20) DEFAULT 'id',
  `time_format` varchar(10) DEFAULT '24h',
  `default_page` varchar(50) DEFAULT 'dashboard',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `system_settings`
--

INSERT INTO `system_settings` (`id`, `user_id`, `theme`, `language`, `time_format`, `default_page`, `updated_at`) VALUES
(1, 2, 'light', 'id', '24h', 'dashboard', '2026-03-20 04:27:26');

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
(2, 2, 'Halaman Pemeriksaan Backend', 'Kerja', 'Medium', 'done', 3, 2, '2026-03-13', '2026-03-13 01:08:52', '2026-03-13 06:47:10'),
(3, 2, 'Website MBNP Project', 'Pribadi', 'Medium', 'done', 4, 1, '2026-03-13', '2026-03-13 07:38:17', '2026-03-20 16:40:46'),
(4, 2, 'Website Picme Update Styling', 'Kerja', 'Medium', 'done', 2, 0, '2026-03-13', '2026-03-13 07:48:08', '2026-03-20 16:40:47'),
(5, 2, 'Zoom Bahasa Jepang Jam 3-5', 'Belajar', 'High', 'done', 3, 4, '2026-03-13', '2026-03-13 07:48:49', '2026-03-13 09:37:46'),
(6, 2, 'Menyelesaikan lms jepang', 'Belajar', 'High', 'in_progress', 4, 2, '2026-03-21', '2026-03-20 16:40:33', '2026-03-21 11:01:35');

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
  `phone` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `location`, `bio`, `photo`, `password`, `created_at`) VALUES
(2, 'Muhammad Bayu Nurdiansyah Putra', 'muhammadbayunp@gmail.com', '089663933263', 'Garut', 'MBNP\r\n', '/uploads/profiles/profil-2-1774090265993-597661830.jpeg', '$2b$10$PcKOb7sTfHFChCxb5x2R2.NaOD90my5nLzKKuzy/nUe2RDadTpjDi', '2026-03-12 10:05:29');

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
-- Indeks untuk tabel `amalan_daily`
--
ALTER TABLE `amalan_daily`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_amalan_date` (`user_id`,`log_date`);

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
-- Indeks untuk tabel `doa_pribadi`
--
ALTER TABLE `doa_pribadi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indeks untuk tabel `ibadah_daily`
--
ALTER TABLE `ibadah_daily`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_ibadah_date` (`user_id`,`log_date`);

--
-- Indeks untuk tabel `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `life_plans`
--
ALTER TABLE `life_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `life_vision`
--
ALTER TABLE `life_vision`
  ADD PRIMARY KEY (`user_id`);

--
-- Indeks untuk tabel `pomodoro_sessions`
--
ALTER TABLE `pomodoro_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indeks untuk tabel `quran_last_read`
--
ALTER TABLE `quran_last_read`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_quran_user` (`user_id`);

--
-- Indeks untuk tabel `spiritual_reflections`
--
ALTER TABLE `spiritual_reflections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reflection_date` (`user_id`,`log_date`);

--
-- Indeks untuk tabel `spiritual_settings`
--
ALTER TABLE `spiritual_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_spiritual` (`user_id`);

--
-- Indeks untuk tabel `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_setting` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT untuk tabel `amalan_daily`
--
ALTER TABLE `amalan_daily`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `debts`
--
ALTER TABLE `debts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `debt_payments`
--
ALTER TABLE `debt_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `doa_pribadi`
--
ALTER TABLE `doa_pribadi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `finances`
--
ALTER TABLE `finances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `habits`
--
ALTER TABLE `habits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `habit_logs`
--
ALTER TABLE `habit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `ibadah_daily`
--
ALTER TABLE `ibadah_daily`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `life_plans`
--
ALTER TABLE `life_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `pomodoro_sessions`
--
ALTER TABLE `pomodoro_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `quran_last_read`
--
ALTER TABLE `quran_last_read`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `spiritual_reflections`
--
ALTER TABLE `spiritual_reflections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `spiritual_settings`
--
ALTER TABLE `spiritual_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- Ketidakleluasaan untuk tabel `amalan_daily`
--
ALTER TABLE `amalan_daily`
  ADD CONSTRAINT `amalan_daily_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Ketidakleluasaan untuk tabel `doa_pribadi`
--
ALTER TABLE `doa_pribadi`
  ADD CONSTRAINT `doa_pribadi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Ketidakleluasaan untuk tabel `ibadah_daily`
--
ALTER TABLE `ibadah_daily`
  ADD CONSTRAINT `ibadah_daily_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Ketidakleluasaan untuk tabel `quran_last_read`
--
ALTER TABLE `quran_last_read`
  ADD CONSTRAINT `quran_last_read_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `spiritual_reflections`
--
ALTER TABLE `spiritual_reflections`
  ADD CONSTRAINT `spiritual_reflections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `spiritual_settings`
--
ALTER TABLE `spiritual_settings`
  ADD CONSTRAINT `spiritual_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
