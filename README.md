# 🏛️ Office of Congressman Roy M. Gonzales — Official Portal

Official website and constituent portal of **Congressman Roy M. Gonzales**, representing the **Lone District of Santa Rosa, Laguna** in the House of Representatives of the Philippines.

> *"Sa Bagong Kongreso, Ramdam ang Serbisyo"*

---

## 📌 Overview

A lightweight, high-performance civic portal built on a pure vanilla stack (HTML5, Modern CSS, Vanilla JS) with zero runtime dependencies. Engineered with institutional authority, tabular precision, and tactile interaction design, the platform provides constituents with immediate access to legislative updates, district programs, and the official **CHED TDP Scholarship Checker**.

---

## ✨ Key Features & Interaction Systems

### 1. Executive Ceremonial Intro
* **Ceremonial Arrival:** On initial entry, visitors are greeted with a high-contrast official entrance showcasing the City of Santa Rosa seal, House of Representatives seal, and Bagong Kongreso emblem.
* **Spring Curtain Reveal:** Smoothly transitions into the main portal using GPU-accelerated spring physics.
* **Instant Bypass:** Constituents with urgent tasks can instantly bypass the intro by clicking anywhere, clicking *"Enter Official Portal"*, or pressing `Enter`, `Escape`, or `Space`.
* **Session Memory:** Stores a session flag in `sessionStorage` so returning visitors skip the intro with zero layout flicker. Preview at any time by appending `?intro=1` to the URL.

### 2. Tactile Sliding Pill Navigation
* **Hardware-Accelerated Switching:** View transitions between *Overview*, *Legislative Ledger*, and *District Programs* feature a sliding pill indicator animated with CSS `transform` (`translate3d` and `scaleX`).
* **Spring Easing:** Custom cubic bezier curves ensure fluid, responsive tab movement without unnatural bounce.

### 3. Legislative Ledger & District Milestones
* **Tabular Numeric Precision:** Real-time metrics and milestone figures use tabular numeric formatting (`font-variant-numeric: tabular-nums`) for clean vertical scanning.
* **Milestone Filtering:** Interactive category filtering for authored House Bills, local infrastructure, and humanitarian relief.

### 4. Privacy-Protected CHED TDP Scholarship Checker
* **Command Drawer Architecture:** A responsive sliding drawer on desktop that converts into an ergonomic swipeable sheet on mobile screens (complete with touch gesture dismissal).
* **Keyboard Navigation:** Rapidly accessible via `/` or `Ctrl + K` anywhere on the page; dismissable via `Escape`.
* **Privacy by Design:** Internal database identifiers and quick-search bulk disclosures are withheld to protect applicant confidentiality.
* **Live Search & Match Highlighting:** Real-time substring matching across applicant names and student numbers with highlighted query terms and one-tap reference code copying.

### 5. Notification Toast Engine
* **Tactile Feedback:** Spring-animated notifications confirm clipboard actions and status updates with automatic dismissal.

---

## 🗂️ Project Structure

```
crmg-website/
├── index.html                 # Main website and semantic DOM structure
├── styles.css                 # Design system, CSS variables, and layout styles
├── script.js                  # Interaction engine, drawer controls, and search logic
├── applicants.json            # CHED TDP qualified applicants data (production JSON)
├── tdp_applicants.csv         # Source CSV of applicant records
├── tdp_read.py                # Python utility to convert source data → applicants.json
├── README.md                  # Project documentation
└── images/
    ├── congressmanroygonzales.jpg   # Official portrait of Congressman Roy M. Gonzales
    ├── crmg_profile.jpg             # Profile photo asset
    ├── logo-santarosa.png           # Official Seal of the City of Santa Rosa
    ├── logo-hor.png                 # Seal of the House of Representatives
    ├── bagongkongreso.png           # Emblem of Bagong Kongreso
    └── crmgpic1–16.png/jpg          # Community activities and district project photos
```

---

## 🚀 Getting Started

No build steps, compilers, or Node packages required.

### Local Development

Because the scholarship search fetches `applicants.json` via the Fetch API, run a lightweight local HTTP server to prevent local browser CORS restrictions:

```bash
# Python 3
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

> **Tip:** To test or preview the ceremonial intro splash on demand, navigate to:  
> `http://localhost:8000/?intro=1`

---

## 🎓 Scholarship Data Pipeline

1. Update the source records in `tdp_applicants.csv` (or source spreadsheet).
2. Run the extraction script:
   ```bash
   python tdp_read.py
   ```
3. The script sanitizes names, formats student numbers, and outputs an optimized `applicants.json` loaded dynamically by the client.

---

## 🎨 Design System & Tokens

### Typography
* **Display & Body:** [Public Sans](https://fonts.google.com/specimen/Public+Sans) (weights 400, 500, 600, 700, 800) for authoritative civic hierarchy.
* **Monospace / Data:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for tabular figures, keyboard shortcuts, and verification codes.

### Color Palette
| Token | Hex Value | Application |
|---|---|---|
| `--civic-navy` | `#0a1628` | Primary institutional headers and banners |
| `--civic-navy-dark` | `#050c17` | Intro screen canvas and dark borders |
| `--civic-red` | `#c8102e` | Primary interactive buttons, highlights, accents |
| `--civic-gold` | `#b45309` | Official seals, status notices, ceremonial hairlines |
| `--canvas` | `#f8f9fb` | Clean page background |
| `--surface` | `#ffffff` | Elevated cards and drawer surface |
| `--border` | `#e2e8f0` | Subtle hairline dividers and component borders |

### Elevation & Accessibility
* **Neutral Elevation:** Strictly calibrated soft drop-shadows with offset and blur (no harsh neobrutalist borders or colored halos).
* **Defensive Asset Sizing:** Explicit inline SVG and image dimensions to eliminate layout shifts and prevent mobile browser scaling bugs.
* **Motion Accessibility:** Complete `@media (prefers-reduced-motion: reduce)` support with immediate duration fallbacks.

---

## 🌐 Deployment (GitHub Pages)

The project is hosted and deployed via **GitHub Pages** from the `main` branch.

To publish updates:
```bash
git add .
git commit -m "feat: updates to website and documentation"
git push origin main
```

Changes become live within 1 to 2 minutes.

---

## 📄 License & Attribution

This portal and its contents are for the official public service of the **Office of Congressman Roy M. Gonzales, Lone District of Santa Rosa, Laguna**.

---

*Office of the Representative — Lone District of Santa Rosa, Laguna*
