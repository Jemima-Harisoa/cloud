# 🎨 SIGNAL-EO - Design System & Guidelines

## 📱 Application Overview
**Nom**: Signal-eo  
**Tagline**: Suivi des travaux routiers à Antananarivo  
**Design**: Modern Offline-First Design  
**Thème**: Blanc fond, noir texte, accent: Vert, Jaune, Rose  

---

## 🎯 Palette de Couleurs

### Couleurs Principales
```
🟢 Vert Primaire:  #22c55e (Vert Signal - Terminé, Succès)
🟡 Jaune Primaire: #eab308 (Alerte - Warning)
💗 Rose Primaire:  #ec4899 (Accentuation - Call to action)
```

### Couleurs de Statut Routier
```
🔴 Nouveau:      #ff6b6b (Rouge - Problème détecté)
🟠 En cours:     #ffa500 (Orange - Travaux en progression)
🟢 Terminé:      #22c55e (Vert - Problème résolu)
```

### Couleurs Neutres
```
⚪ Fond Blanc:    #ffffff
🩶 Texte Noir:   #1a1a1a
⬜ Fond Light:   #f8fafc
⬜ Gris Clairs:  #f1f5f9
⬜ Gris Borders: #e2e8f0
```

---

## 🏗️ Structure de Base

### Header (Sticky Navigation)
```
┌─────────────────────────────────────────────┐
│ 📍 Signal-eo          [Connecté: John]      │
│    Suivi travaux      [🚪 Déconnexion]      │
└─────────────────────────────────────────────┘
```

**Logo**: Icône 📍 + Texte "Signal-eo" en gradient vert-rose  
**Tagline**: "Suivi des travaux routiers" en gris  
**Actions**: Utilisateur + Bouton déconnexion  

---

## 🎨 Composants UI

### 1. BUTTONS
```css
.btn-primary    → Gradient vert-jaune + shadow
.btn-secondary  → Gris fond + border rose
.btn-outline    → Transparent + light border
.btn-logout     → Rouge (#ff6b6b)
```

**Style**: Rounded 8px, padding 0.75rem 1.5rem, font-weight 600

### 2. CARDS
```
┌──────────────────────┐
│ 📍 Card Title        │
│                      │
│ Card description     │
│ with subtle border   │
└──────────────────────┘
```

**Style**: White bg, 1px gray border, shadow-sm hover:shadow-md  
**Border Radius**: 12px  
**Padding**: 1.5rem  

### 3. INFO BOXES
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
│ 🟢 Information Box
│ Avec border-left
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

**Types**:
- `info-box` → Green border + light green bg
- `info-box.warning` → Yellow border + light yellow bg
- `info-box.alert` → Pink border + light pink bg

### 4. STATUS BADGES
```
[🔴 NOUVEAU]    [🟠 EN COURS]    [🟢 TERMINÉ]
```

---

## 📐 Grid Layouts

### grid-2 (2 colonnes)
```
Utilisé pour: Feature cards, info sections
Min-width: 300px
Gap: 2rem
```

### grid-3 (3 colonnes)
```
Utilisé pour: Status info cards
Min-width: 250px
Gap: 1.5rem
```

### grid-4 (4 colonnes)
```
Utilisé pour: Quick stats
Min-width: 200px
Gap: 1.5rem
```

---

## 🖼️ Pages Design

### 1. PAGE VISITEUR (Public)
```
Header
├─ Logo Signal-eo + buttons login/register
├─ Title: "🌍 Travaux Routiers - Antananarivo"
├─ Info cards (4x):
│  ├─ 🔴 Points Rouges = NOUVEAU
│  ├─ 🟠 Points Orange = EN COURS
│  ├─ 🟢 Points Verts = TERMINÉ
│  └─ ℹ️ Cliquez sur un Point
├─ Stats section (stats cards - grid-3)
├─ Map section (interactive map)
└─ CTA Footer: "Se Connecter Maintenant"
```

**Couleur Thème**: Blanc fond, infos cards avec hover effect  
**Typography**: Noir texte, gris pour descriptions  

### 2. PAGE UTILISATEUR/CLIENT
```
Header
├─ Welcome: "👤 Tableau de Bord Utilisateur"
├─ Greeting: "Bienvenue, [FirstName]!"
├─ Features (grid-2):
│  ├─ 🗺️ Voir la Carte
│  ├─ 📍 Mes Signalements
│  ├─ 📊 Statistiques
│  └─ ✏️ Modifier Profil
├─ Map section (with filter checkbox)
└─ Action buttons: [⚙️ Mon Profil] [🚪 Déconnexion]
```

**Accent Color**: Vert (primary-green)  

### 3. PAGE MANAGER/ADMIN
```
Header
├─ Title: "🔧 Tableau de Bord Manager"
├─ Greeting: "Bienvenue, [FirstName] (Admin)"
├─ Tabs Navigation:
│  ├─ 🗺️ Gestion des Signalements (ACTIVE tab)
│  └─ 🔒 Utilisateurs Bloqués
├─ TAB 1: Map with edit modal
├─ TAB 2: Blocked users table
└─ Action buttons: [⚙️ Mon Profil] [🚪 Déconnexion]
```

**Tabs Style**: Underline active, bottom-border green  
**Table**: Gray header, white rows, hover highlight  

---

## 📊 Composant Map

### Markers
```
🔴 Nouveau (Red)     → #ff6b6b
🟠 En cours (Orange) → #ffa500
🟢 Terminé (Green)   → #22c55e
```

### Popup Info
```
┌─────────────────────┐
│ 📅 Date: 25/12/2025 │
│ 📊 Status: EN COURS │
│ 📐 Surface: 450 m² │
│ 💰 Budget: 5,000 Ar │
│ 🏢 Entreprise: XYZ  │
│ [Modifier] [❌ Supp]│
└─────────────────────┘
```

---

## 🎯 Typography

### Font Family
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Font Sizes
```
h1: 2rem (32px) - Bold
h2: 1.75rem (28px) - Bold  
h3: 1.25rem (20px) - Semibold
p: 1rem (16px) - Regular
small: 0.95rem (15px) - Regular
```

### Font Weights
```
400 (Regular) - Body text
600 (Semibold) - Labels, secondary text
700 (Bold) - Headings
800 (ExtraBold) - Main titles, section headers
```

---

## 🎨 Responsive Design

### Breakpoints
```
Desktop: 1400px max-width
Tablet: 768px
Mobile: < 400px
```

### Mobile Adjustments
```
- Header: Column layout
- Grids: Single column (grid-template-columns: 1fr)
- Buttons: Full width
- Tables: Reduced padding
- Font sizes: -10% reduction
```

---

## ✨ Effects & Interactions

### Hover Effects
```
Cards:     translateY(-5px) + shadow-md + border change
Buttons:   translateY(-2px) + shadow enhancement
Links:     Color change + underline
Tables:    Row highlight (light gray bg)
```

### Focus States
```
Forms:     Green border + subtle green shadow
Buttons:   Visible outline
```

### Animations
```
Duration: 0.3s
Easing: ease
Properties: all
```

---

## 📋 Consistent Usage

### When to Use Which Color

| Élément | Couleur | Raison |
|---------|---------|--------|
| Primary CTA buttons | Vert (#22c55e) | Succès, action positive |
| Accent highlights | Rose (#ec4899) | Attirer l'attention |
| Warning boxes | Jaune (#eab308) | Avertissements |
| Success messages | Vert (#22c55e) | Confirmation |
| Error messages | Rouge (#ff6b6b) | Problèmes |
| Links | Gris (#64748b) + Vert hover | Navigation |

### When to Use Grid Layouts

| Layout | Use Case | Colonnes |
|--------|----------|----------|
| grid-2 | Feature cards, sections | 300px min |
| grid-3 | Info cards, stats | 250px min |
| grid-4 | Quick stats, icons | 200px min |

---

## 🔍 Accessibility

- ✅ Sufficient color contrast (black on white)
- ✅ Clear focus states
- ✅ Semantic HTML
- ✅ Descriptive button labels
- ✅ No color alone for information

---

## 💾 Offline-First Design

### Considerations
```
✅ No gradients that require rendering (use solid + gradient combinations)
✅ No external fonts (system fonts)
✅ No animations that are too complex
✅ Icons: Emoji (already in system)
✅ Images: Minimize use, embed SVGs when needed
✅ States: Clear visual feedback without animations
```

---

## 📱 Component Library Files

| Fichier | Description |
|---------|-------------|
| `signal-eo-design.css` | Design system base styles |
| `VisitorPage.css` | Visitor page specific styles |
| `UserDashboard.css` | User dashboard styles |
| `ManagerPage.css` | Manager dashboard styles |
| `SignalEoHeader.jsx` | Reusable header component |

---

## 🚀 How to Use Design System

### 1. Import Base Styles
```jsx
import '../styles/signal-eo-design.css';
```

### 2. Use Classes
```jsx
<button className="btn btn-primary">Action</button>
<div className="card">Content</div>
<div className="info-box warning">Warning</div>
```

### 3. Use CSS Variables
```css
color: var(--primary-green);
background: var(--bg-white);
box-shadow: var(--shadow-md);
```

---

## ✅ Quality Checklist

- ✅ All backgrounds are white (#ffffff)
- ✅ All text is black (#1a1a1a) or gray variants
- ✅ Primary accent is green (#22c55e)
- ✅ Secondary colors are yellow & pink
- ✅ Shadows are subtle (not dark)
- ✅ Rounded corners: 8px standard, 12px for cards
- ✅ No gradients in backgrounds (except buttons)
- ✅ Offline compatible (no external dependencies)
- ✅ Responsive on mobile (< 768px)
- ✅ Accessible contrast ratios

---

## 📝 Notes

**Design Philosophy**: 
- Clean, modern, minimalist
- Offline-first (no heavy animations)
- Work/productivity focused
- Green = Success, progress, positivity
- White = Clean, professional
- Pink = Energy, action, accent

**Target User**: 
Residents of Antananarivo reporting and tracking road issues  
City managers coordinating road work

**Accessibility First**: 
Designed for readability and usability in all environments

---

**Version**: 1.0.0  
**Last Updated**: 2 février 2026  
**Status**: ✅ PRODUCTION READY
