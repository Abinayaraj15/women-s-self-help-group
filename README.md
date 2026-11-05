# HerVana — Women's Self Help Group (SHG) Marketplace 🇮🇳

> **"Handcrafted Heritage, Direct from Village Looms."**  
> A complete, modern, responsive multi-page e-commerce marketplace connecting rural Indian Women's Self Help Groups (SHGs) and artisan cooperatives directly with conscious patrons across the nation.

---

## 🌟 Overview

**HerVana** is an ethical, fair-trade digital marketplace designed specifically for Indian Women's Self Help Groups (SHGs). Rural women artisans across 24 Indian states create authentic handlooms, tribal terracotta pottery, organic forest honey, stone-ground spices, homemade pickles, and traditional jewellery. HerVana bridges the gap between these rural craft clusters and urban consumers with zero upfront listing fees, 100% direct bank payouts to SHG accounts, and doorstep logistics.

---

## 📁 Project Architecture & File Structure

The project is structured cleanly with modular HTML, CSS, JavaScript, and high-resolution assets:

```
HerVana/
│
├── index.html            # Main Storefront & Artisan Showcase
├── home-2.html           # Alternative Festive Expo & Regional Clusters Homepage
├── products.html         # Full Marketplace Catalog (Filter, Search, Sort)
├── join-us.html          # SHG Onboarding & Multi-Step Registration Wizard
├── login.html            # Dual Authentication (Patron & SHG Leader with OAuth Demo)
├── dashboard.html        # SHG Seller Dashboard (KPIs, SVG Charts, Live Actions)
├── orders.html           # Order Management & Village Courier Dispatch Simulator
├── earnings.html         # SHG Direct Financials, Bank Details & Payout History
│
├── css/
│   ├── style.css         # Primary Storefront & Component Stylesheet
│   └── dashboard.css     # SHG Artisan Portal Stylesheet
│
├── js/
│   ├── script.js         # Cart, Wishlist, Quick View, Filters, Video Controls, Theme/RTL
│   └── dashboard.js      # Sidebar Toggle, SVG Charts, Order Status Simulator
│
├── videos/
│   ├── village-woman-loom-weaving.mp4 # Village Craftswoman Weaving on Traditional Wooden Loom (Primary)
│   ├── hero-cinematic.mp4         # Primary Cross-Browser Hero Video Stream (Loom Weaving)
│   ├── female-artisan-weaving.webm# Traditional Indian Woman Artisan Spinning Tant Saree Yarn (Fallback)
│   ├── modern-pottery-artist.mp4  # Contemporary Female Ceramic Artist on Pottery Wheel
│   └── modern-indian-model.mp4    # Styled Indian Artisan Model Showcase
│
└── images/
    ├── logo.png          # High-resolution HerVana Brand Emblem
    ├── logo.svg          # Crisp Vector Brand Logo with Lotus & Loom Motif
    ├── hero-1.jpg        # Hero Background: Indian Women Weaving Collective
    ├── hero-2.jpg        # Hero Background: Vibrant Rural Artisan Showcase
    │
    ├── products/         # Authentic Indian Handcrafted Goods
    │   ├── handloom-saree.jpg           # Handwoven Chanderi Zari Silk Saree
    │   ├── terracotta-vases.jpg         # Tribal Warli Hand-Painted Vases
    │   ├── organic-turmeric-honey.jpg   # Wild Forest Honey & Lakadong Turmeric
    │   ├── kundan-earrings.jpg          # Kundan Meenakari Chandbali Earrings
    │   ├── brass-diya.jpg               # Hand-Carved Brass Peacock Diya Lamp
    │   ├── cotton-dupatta.jpg           # Ajrakh Hand Block Printed Cotton Dupatta
    │   ├── embroidery-cushions.jpg      # Kantha Hand-Stitched Cushion Covers
    │   ├── ayurvedic-soaps.jpg          # Cold-Processed Neem & Saffron Soap Trio
    │   ├── bamboo-baskets.jpg           # Handwoven Natural Bamboo Organizers
    │   ├── homemade-pickles.jpg         # Stone-Pressed Mango & Lime Pickle
    │   ├── jute-tote-bag.jpg            # Hand-Embroidered Natural Jute Tote
    │   └── tribal-painting.jpg          # Authentic Madhubani Folk Art Canvas
    │
    └── women/            # Genuine Indian Women SHGs & Artisans at Work
        ├── shg-collective.jpg           # Women working together in rural SHG meeting
        ├── woman-weaving.jpg            # Women weaving traditional textiles on handloom
        ├── woman-handicrafts.jpg        # Woman crafting terracotta & folk pottery
        ├── woman-spices-food.jpg        # Women preparing stone-ground spices & pickles
        ├── woman-packaging.jpg          # Women packing eco-friendly craft boxes
        ├── woman-jewellery.jpg          # Artisan crafting handmade brass jewellery
        ├── artisan-radha.jpg            # Portrait: Master Weaver Radha Devi (Kanchipuram)
        ├── artisan-sunita.jpg           # Portrait: Sunita Sharma (Jaipur Pottery)
        ├── artisan-kavita.jpg           # Portrait: Kavita Patil (Maharashtra Organic Spices)
        └── artisan-ananya.jpg           # Portrait: Ananya Das (Assam Silk & Bamboo)
```

---

## 🎨 Pages & Features

### 1. `index.html` (Main Storefront)
- **Sticky Professional Navbar**: Top announcement ticker, brand logo, navigation dropdowns, live search, wishlist counter, dynamic cart trigger, Dark/Light mode toggle, RTL switcher, and "Sell on HerVana" CTA.
- **Cinematic Video Hero Section**:
  - Full-width cinematic video showing an authentic village craftswoman actively weaving intricate textiles on a large traditional wooden loom (`videos/village-woman-loom-weaving.mp4`, 720p HD, `object-fit: cover`, `playsinline`, zero layout shift).
  - Neat, dignified artisanal setting: seamlessly balances rustic village craft heritage with clean, contemporary visual appeal ("neat and fashioned, working on handcraft or loom").
  - Intelligently mirrored framing (`scaleX(-1)`) positions the craftswoman's hands, wooden shuttles, and active weaving on the open right side of the screen, leaving the left side clear for the hero typography, metrics, and call-to-action buttons.
  - High-resolution poster fallback (`images/hero-loom-artisan.jpg`) with graceful error degradation.
  - Multi-stop adaptive gradient overlay tailored for Light, Dark (`[data-theme="dark"]`), and RTL (`[dir="rtl"]`) directions to maintain contrast.
  - Smooth cinematic slow zoom (`cinematicSlowZoom`), ambient color grading (`saturate(1.15) contrast(1.08) brightness(0.92)`), and Dark / Light / RTL mode responsive overlays.
  - Staggered CSS entrance animations for live pulse badge, glowing H1 title, description, and action buttons.
  - Clean, unencumbered visual composition keeping key impact statistics and video in clear view.
  - Full accessibility compliance respecting `prefers-reduced-motion: reduce`.
- **Fair Trade Value Strip**: 100% Direct Bank Transfers, Eco-Friendly packaging, Certified Authenticity, and Pan-India Delivery.
- **Artisan Categories**: Handloom & Sarees, Handmade Jewellery, Spices & Pickles, Terracotta & Clay, Ayurvedic Skincare, Bamboo & Cane.
- **Curated Products Grid**: Dynamic product cards with Silk Mark / Handloom Mark badges, star ratings, artisan tags, and "Quick View" / "Add to Cart" actions.
- **Behind the Craft (Artisan Stories)**: Profiles of women leaders like Radha Devi, Sunita Sharma, and Kavita Patil with real community impact figures.
- **Slide-out Cart Drawer**: Off-canvas interactive cart with quantity adjustments, free shipping progress bar, and checkout simulation.
- **Quick View Lightbox Modal**: Instant preview of product images, artisan techniques, and materials.

### 2. `home-2.html` (Festive Expo & Regional Clusters)
- **Festive Hero**: Panoramic visual hero (`images/hero-2.jpg`) highlighting the Grand Festive & Wedding Artisan Collection.
- **State Craft Corridors**: Interactive regional showcases for Tamil Nadu & Karnataka silks, Rajasthan blue pottery, Maharashtra spices, and Assam bamboo.
- **Cooperative of the Week**: Deep dive into the *Prerana Mahila Gramin Vikas Mandal* collective.
- **Festive Deals Grid**: Seasonal discounts with direct cooperative proceeds.

### 3. `products.html` (Marketplace Catalog)
- **Instant Search & Filter Engine**: Real-time filtering by category checkboxes, price range radios, and text search without full page reload.
- **Sort Options**: Sort by Popularity, Price (Low to High), and Price (High to Low).
- **Comprehensive Catalog**: 12 fully detailed handcrafted items with authentic Indian handicraft imagery.

### 4. `join-us.html` (SHG Seller Onboarding)
- **Benefits Overview**: Explaining the 0% listing fee, village doorstep pickups, packaging assistance, and micro-credit support.
- **3-Step Registration Wizard**:
  - *Step 1*: Group & Location Details (NRLM ID, State, Village).
  - *Step 2*: Leader Contact & Cooperative Bank IFSC details.
  - *Step 3*: Product Craft selection, description, and simulated photo upload.
- **Interactive FAQ Accordion**: Clear answers on GST exemption, shipping, and payments.

### 5. `login.html` (Authentication & OAuth Demo)
- **Dual Tab Toggle**: Switch between "Patron / Buyer" and "SHG Artisan Leader" portal.
- **Frontend Demonstration OAuth Buttons**:
  - High-fidelity **Google** 4-color SVG button.
  - Sleek **Apple** SVG button.
  - *Disclaimer Included*: Frontend demonstration buttons only, with clear notice that UI is ready for OAuth 2.0 backend integration.
- **Quick Demo Login Links**: Directly routes to Buyer Marketplace or SHG Dashboard.

### 6. `dashboard.html` (SHG Artisan Management Portal)
- **Responsive Sidebar**: Collapsible on mobile/tablets with SHG profile avatar and verified badge.
- **KPI Metrics**: Total Revenue (₹3,84,500), Monthly Orders (46), Active Catalog (18), and Women Artisans Empowered (28).
- **Interactive SVG Sales Chart**: Visual revenue trend by month with interactive hover data tooltips.
- **Sales by Tradition Progress Bars**: Silks (65%), Jewellery (20%), Terracotta (15%).
- **Recent Orders Table**: Status badges with action buttons.

### 7. `orders.html` (Fulfillment & Dispatch)
- **Filter Tabs**: All (46), Processing (8), Shipped (14), Delivered (22).
- **Order Search**: Instant search by customer name, order number, or location.
- **Status Updater**: Interactive button updates status from *Processing* → *Shipped* → *Delivered* with instant feedback toast.

### 8. `earnings.html` (Direct Bank Payouts)
- **Financial Cards**: Available for Withdrawal (₹84,250), Pending Escrow (₹18,400), Total Withdrawn (₹2,81,850).
- **Verified Bank Account**: PFMS-verified State Bank of India account details with masked security.
- **Withdrawal Simulator**: Interactive prompt with balance validation and success feedback.
- **Settlement History Table**: Bank UTR numbers, dates, and completion status.

---

## 🚀 How to Run the Website

No complex build steps or dependencies are needed. The project is built with vanilla HTML5, modern CSS3, and ES6 JavaScript.

### Option 1: Direct File Opening
Double-click `index.html` (or `HerVana/index.html`) in your file explorer to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option 2: Local HTTP Server (Python)
Open a terminal in this directory and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🔐 OAuth Integration Guide (For Future Backend Developers)

The Google and Apple sign-in buttons in `login.html` are styled frontend demonstration components. To connect them to production OAuth:

### Google OAuth 2.0:
1. Register your project on the [Google Cloud Console](https://console.cloud.google.com/).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Include the Google Identity Services script:
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```
4. Attach your `client_id` to the Google button click handler in `js/script.js`.

### Apple Sign-In:
1. Configure **Sign in with Apple** on the Apple Developer portal.
2. Obtain your **Services ID** and configure your verified Return URL.
3. Include the Apple JS SDK:
   ```html
   <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth/2/en_US/appleid.auth.js"></script>
   ```

---

## 📱 Responsive Testing Checklist

- [x] **Desktop (1440px+)**: Multi-column expansive layout, sticky navigation bar with search and actions.
- [x] **Laptop (1024px - 1280px)**: 3-column product cards, flexible sidebar.
- [x] **Tablet (768px - 1023px)**: 2-column grids, collapsible dashboard sidebar, offcanvas mobile navigation.
- [x] **Mobile (360px - 480px)**: 1-column product cards, touch-friendly buttons, slide-out mobile drawer, zero horizontal overflow.

---

## 👩‍🌾 Social Impact Statement

Every transaction on HerVana directly supports the **National Rural Livelihood Mission (NRLM)** and **Mahila Kisan Sashaktikaran Pariyojana (MKSP)** goals. By eliminating middlemen and empowering women with digital tools, HerVana helps transform rural homemakers into thriving micro-entrepreneurs.
