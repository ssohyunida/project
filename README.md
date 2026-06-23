Elevator Portfolio — Prototype

This is a minimal React CDN-based prototype demonstrating the elevator interaction PRD.

Files:
- index.html — entry using React + Babel from CDN
- style.css — core styles for the elevator scene and doors
- app.js — React component implementing state rules and animations

How to run (prototype):
Open `index.html` in a browser (live server or file open). For best results use a static server such as:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Vite app (production scaffold):

```bash
cd vite-app
npm install
npm run dev
# open http://localhost:5173
```

Notes:
- The CDN prototype demonstrates interaction and animation quickly.
- The `vite-app` folder contains a minimal Vite + React scaffold with the same Elevator demo, ready for further development.