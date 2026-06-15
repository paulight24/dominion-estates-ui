# Dominion Estates UI

A premium, trustworthy, and hospitality-focused direct-booking and inquiry website for **Dominion Estates**, showcasing 2 luxury furnished rentals in Newport Beach, CA.

## ✨ Features
- **Hospitality Aesthetic**: Styled in deep navy (`#0A1931`) and warm gold (`#C5A880`) to provide an upscale boutique-hotel experience.
- **Dynamic Listing Grid**: Renders luxury rental cards with fully responsive image sliders.
- **Detailed Modal Dialogs**: View complete pricing sheets, fee breakdowns, list of amenities, and check availability in real-time.
- **Secure Reservation Checkout**: Connects securely to the Square booking deposit portal for a refundable $500 reservation hold.
- **Lead Capture Stays**: Integrated inquiry form routing details through Formspree (or falling back to local `mailto` applications).
- **SEO Optimized**: Fully equipped with geo-regions, Open Graph tags, canonical linkages, structured local business schemas, `robots.txt`, and XML `sitemap.xml`.

---

## 🛠️ Local Development

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Setup
Install compilation dependencies:
```bash
npm install
```

### 3. Compile TypeScript
To compile the TypeScript core script (`main.ts`) into the browser-executable script (`main.js`), run:
```bash
npm run build
```

Alternatively, watch for script changes automatically:
```bash
npm run watch
```

---

## 🚀 Deployment to GitHub Pages

1. Ensure all compiled files (`index.html`, `main.js`, `CNAME`, `images/logo.png`) are committed to this repository.
2. Push your changes to the `main` branch.
3. In your GitHub repository:
   - Go to **Settings** -> **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch** as the source.
   - Choose the `main` branch and the `/ (root)` folder, then click **Save**.
4. If you have registered `dominionestates.com` with your DNS provider, GitHub Pages will automatically use the `CNAME` file to connect the custom domain.
