const fs = require('fs');
const path = require('path');

const filesToProcess = [
  { path: 'frontend/src/pages/public/Contact.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/layouts/AdminLayout.tsx', importPath: '../config/api' },
  { path: 'frontend/src/pages/admin/Spiritual.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/LifePlan.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Settings.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Habits.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Inquiry.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Dashboard.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Activity.tsx', importPath: '../../config/api' },
  { path: 'frontend/src/pages/admin/Achievements.tsx', importPath: '../../config/api' }
];

filesToProcess.forEach(fileInfo => {
  const fullPath = path.join(__dirname, fileInfo.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if no match
  if (!content.includes('http://localhost:5000')) {
      console.log(`No http://localhost:5000 found in ${fileInfo.path}, skipping.`);
      return;
  }
  
  // Replace 'http://localhost:5000...' with `${API_URL}...`
  content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, "`\\${API_URL}$1`");
  
  // Replace `http://localhost:5000...` with `${API_URL}...`
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`\\${API_URL}$1`");

  // Add import statement if not already there
  if (!content.includes('import { API_URL }')) {
    const importStatement = `import { API_URL } from '${fileInfo.importPath}';\n`;
    
    // Find last import statement
    const importRegex = /import.*from.*['"];?/g;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }

    if (lastImportIndex > 0) {
      const newlineIndex = content.indexOf('\n', lastImportIndex);
      if (newlineIndex !== -1) {
         content = content.slice(0, newlineIndex + 1) + importStatement + content.slice(newlineIndex + 1);
      } else {
         content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      }
    } else {
      content = importStatement + content;
    }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${fileInfo.path}`);
});
