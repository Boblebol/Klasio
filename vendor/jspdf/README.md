# jsPDF (vendored)

Bundle UMD minifié de [jsPDF](https://github.com/parallax/jsPDF) — utilisé pour
l'export PDF de la répartition des classes.

- **Version** : 4.2.1
- **Licence** : MIT (voir `LICENSE`)
- **Build** : `dist/jspdf.umd.min.js` de [npm jspdf@4.2.1](https://www.npmjs.com/package/jspdf/v/4.2.1)

## Pourquoi vendorisé ?

Le fichier est livré avec le site pour :

1. **Fonctionner hors ligne** — l'app est déployée comme SPA autonome, aucune
   dépendance CDN runtime.
2. **Renforcer la CSP** — `script-src 'self'` suffit, plus besoin d'autoriser
   `cdnjs.cloudflare.com`.
3. **Confidentialité** — aucune requête extérieure depuis le navigateur du
   directeur une fois la page chargée.

## Rafraîchir la version

```bash
npm install --save-dev jspdf@<version>
cp node_modules/jspdf/dist/jspdf.umd.min.js vendor/jspdf/jspdf.umd.min.js
cp node_modules/jspdf/LICENSE              vendor/jspdf/LICENSE
```

Puis mettre à jour la version ci-dessus.
