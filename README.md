```markdown
# Media Storage (upload + public links)

Petite application Node.js pour stocker des images, audio et vidéos sur disque et renvoyer des liens publics.

Features:
- Upload simple (single/multiple)
- URLs publiques sous `/files/<filename>`
- Frontend minimal à `public/index.html`
- Filtre MIME et taille maximale (configurable)

Usage:
1. Installer
   ```bash
   npm install
   ```

2. Variables optionnelles (fichier `.env`):
   - PORT (défaut 3000)
   - UPLOAD_DIR (défaut `./uploads`)
   - BASE_URL (défaut `http://localhost:PORT`)
   - MAX_FILE_SIZE (en octets, ex: `524288000` pour 500MB)

3. Lancer
   ```bash
   npm start
   ```

4. Upload via `POST /upload` (champ `file`) ou `POST /upload-multiple` (champ `files[]`).
   Exemple curl:
   ```bash
   curl -F "file=@/path/to/file.jpg" http://localhost:3000/upload
   ```

Sécurité et recommandations:
- Pour production, utilisez un stockage cloud (S3) et générez des signed URLs si nécessaire.
- Protégez l'endpoint d'upload (authentification, rate limiting).
- Validez et scannez les fichiers si contenu sensible.
- Configurez HTTPS et limites de taille côté reverse-proxy (nginx).
```