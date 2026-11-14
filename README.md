# VERDANT: Plants, Flowers & Gardening Studio

A premium, fully responsive plant nursery, flower shop and gardening store website built with plain **HTML5, CSS3 and vanilla JavaScript**. No frameworks, no build step.

> This is a **demonstration website**. The shop, 46 sample products, prices, availability labels, offers, coupon codes, delivery policy, testimonials and contact details are fictional sample content. Photos are stock and public-domain photography, and some are illustrative (for example, the wooden "Plant Stand" is shown with a plant in it). Replace everything with the real shop's details and inventory before using it for a real business.

## Project structure

```
index.html            Page markup and the SVG icon sprite
css/style.css         All styles (tokens, components, sections, responsive rules)
js/script.js          CONFIG + product/offer/article data + all behaviour (no dependencies)
assets/
  images/             Photography (hero, products, categories, gallery, avatars)
  icons/favicon.svg   Favicon
  fonts/              Empty on purpose: fonts load from Google Fonts
README.md
```

## Run locally

No installation is needed.

- **Quickest:** double-click `index.html`.
- **With a local server (recommended):** from this folder run `python -m http.server 8080` (or `npx serve .`) and open `http://localhost:8080`.

## Customise for a real shop

1. **Shop details and WhatsApp number:** edit `CONFIG` at the top of `js/script.js` (`phone`, `phoneTel`, `whatsapp`, `email`, `address`, `mapsUrl`, `instagram`, the announcement and offer text, and the `delivery` policy). The WhatsApp number is digits only with the country code, for example `919876543210`. `mapsUrl` powers the **Get Directions** button.
2. **Delivery charges and coupons:** `CONFIG.delivery` sets the free-delivery threshold and the delivery charge. `CONFIG.coupons` lists the codes the cart can apply (percent or flat, with a minimum subtotal).
3. **Products:** edit the `PRODUCTS` array in `js/script.js`. Each product has a name, category, price, optional original price (`mrp`, which shows a discount badge), image key, availability label and care attributes (`light`, `care`, `places`, and so on) that power the quick view and the plant finder. Add photos to `assets/images/` and use the file name (without `.jpg`) as the `img` value.
4. **Offers, articles, flower collection:** edit `OFFERS`, `ARTICLES` and `FLOWER_COLLECTIONS`.
5. **Structured data and domain:** update the `Store` JSON-LD in `<head>`, and replace `https://www.example.com/` in the canonical link and Open Graph tags once you have a domain.
6. **Colours and fonts:** change the variables at the top of `css/style.css`.

## What works in the demo

Every button and link does something:

- Closable announcement bar, sticky navbar that turns solid on scroll, active-section highlighting, smooth scrolling, scroll progress bar, back-to-top, animated mobile menu (closes on link click, outside click and Escape).
- 10 shop-by-category cards that filter the product collection, plus category chips, an "active tag" pill and a **Load More** button.
- **Search** with live suggestions (keyboard navigable), a clear button and a no-results message. It searches product names, categories, tags and keywords.
- **Sorting:** popular, newest, price low to high, price high to low, alphabetical.
- **Quick view modal** with plant care details (sunlight, watering, height, maintenance, indoor or outdoor) or flower details (type, arrangement, sizes, seasonal availability), a quantity selector, add to cart and wishlist.
- **Cart drawer:** add, remove, increase and decrease quantity, coupon codes, dynamic subtotal, discount, delivery and total (nothing is hard-coded), clear cart, continue shopping. **Saved in localStorage.**
- **Wishlist drawer:** add, remove, move to cart. **Saved in localStorage.** Header counters for both.
- **Plant Care Finder:** four questions (place, sunlight, care time, budget) that score the plants by their attributes, show matches (or the closest matches) and can be reset.
- **Checkout (demo):** validates name, Indian mobile number, email, address, state and a six-digit PIN code, shows an order summary, then builds a formatted order message you can send on WhatsApp. The cart is cleared only after you explicitly confirm.
- Flower collection with **Order on WhatsApp** buttons, a plant care guide with 8 article dialogs, offers with copy-to-clipboard coupon codes, a testimonial slider (arrows, dots, autoplay, hover pause, swipe), contact and newsletter forms, and toast notifications.

### Important: no real payments, stock or orders

This is a static site. The checkout **does not take payments, reserve stock or save orders**. Nothing is sent to a server: the order message goes to WhatsApp only if the customer presses send. Availability labels are sample data. Real payments, inventory and order storage need a backend or an e-commerce platform (for example Shopify, WooCommerce or a custom API).

## External assets and dependencies

| Asset | Source | Notes |
|---|---|---|
| Cormorant Garamond and Manrope fonts | Google Fonts | Loaded by a `<link>` in `index.html`. System serif and sans fonts are used if offline. |
| Photography (`assets/images/*.jpg`, about 60 files) | [Unsplash](https://unsplash.com) and public-domain (CC0 / PDM) photos found through [Openverse](https://openverse.org) | Free to use. Replace with the shop's own product photos. Some items (for example watering cans, jasmine and ZZ plant) use the closest available photo. |
| Icons | Inline SVG sprite in `index.html` | No icon library. |
| Social links | Point to each network's home page (Instagram uses `CONFIG.instagram`) | Replace with the shop's real profiles. |

### Image assets (in `assets/images/`)

Hero: `hero`, `hero-inset`, `og-image`. Plants, flowers and accessories are named after their subject, for example `monstera-pot`, `snake-plant`, `peace-lily`, `zz-plant`, `hibiscus`, `marigold`, `roses`, `mixed-bouquet`, `terracotta-stack`, `watering-can`, `soil-shovel`. Testimonial avatars: `customer-1` to `customer-4`.

There are no JavaScript libraries, no CSS frameworks and no build tools.

## Deploy to Netlify

**Option A: drag and drop (fastest)**

1. Go to <https://app.netlify.com/drop> and sign in.
2. Drag this whole folder (the one containing `index.html`) onto the page.
3. Netlify publishes it at a `*.netlify.app` address. Rename it under **Site configuration > Change site name**.

**Option B: from GitHub (automatic updates)**

1. Push this folder to a GitHub repository.
2. In Netlify choose **Add new site > Import an existing project** and pick the repository.
3. Leave the build command empty and set the publish directory to `.`.
4. Click **Deploy**. Every push to `main` redeploys the site.

After deploying, update the canonical URL, Open Graph URLs and JSON-LD in `index.html` to your live address.

## Accessibility and performance notes

- Semantic landmarks, a skip link, visible focus states, labelled form fields with inline errors, a keyboard-navigable search combobox, and ARIA for the menu, carousel, drawers and dialogs.
- Native `<dialog>` elements for the product modal, cart and wishlist drawers, checkout and articles (focus handling and Escape built in).
- Below-the-fold images use `loading="lazy"` with width and height attributes. Animations are light and respect `prefers-reduced-motion`.
- Responsive breakpoints: 1440px+, 1200-1439px, 992-1199px, 768-991px, 480-767px and below 480px. The product grid is 4, 3, 2 or 1 columns depending on width.
- Secondary text is slightly deeper than the brand grey so small text keeps good contrast.

## Licence

Code: use freely for your own projects. Photos remain under their original licences (Unsplash License; CC0 / public domain).
