const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'frontend/src/pages/public/Contact.tsx',
  'frontend/src/layouts/AdminLayout.tsx',
  'frontend/src/pages/admin/Spiritual.tsx',
  'frontend/src/pages/admin/LifePlan.tsx',
  'frontend/src/pages/admin/Settings.tsx',
  'frontend/src/pages/admin/Habits.tsx',
  'frontend/src/pages/admin/Inquiry.tsx',
  'frontend/src/pages/admin/Dashboard.tsx',
  'frontend/src/pages/admin/Activity.tsx',
  'frontend/src/pages/admin/Achievements.tsx'
];

filesToProcess.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  // Find all `\${API_URL} and replace with `${API_URL}
  content = content.replace(/\\\$\{API_URL\}/g, '${API_URL}');
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed backslashes in ${file}`);
});
