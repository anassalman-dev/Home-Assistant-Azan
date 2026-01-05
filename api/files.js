// api/files.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const requestedPath = req.query.path || '';
  
  // Chemin vers le dossier public
  const publicDir = path.join(process.cwd(), 'public');
  const fullPath = path.join(publicDir, requestedPath);
  
  // Sécurité : vérifier qu'on reste dans le dossier public
  if (!fullPath.startsWith(publicDir)) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  
  // Vérifier que le dossier existe
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Dossier introuvable' });
  }
  
  // Vérifier que c'est bien un dossier
  const stats = fs.statSync(fullPath);
  if (!stats.isDirectory()) {
    return res.status(400).json({ error: 'Ce n\'est pas un dossier' });
  }
  
  try {
    const files = fs.readdirSync(fullPath);
    const items = [];
    
    for (const file of files) {
      // Ignorer les fichiers cachés
      if (file.startsWith('.')) continue;
      
      const filePath = path.join(fullPath, file);
      const fileStats = fs.statSync(filePath);
      
      items.push({
        name: file,
        type: fileStats.isDirectory() ? 'dir' : 'file',
        size: fileStats.isDirectory() ? null : fileStats.size,
        modified: fileStats.mtime
      });
    }
    
    res.status(200).json({
      success: true,
      path: requestedPath,
      items: items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};