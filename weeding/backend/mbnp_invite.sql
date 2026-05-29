-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Bulan Mei 2026 pada 15.46
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
-- Database: `mbnp_invite`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `analytics`
--

CREATE TABLE `analytics` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `visitor_ip` varchar(100) DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `analytics`
--

INSERT INTO `analytics` (`id`, `invitation_id`, `visitor_ip`, `device`, `browser`, `country`, `city`, `visited_at`) VALUES
(1, 3, '::1', 'Desktop', 'Chrome', 'Indonesia', 'Jakarta', '2026-05-29 06:16:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `galleries`
--

CREATE TABLE `galleries` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `image_url` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `galleries`
--

INSERT INTO `galleries` (`id`, `invitation_id`, `image_url`, `sort_order`, `created_at`) VALUES
(3, 3, '&#x2F;uploads&#x2F;galleries&#x2F;1780060272722-82403278-4.jpeg', 0, '2026-05-29 06:16:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `gifts`
--

CREATE TABLE `gifts` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `qris_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `guests`
--

CREATE TABLE `guests` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `unique_code` varchar(255) DEFAULT NULL,
  `qr_code` text DEFAULT NULL,
  `is_attended` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `invitations`
--

CREATE TABLE `invitations` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `template_id` bigint(20) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `subdomain` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `groom_name` varchar(255) DEFAULT NULL,
  `bride_name` varchar(255) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `location` text DEFAULT NULL,
  `maps_url` text DEFAULT NULL,
  `music_url` text DEFAULT NULL,
  `cover_image` text DEFAULT NULL,
  `theme` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `invitations`
--

INSERT INTO `invitations` (`id`, `user_id`, `template_id`, `slug`, `subdomain`, `title`, `description`, `groom_name`, `bride_name`, `event_date`, `event_time`, `location`, `maps_url`, `music_url`, `cover_image`, `theme`, `is_active`, `is_premium`, `created_at`, `updated_at`) VALUES
(3, 1, 1, 'bayu-hiba', 'bayu-hiba', 'bayu hiba', 'Kami mengundang Anda untuk merayakan pernikahan kami.', NULL, NULL, '0000-12-31', NULL, 'z', 'https:&#x2F;&#x2F;share.google&#x2F;S8LGoL1uaSOLC8KMU', '&#x2F;uploads&#x2F;music&#x2F;1780060268036-235086404-alarm.mp3', '&#x2F;uploads&#x2F;covers&#x2F;1780060260799-885494933-logo1.png', '#085090', 1, 1, '2026-05-29 06:16:15', '2026-05-29 13:16:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `invitation_sections`
--

CREATE TABLE `invitation_sections` (
  `id` bigint(20) NOT NULL,
  `section_name` varchar(191) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `invitation_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `invitation_sections`
--

INSERT INTO `invitation_sections` (`id`, `section_name`, `is_enabled`, `invitation_id`) VALUES
(1, 'hero', 1, 3),
(2, 'bride', 1, 3),
(3, 'gallery', 1, 3),
(4, 'countdown', 1, 3),
(5, 'story', 1, 3),
(6, 'gift', 1, 3),
(7, 'rsvp', 1, 3),
(8, 'maps', 1, 3),
(9, 'music', 1, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `invitation_id`, `payment_method`, `amount`, `status`, `transaction_id`, `paid_at`, `created_at`) VALUES
(1, 1, 3, 'MOCK_QRIS', 150000.00, 'paid', 'MBNP-1780060581280-99587', '2026-05-29 06:16:21', '2026-05-29 06:16:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rsvps`
--

CREATE TABLE `rsvps` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `attendance_status` enum('hadir','tidak_hadir','ragu') DEFAULT 'ragu',
  `guest_count` int(11) DEFAULT 1,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `stories`
--

CREATE TABLE `stories` (
  `id` bigint(20) NOT NULL,
  `invitation_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `story_date` date DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `templates`
--

CREATE TABLE `templates` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `thumbnail` text DEFAULT NULL,
  `preview_url` text DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `price` decimal(12,2) DEFAULT 0.00,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `templates`
--

INSERT INTO `templates` (`id`, `name`, `slug`, `category`, `thumbnail`, `preview_url`, `is_premium`, `price`, `status`, `created_at`) VALUES
(1, 'Romantic', 'romantic', 'wedding', '/templates/romantic.jpg', '/preview/romantic', 0, 0.00, 'active', '2026-05-29 13:15:00'),
(2, 'Islami', 'islami', 'wedding', '/templates/islami.jpg', '/preview/islami', 0, 0.00, 'active', '2026-05-29 13:15:00'),
(3, 'Luxury', 'luxury', 'wedding', '/templates/luxury.jpg', '/preview/luxury', 1, 150000.00, 'active', '2026-05-29 13:15:00'),
(4, 'Minimal', 'minimal', 'wedding', '/templates/minimal.jpg', '/preview/minimal', 0, 0.00, 'active', '2026-05-29 13:15:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `theme_settings`
--

CREATE TABLE `theme_settings` (
  `id` bigint(20) NOT NULL,
  `primary_color` varchar(191) NOT NULL DEFAULT '#4f46e5',
  `secondary_color` varchar(191) NOT NULL DEFAULT '#ec4899',
  `font_family` varchar(191) NOT NULL DEFAULT 'sans',
  `animation_style` varchar(191) NOT NULL DEFAULT 'fade',
  `background_style` varchar(191) NOT NULL DEFAULT 'solid',
  `invitation_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `theme_settings`
--

INSERT INTO `theme_settings` (`id`, `primary_color`, `secondary_color`, `font_family`, `animation_style`, `background_style`, `invitation_id`) VALUES
(1, '#4f46e5', '#ec4899', 'sans', 'fade', 'solid', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `avatar`, `role`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'bayu', 'muhammadbayunp@gmail.com', '$2a$10$7iz9pxzbDG891rwmt7LH5O3AnN3JeSk934uoZtNNGK72FeJX15RSu', NULL, NULL, 'user', 0, '2026-05-29 05:38:24', '2026-05-29 05:38:24');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `gifts`
--
ALTER TABLE `gifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `guests`
--
ALTER TABLE `guests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `subdomain` (`subdomain`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `template_id` (`template_id`);

--
-- Indeks untuk tabel `invitation_sections`
--
ALTER TABLE `invitation_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invitation_sections_invitation_id_section_name_key` (`invitation_id`,`section_name`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refresh_tokens_token_key` (`token`),
  ADD KEY `refresh_tokens_user_id_fkey` (`user_id`);

--
-- Indeks untuk tabel `rsvps`
--
ALTER TABLE `rsvps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invitation_id` (`invitation_id`);

--
-- Indeks untuk tabel `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `theme_settings_invitation_id_key` (`invitation_id`);

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
-- AUTO_INCREMENT untuk tabel `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `gifts`
--
ALTER TABLE `gifts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `guests`
--
ALTER TABLE `guests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `invitation_sections`
--
ALTER TABLE `invitation_sections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rsvps`
--
ALTER TABLE `rsvps`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `stories`
--
ALTER TABLE `stories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `templates`
--
ALTER TABLE `templates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `theme_settings`
--
ALTER TABLE `theme_settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `analytics`
--
ALTER TABLE `analytics`
  ADD CONSTRAINT `analytics_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `galleries`
--
ALTER TABLE `galleries`
  ADD CONSTRAINT `galleries_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `gifts`
--
ALTER TABLE `gifts`
  ADD CONSTRAINT `gifts_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `guests`
--
ALTER TABLE `guests`
  ADD CONSTRAINT `guests_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `invitation_sections`
--
ALTER TABLE `invitation_sections`
  ADD CONSTRAINT `invitation_sections_invitation_id_fkey` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rsvps`
--
ALTER TABLE `rsvps`
  ADD CONSTRAINT `rsvps_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD CONSTRAINT `theme_settings_invitation_id_fkey` FOREIGN KEY (`invitation_id`) REFERENCES `invitations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
