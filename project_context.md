# Dominion Estates - Project Context & Documentation

This document serves as the central context and developer guide for the Dominion Estates website. It covers the project's brand identity, technical stack, content copy, structure, and future deployment steps.

---

## 1. Project Overview & Goals
Dominion Estates is a premium furnished rental brand focusing on mid-term (30+ days) luxury stays in Newport Beach, California. 
The objective of this project is to build a high-converting, hospitality-grade, and trustworthy direct-booking and inquiry website.

### Key Objectives:
- Showcase 2 premium Newport Beach furnished rentals with detailed descriptions, amenities, and image sliders.
- Provide secure payment paths using a pre-configured Square payment link for reservation deposits.
- Establish trust through professional design, badges, safety details, and references.
- Optimise for local SEO to attract corporate travelers, travel nurses, and individuals needing temporary housing in Newport Beach.
- Build using pure static web technologies (HTML, CSS, TypeScript/JavaScript) for free hosting on GitHub Pages, with future compatibility for Vercel.

---

## 2. Brand Identity & Design Guidelines
The design reflects a modern, warm, and elite coastal hospitality aesthetic (reminiscent of high-end boutique hotels rather than corporate housing).

- **Typography**:
  - Headings: Serif (`Playfair Display` or `Georgia`)
  - Body & UI: Clean, legible Sans-Serif (`Inter` or `System UI`)
- **Color Palette**:
  - **Deep Navy**: `#0A1931` (Primary branding, nav, footers, headers)
  - **Warm Gold**: `#C5A880` / `#D4AF37` (Accents, active states, key buttons, icons)
  - **Soft Beige**: `#FDFBF7` / `#F8F5F0` (Secondary section backgrounds, modal card backgrounds)
  - **Pure White**: `#FFFFFF` (Primary backgrounds, listing card bodies)
  - **Charcoal Text**: `#1A1D20` (Body copy, forms)
  - **Slate Gray**: `#64748B` (Secondary text, descriptions)
- **UI Elements**:
  - Thin borders, subtle shadow elevations (`0 4px 20px rgba(0,0,0,0.05)`).
  - Smooth scale transitions on listing cards and buttons.
  - Full-screen modal details with clean image galleries, arrow controls, and indicators.

---

## 3. Section Outline
The site is structured as a single-page website with the following key sections:
1. **Header Navigation**: Contains the "Dominion Estates" logo and responsive links (`Listings`, `Payment Options`, `Why Choose`, `Contact`).
2. **Hero Section**: Full-height introductory banner with a high-end beach house backdrop, custom copy, and instant CTAs.
3. **Trust Badges Bar**: Clean badges displaying "Secure Square Payments", "KeyCheck Available", "References Available", "Self Check-In", "Utilities Included", "30+ Day Stays".
4. **Featured Listings Grid**: Layout of the 2 Newport Beach units featuring image sliders, location badges, brief details, and quick inquiry/deposit actions.
5. **Property Details Modal**: Pop-up view activated by clicking any listing, showing expanded descriptions, complete amenities, image galleries, and booking inquiry forms.
6. **Payment Options Section**: Step-by-step description of payment steps (refundable deposit, weekly balance) and a dedicated button linking to the Square Deposit portal (`https://square.link/u/UtOUcZAp`).
7. **Verification & Guest Safety**: Copy clarifying Furnished Finder/Airbnb/Vrbo references and explaining the safety procedure for unit access.
8. **Why Choose Dominion Estates**: Summary of value propositions (move-in ready, prime locations, responsive team, secure checkout).
9. **Contact & Booking Inquiry**: Full inquiry form feeding into Formspree, featuring property dropdowns and desired move-in date selectors.
10. **Footer**: Quick links, office location, copyright, and mailto info.

---

## 4. Technical Stack
- **HTML5**: Structured semantic code.
- **CSS3**: Vanilla CSS for maximum performance, clean typography, responsive design, and CSS variables.
- **TypeScript**: Single-file codebase (`main.ts`) defining listing models, rendering templates, image galleries, and form submissions.
- **JavaScript**: The compiled output (`main.js`) loaded by the browser.
- **Tools**: `package.json` and `tsconfig.json` for managing dev dependencies and building script.

---

## 5. Deployment Guide (GitHub Pages)
1. Commit all files to a new GitHub repository named `dominion-estates` (excluding `node_modules` and the `_inspiration_repo` temporary directory).
2. Go to repository Settings -> Pages.
3. Choose the source branch (e.g., `main`) and root folder (`/`). Save.
4. (Optional) In domain settings, point `dominionestates.com` to GitHub Pages IP addresses and configure custom domains via the `CNAME` file.
