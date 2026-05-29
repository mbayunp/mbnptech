import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Templates
  const templates = [
    { name: 'Romantic Sweet', code: 'romantic', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300' },
    { name: 'Islami Elegant', code: 'islami', thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=300' },
    { name: 'Royal Luxury', code: 'luxury', thumbnail: 'https://images.unsplash.com/photo-1507504038482-7621ee28c249?auto=format&fit=crop&q=80&w=300' },
    { name: 'Minimal Modern', code: 'minimal', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300' },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { code: t.code },
      update: {},
      create: t,
    });
  }
  console.log('Templates seeded.');

  // 2. Create User
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@mbnp.my.id' },
    update: {},
    create: {
      email: 'admin@mbnp.my.id',
      password: passwordHash,
      name: 'MBNP Admin',
      role: 'admin',
    },
  });
  console.log('Admin user seeded.');

  // 3. Create Sample Invitation
  const weddingDate = new Date();
  weddingDate.setDate(weddingDate.getDate() + 90); // 3 months from now

  const invitation = await prisma.invitation.upsert({
    where: { subdomain: 'andi-salsa' },
    update: {},
    create: {
      subdomain: 'andi-salsa',
      title: 'The Wedding of Andi & Salsa',
      weddingDate: weddingDate,
      themeColor: '#e11d48', // rose-600
      welcomeText: 'Kami mengundang Anda untuk merayakan hari bahagia pernikahan kami.',
      address: 'Grand Ballroom Hotel Mulia, Jakarta Selatan',
      mapUrl: 'https://maps.app.goo.gl/dummy-map-url',
      musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isPublished: true,
      userId: user.id,
      templateCode: 'romantic',
      galleries: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', caption: 'The First Day We Met', sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', caption: 'Proposal Day', sortOrder: 2 },
          { imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', caption: 'Pre-wedding Session', sortOrder: 3 },
        ],
      },
      stories: {
        create: [
          { date: new Date('2023-05-20'), title: 'Perkenalan Pertama', content: 'Kami pertama kali bertemu di sebuah cafe kopi di Jakarta Barat secara tidak sengaja.', sortOrder: 1 },
          { date: new Date('2024-08-15'), title: 'Menjalin Komitmen', content: 'Setelah setahun saling mengenal lebih dekat, kami memutuskan berkomitmen untuk serius.', sortOrder: 2 },
          { date: new Date('2025-12-25'), title: 'Lamaran', content: 'Di depan keluarga besar, Andi melamar Salsa secara resmi.', sortOrder: 3 },
        ],
      },
      guests: {
        create: [
          { name: 'Keluarga Budi', code: 'BUDI-VIP', address: 'Bandung', isSent: true },
          { name: 'Teman Kantor Roni', code: 'RONI-COLLEAGUE', address: 'Jakarta', isSent: false },
        ],
      },
      rsvps: {
        create: [
          { name: 'Budi Santoso', attendance: true, guestCount: 2, message: 'Selamat ya Andi & Salsa! Semoga lancar sampai hari H!' },
          { name: 'Roni Wijaya', attendance: true, guestCount: 1, message: 'Insya Allah hadir. Selamat!' },
        ],
      },
    },
  });

  console.log('Sample invitation (andi-salsa) seeded.');
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
