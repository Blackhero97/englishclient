# PWA Icon Generation Guide

## 🎨 Ikonlarni Yaratish

### Option 1: Online Tool (Oson)
1. `icon.svg` faylini oching
2. https://realfavicongenerator.net ga o'ting
3. SVG ni yuklang
4. Barcha kerakli o'lchamlarni generate qiling
5. Download qiling va `public/` papkasiga joylashtiring

### Option 2: Favicon.io
1. https://favicon.io/favicon-converter/ ga o'ting
2. SVG/PNG yuklang (min 260x260)
3. Generate qiling
4. Download va extract
5. Fayllarni public/ ga copy qiling

### Option 3: PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator icon.svg public --icon-only
```

## 📐 Kerakli O'lchamlar

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## 🎯 Design Tips

- Oddiy va tushunarli design
- Yaxshi contrast
- Kichik o'lchamda ham ko'rinishi kerak
- Brand colors ishlatish
- Maskable icon uchun safe zone (20% padding)

## 📱 Test

1. Build qiling: `npm run build`
2. Preview qiling: `npm run preview`
3. DevTools → Application → Manifest
4. Ikonlar to'g'ri yuklanganini tekshiring
