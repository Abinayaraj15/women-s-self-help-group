/**
 * HerVana - Women Self Help Group (SHG) Marketplace
 * Primary Frontend Interactive Script: script.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRtlToggle();
  initStickyNavbar();
  initMobileMenu();
  initNavSearch();
  initHeroVideoControls();
  initCart();
  initWishlist();
  initQuickViewModal();
  initOAuthDemoButtons();
  initNewsletter();
  initCatalogFilters();
});

/* ==========================================================================
   0. Theme Mode (Dark / Light) & RTL Layout Toggles
   ========================================================================== */
function initThemeToggle() {
  const currentTheme = localStorage.getItem('hervana_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hervana_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? 'Dark Mode Enabled 🌙' : 'Light Mode Enabled ☀️', 'demo');
    }
  });
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.title = "Switch to Light Mode";
      btn.classList.add('active-mode');
    } else {
      btn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
      btn.title = "Switch to Dark Mode";
      btn.classList.remove('active-mode');
    }
  });
}

function initRtlToggle() {
  const currentDir = localStorage.getItem('hervana_dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  updateRtlButton(currentDir);

  document.addEventListener('click', (e) => {
    const rtlBtn = e.target.closest('.rtl-toggle-btn');
    if (rtlBtn) {
      e.preventDefault();
      const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('hervana_dir', newDir);
      updateRtlButton(newDir);
      showToast(newDir === 'rtl' ? 'RTL Layout Activated (Right-to-Left)' : 'LTR Layout Activated (Left-to-Right)', 'demo');
    }
  });
}

function updateRtlButton(dir) {
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    if (dir === 'rtl') {
      btn.classList.add('active-mode');
      btn.title = "Switch to LTR Direction";
    } else {
      btn.classList.remove('active-mode');
      btn.title = "Switch to RTL Direction";
    }
  });
}

/* ==========================================================================
   1. Sticky Header & Scroll Effects
   ========================================================================== */
function initStickyNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   1.5. Floating Search Trigger & Popover
   ========================================================================== */
function initNavSearch() {
  const trigger = document.querySelector('#navSearchTrigger');
  const popover = document.querySelector('#navSearchPopover');
  const closeBtn = document.querySelector('#navSearchClose');
  const input = document.querySelector('#globalNavSearchInput');
  const submitBtn = document.querySelector('#navSearchSubmit');

  if (!trigger || !popover) return;

  const toggleSearch = (open) => {
    const willOpen = open !== undefined ? open : !popover.classList.contains('open');
    if (willOpen) {
      popover.classList.add('open');
      trigger.classList.add('active-mode');
      if (input) {
        setTimeout(() => input.focus(), 60);
      }
    } else {
      popover.classList.remove('open');
      trigger.classList.remove('active-mode');
    }
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSearch();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSearch(false);
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (popover.classList.contains('open') && !popover.contains(e.target) && !trigger.contains(e.target)) {
      toggleSearch(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popover.classList.contains('open')) {
      toggleSearch(false);
    }
  });

  const performSearch = () => {
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;

    // If already on products page, filter live
    const catalogInput = document.querySelector('#catalogSearch');
    if (catalogInput) {
      catalogInput.value = q;
      catalogInput.dispatchEvent(new Event('input', { bubbles: true }));
      toggleSearch(false);
      const catalogSection = document.querySelector('#catalog-grid-section') || document.querySelector('.catalog-products-grid');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = 'products.html?q=' + encodeURIComponent(q);
    }
  };

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performSearch();
    });
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggle);

  if (closeBtn) {
    closeBtn.addEventListener('click', toggle);
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) toggle();
  });
}

/* ==========================================================================
   3. Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
    : type === 'demo'
    ? `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

  toast.innerHTML = `
    <span>${iconSvg}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   4. Cart Management System (Persistent localStorage)
   ========================================================================== */
let cart = [];

function initCart() {
  try {
    const saved = localStorage.getItem('hervana_cart');
    cart = saved ? JSON.parse(saved) : getDefaultCart();
  } catch (e) {
    cart = getDefaultCart();
  }

  updateCartBadges();
  bindCartEvents();
}

function getDefaultCart() {
  return [
    {
      id: 'p1',
      title: 'Handwoven Chanderi Zari Silk Saree',
      artisan: 'Radhika Mahila Samiti, Kanchipuram',
      price: 2499,
      image: 'images/products/handloom-saree.jpg',
      quantity: 1
    },
    {
      id: 'p4',
      title: 'Kundan Meenakari Brass Earrings',
      artisan: 'Jaipur Blue Craft SHG',
      price: 649,
      image: 'images/products/kundan-earrings.jpg',
      quantity: 1
    }
  ];
}

function saveCart() {
  localStorage.setItem('hervana_cart', JSON.stringify(cart));
  updateCartBadges();
  renderCartDrawer();
}

function updateCartBadges() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = count;
  });
}

function bindCartEvents() {
  // Cart Drawer open/close triggers
  document.querySelectorAll('.cart-open-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const overlay = document.querySelector('.cart-drawer-overlay');
  const closeBtn = document.querySelector('.cart-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCartDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }

  // Add to cart buttons across product cards
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-cart-btn, .btn-add-to-cart, .btn-hamper-cart, .btn-add-to-bag');
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.dataset.id || 'p' + Math.floor(Math.random() * 100);
      const title = addBtn.dataset.title || 'Handmade SHG Product';
      const price = parseInt(addBtn.dataset.price || '899', 10);
      const artisan = addBtn.dataset.artisan || 'Rural Women Cooperative';
      const image = addBtn.dataset.image || 'images/products/handloom-saree.jpg';

      addToCart({ id, title, price, artisan, image });
    }
  });

  // Cart checkout button simulation
  document.addEventListener('click', (e) => {
    if (e.target.closest('.cart-checkout-btn')) {
      if (cart.length === 0) {
        showToast('Your cart is empty. Explore our artisan products!', 'demo');
        return;
      }
      showToast('Proceeding to Fair Trade Checkout! (Demo Order Confirmed)', 'success');
      setTimeout(() => {
        cart = [];
        saveCart();
        closeCartDrawer();
      }, 1500);
    }
  });
}

function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += (item.quantity || 1);
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }

  saveCart();
  showToast(`Added "${item.title.substring(0, 24)}..." to Cart!`, 'success');

  // Trigger slight animation on cart icon
  document.querySelectorAll('.cart-open-trigger').forEach(btn => {
    btn.classList.add('animate-bounce');
    setTimeout(() => btn.classList.remove('animate-bounce'), 500);
  });
}

function openCartDrawer() {
  const overlay = document.querySelector('.cart-drawer-overlay');
  if (overlay) {
    renderCartDrawer();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.querySelector('.cart-drawer-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCartDrawer() {
  const list = document.querySelector('.cart-items-list');
  const subtotalEl = document.querySelector('.cart-subtotal-val');
  const grandTotalEl = document.querySelector('.cart-total-val');
  const shippingEl = document.querySelector('.cart-shipping-val');

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
        <h4 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;">Your Cart is Empty</h4>
        <p style="font-size: 0.85rem; margin-bottom: 1.5rem;">Discover authentic handcrafted goods made by India's women self-help groups.</p>
        <a href="products.html" class="btn btn-primary btn-sm" onclick="closeCartDrawer()">Explore Catalog</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (grandTotalEl) grandTotalEl.textContent = '₹0';
    if (shippingEl) shippingEl.textContent = '₹0';
    return;
  }

  let subtotal = 0;
  list.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb" onerror="this.src='images/products/handloom-saree.jpg'">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-artisan">By ${item.artisan}</div>
          <div class="cart-item-row">
            <div class="qty-controller">
              <button type="button" class="qty-btn" onclick="modifyCartQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="modifyCartQty('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
            <button type="button" class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remove item">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 999 ? 0 : 80;
  const grandTotal = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

window.modifyCartQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
};

window.removeCartItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  showToast('Item removed from cart', 'demo');
};

/* ==========================================================================
   5. Wishlist System & Slide-Out Drawer
   ========================================================================== */
const catalogProductsMap = {
  'p1': {"id": "p1", "category": "textiles", "price": 2499, "image": "images/products/handloom-saree.jpg", "title": "Handwoven Pure Chanderi Zari Silk Saree", "artisan": "By Radhika Mahila Samiti, Kanchipuram"},
  'p2': {"id": "p2", "category": "textiles", "price": 4850, "image": "images/products/kanchipuram-saree.jpg", "title": "Authentic Kanchipuram Pattu Temple Border Silk Saree", "artisan": "By Meenakshi Weavers Collective, Kanchipuram"},
  'p3': {"id": "p3", "category": "textiles", "price": 2150, "image": "images/products/pochampally-saree.jpg", "title": "Handcrafted Pochampally Ikat Pure Cotton Silk Saree", "artisan": "By Telangana Gramin Weavers, Pochampally"},
  'p4': {"id": "p4", "category": "textiles", "price": 1150, "image": "images/products/phulkari-stole.jpg", "title": "Phulkari Handcrafted Floral Georgette Festive Stole", "artisan": "By Patiala Virasat Mahila Sangh, Patiala"},
  'p5': {"id": "p5", "category": "textiles", "price": 1750, "image": "images/products/kashmiri-stole.jpg", "title": "Kashmiri Aari Hand-Embroidered Pure Woolen Stole", "artisan": "By Anantnag Craftswomen SHG, Kashmir"},
  'p6': {"id": "p6", "category": "pottery", "price": 899, "image": "images/products/terracotta-vases.jpg", "title": "Handcrafted Bankura Terracotta Long-Neck Horse Pair", "artisan": "By Sunita Pottery Collective, Bankura"},
  'p7': {"id": "p7", "category": "pottery", "price": 1150, "image": "images/products/jaipur-blue-pottery.jpg", "title": "Jaipur Blue Pottery Decorative Floral Serving Bowl Set", "artisan": "By Kripal Kumbh Women Artisans, Jaipur"},
  'p8': {"id": "p8", "category": "pottery", "price": 480, "image": "images/products/clay-kulhad-set.jpg", "title": "Natural Earthen Clay Water Pot & Kulhad Tea Set (Set of 6)", "artisan": "By Gorakhpur Clay Artisans, Gorakhpur"},
  'p9': {"id": "p9", "category": "pottery", "price": 620, "image": "images/products/terracotta-handi.jpg", "title": "Traditional Hand-Moulded Terracotta Cooking Handi with Lid", "artisan": "By Mati Mahila Sangh, Alwar"},
  'p10': {"id": "p10", "category": "food", "price": 550, "image": "images/products/organic-turmeric-honey.jpg", "title": "Wild Forest Honey & Lakadong High-Curcumin Turmeric", "artisan": "By Kavita Gramin Mahila Sangh, Wardha"},
  'p11': {"id": "p11", "category": "food", "price": 320, "image": "images/products/homemade-pickles.jpg", "title": "Traditional Stone-Pressed Spicy Mango & Mustard Pickle", "artisan": "By Amritsar Rural Kitchen SHG, Punjab"},
  'p12': {"id": "p12", "category": "food", "price": 380, "image": "images/products/guntur-chilli-spices.jpg", "title": "Stone-Ground Guntur Teja Red Chilli & Garam Masala Combo", "artisan": "By Annapurna Mahila Mandal, Guntur"},
  'p13': {"id": "p13", "category": "food", "price": 640, "image": "images/products/himalayan-honey.jpg", "title": "Pahadi Raw Himalayan Multiflora Honey (500g Glass Jar)", "artisan": "By Kumaon Vanita Honey Collective, Almora"},
  'p14': {"id": "p14", "category": "food", "price": 360, "image": "images/products/banarasi-chilli-pickle.jpg", "title": "Sun-Dried Stuffed Banarasi Lal Mirch Achaar (Traditional)", "artisan": "By Kashi Mahila Rasoi, Varanasi"},
  'p15': {"id": "p15", "category": "jewellery", "price": 649, "image": "images/products/kundan-earrings.jpg", "title": "Handcrafted Kundan Meenakari Brass Chandbali Earrings", "artisan": "By Meenakari Mahila Mandal, Jaipur"},
  'p16': {"id": "p16", "category": "jewellery", "price": 780, "image": "images/products/terracotta-jewellery.jpg", "title": "Hand-Painted Terracotta Beaded Choker & Jhumka Set", "artisan": "By Shilpa Gramin Mahila Mandal, Bishnupur"},
  'p17': {"id": "p17", "category": "jewellery", "price": 890, "image": "images/products/dhokra-brass-bangles.jpg", "title": "Tribal Dhokra Brass Filigree Bangle Set (Pair)", "artisan": "By Bastar Adivasi Mahila Samiti, Bastar"},
  'p18': {"id": "p18", "category": "jewellery", "price": 720, "image": "images/products/oxidised-hasli-necklace.jpg", "title": "Handcrafted German Silver Oxidised Tribal Hasli Necklace", "artisan": "By Banjara Heritage Craft Collective, Bellary"},
  'p19': {"id": "p19", "category": "decor", "price": 780, "image": "images/products/brass-diya.jpg", "title": "Hand-Carved Brass Peacock Oil Diya Lamp (Traditional)", "artisan": "By Bastar Dhokra Artisans, Chhattisgarh"},
  'p20': {"id": "p20", "category": "decor", "price": 1199, "image": "images/products/embroidery-cushions.jpg", "title": "Kantha Hand-Stitched Pure Cotton Cushion Covers (Set of 2)", "artisan": "By Bolpur Mahila Samiti, Shantiniketan"},
  'p21': {"id": "p21", "category": "decor", "price": 1850, "image": "images/products/tribal-painting.jpg", "title": "Original Hand-Painted Madhubani Tree of Life Folk Art (Framed)", "artisan": "By Madhubani Mahila Shilp, Mithila"},
  'p22': {"id": "p22", "category": "decor", "price": 1450, "image": "images/products/copper-carafe-set.jpg", "title": "Hand-Hammered Pure Copper Water Carafe & Tumbler Set", "artisan": "By Tambat Mahila Karigar, Pune"},
  'p23': {"id": "p23", "category": "organic", "price": 390, "image": "images/products/ayurvedic-soaps.jpg", "title": "Cold-Processed Neem & Saffron Handcrafted Bath Soap (Pack of 3)", "artisan": "By Wayanad Tribal Women, Kerala"},
  'p24': {"id": "p24", "category": "organic", "price": 850, "image": "images/products/kumkumadi-oil.jpg", "title": "Pure Kumkumadi Tailam Miraculous Ayurvedic Face Oil (30ml)", "artisan": "By Sahyadri Vana Aushadhi SHG, Coorg"},
  'p25': {"id": "p25", "category": "organic", "price": 420, "image": "images/products/cold-pressed-coconut-oil.jpg", "title": "Organic Virgin Cold-Pressed Coconut Hair & Body Oil (500ml)", "artisan": "By Malabar Coconut Farmers SHG, Kozhikode"},
  'p26': {"id": "p26", "category": "organic", "price": 490, "image": "images/products/ubtan-scrub-rosewater.jpg", "title": "Hand-Ground Ubtan Herbal Body Polishing Scrub & Rose Water", "artisan": "By Vrindavan Gramin Mahila Sangh, Mathura"},
  'p27': {"id": "p27", "category": "bamboo", "price": 680, "image": "images/products/bamboo-baskets.jpg", "title": "Handwoven Natural Bamboo Storage Organizer Baskets (Set of 3)", "artisan": "By Majuli Bamboo Crafters, Assam"},
  'p28': {"id": "p28", "category": "bamboo", "price": 540, "image": "images/products/jute-tote-bag.jpg", "title": "Hand-Embroidered Natural Golden Jute Market Tote & Handbag", "artisan": "By Hooghly Women Crafts, West Bengal"},
  'p29': {"id": "p29", "category": "bamboo", "price": 590, "image": "images/products/coconut-shell-bowls.jpg", "title": "Hand-Turned Natural Coconut Shell Bowls with Spoons (Set of 4)", "artisan": "By Alleppey Coastal Women SHG, Alappuzha"},
  'p30': {"id": "p30", "category": "bamboo", "price": 750, "image": "images/products/channapatna-toys.jpg", "title": "Handcrafted Traditional Wooden Channapatna Toys & Artifacts Set", "artisan": "By Channapatna Mahila Shilpa, Karnataka"},
};

let wishlist = [];

function initWishlist() {
  try {
    const saved = localStorage.getItem('hervana_wishlist');
    wishlist = saved ? JSON.parse(saved) : ['p1', 'p3'];
  } catch (e) {
    wishlist = ['p1', 'p3'];
  }

  updateWishlistUI();
  bindWishlistEvents();
}

function bindWishlistEvents() {
  // Wishlist Drawer open/close triggers
  document.querySelectorAll('.wishlist-open-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishlistDrawer();
    });
  });

  const overlay = document.querySelector('.wishlist-drawer-overlay');
  const closeBtn = document.querySelector('.wishlist-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeWishlistDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeWishlistDrawer);
  }

  // Toggle wishlist from product cards
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      const id = wishBtn.dataset.id || 'p1';
      toggleWishlist(id, wishBtn);
    }
  });
}

function openWishlistDrawer() {
  const overlay = document.querySelector('.wishlist-drawer-overlay');
  if (overlay) {
    renderWishlistDrawer();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeWishlistDrawer() {
  const overlay = document.querySelector('.wishlist-drawer-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function toggleWishlist(id, btn) {
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    if (btn) btn.classList.remove('active');
    showToast('Removed from Wishlist', 'demo');
  } else {
    wishlist.push(id);
    if (btn) btn.classList.add('active');
    showToast('Saved to Wishlist ❤️', 'success');
  }
  localStorage.setItem('hervana_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();

  // If the drawer is currently open, re-render it
  const overlay = document.querySelector('.wishlist-drawer-overlay');
  if (overlay && overlay.classList.contains('open')) {
    renderWishlistDrawer();
  }

  // If in wishlist filter mode on products.html, update catalog live
  if (typeof window.filterProductsCatalog === 'function') {
    window.filterProductsCatalog();
  }
}

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-count-badge').forEach(b => {
    b.textContent = wishlist.length;
  });

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (wishlist.includes(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderWishlistDrawer() {
  const list = document.querySelector('.wishlist-items-list');
  const countBadge = document.querySelector('.wishlist-header .wishlist-count-badge');
  if (countBadge) countBadge.textContent = wishlist.length;
  if (!list) return;

  // Filter and display ONLY the wishlisted products!
  const wishlistedItems = wishlist.map(id => {
    if (catalogProductsMap[id]) return catalogProductsMap[id];
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    if (card) {
      return {
        id: id,
        title: card.querySelector('h3')?.textContent?.trim() || 'Handcrafted SHG Product',
        price: parseInt(card.dataset.price || '899', 10),
        artisan: card.querySelector('.artisan-maker span')?.textContent?.trim() || 'Rural Women SHG',
        image: card.querySelector('.product-media img')?.getAttribute('src') || 'images/products/handloom-saree.jpg'
      };
    }
    return null;
  }).filter(Boolean);

  if (wishlistedItems.length === 0) {
    list.innerHTML = `
      <div class="wishlist-empty-state">
        <div style="font-size:3rem; margin-bottom:1rem;">❤️</div>
        <h4>Your Wishlist is Empty</h4>
        <p>You haven't saved any handcrafted artisan treasures yet. Click the heart icon on any product to save it here!</p>
        <a href="products.html" class="btn btn-primary btn-sm" onclick="closeWishlistDrawer()">Explore Marketplace</a>
      </div>
    `;
    const footer = document.querySelector('.wishlist-footer');
    if (footer) {
      const moveAllBtn = footer.querySelector('.wishlist-move-all-btn');
      if (moveAllBtn) moveAllBtn.style.display = 'none';
    }
    return;
  }

  const footer = document.querySelector('.wishlist-footer');
  if (footer) {
    const moveAllBtn = footer.querySelector('.wishlist-move-all-btn');
    if (moveAllBtn) moveAllBtn.style.display = 'block';
  }

  list.innerHTML = wishlistedItems.map(item => `
    <div class="wishlist-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="wishlist-item-thumb" onerror="this.src='images/products/handloom-saree.jpg'">
      <div class="wishlist-item-info">
        <div class="wishlist-item-title">${item.title}</div>
        <div class="wishlist-item-artisan">${item.artisan}</div>
        <div class="wishlist-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="wishlist-item-actions">
          <button type="button" class="btn btn-primary btn-sm" style="font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="moveWishlistToCart('${item.id}')">
            Move to Bag 🛍️
          </button>
          <button type="button" class="wishlist-item-remove" onclick="removeWishlistItem('${item.id}')" title="Remove from Wishlist">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

window.moveWishlistToCart = function(id) {
  const item = catalogProductsMap[id];
  if (item) {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      artisan: item.artisan,
      image: item.image
    });
  }
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    localStorage.setItem('hervana_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }
  renderWishlistDrawer();
  showToast('Moved to Artisan Bag! 🛍️', 'success');
  if (typeof window.filterProductsCatalog === 'function') {
    window.filterProductsCatalog();
  }
};

window.removeWishlistItem = function(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    localStorage.setItem('hervana_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }
  renderWishlistDrawer();
  showToast('Removed from Wishlist', 'demo');
  if (typeof window.filterProductsCatalog === 'function') {
    window.filterProductsCatalog();
  }
};

window.moveAllWishlistToCart = function() {
  if (wishlist.length === 0) return;
  wishlist.forEach(id => {
    const item = catalogProductsMap[id];
    if (item) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        artisan: item.artisan,
        image: item.image
      });
    }
  });
  const count = wishlist.length;
  wishlist = [];
  localStorage.setItem('hervana_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderWishlistDrawer();
  showToast(`Moved ${count} handcrafted items to your bag! 🛍️`, 'success');
  if (typeof window.filterProductsCatalog === 'function') {
    window.filterProductsCatalog();
  }
};

window.clearWishlist = function() {
  wishlist = [];
  localStorage.setItem('hervana_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderWishlistDrawer();
  showToast('Wishlist cleared', 'demo');
  if (typeof window.filterProductsCatalog === 'function') {
    window.filterProductsCatalog();
  }
};

window.viewWishlistInCatalog = function() {
  closeWishlistDrawer();
  if (window.location.pathname.includes('products.html')) {
    const wishPill = document.querySelector('.category-quick-pill[data-cat="wishlist"]');
    if (wishPill) {
      wishPill.click();
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  } else {
    window.location.href = 'products.html?filter=wishlist';
  }
};


/* ==========================================================================
   6. Quick View Lightbox Modal
   ========================================================================== */
function initQuickViewModal() {
  const overlay = document.querySelector('.quick-view-modal-overlay');
  if (!overlay) return;

  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.quick-view-overlay-btn');
    if (qvBtn) {
      e.preventDefault();
      const card = qvBtn.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-name')?.textContent?.trim() || 'Handcrafted SHG Item';
      const img = card.querySelector('.product-media img')?.getAttribute('src') || '';
      const price = card.querySelector('.price-current')?.textContent?.trim() || '₹999';
      const artisan = card.querySelector('.artisan-group-meta')?.textContent?.trim() || 'Rural Women SHG';
      const rawPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 899;

      const modalTitle = overlay.querySelector('.qv-title');
      const modalImg = overlay.querySelector('.qv-image');
      const modalPrice = overlay.querySelector('.qv-price');
      const modalArtisan = overlay.querySelector('.qv-artisan');
      const addCartModalBtn = overlay.querySelector('.qv-add-cart-btn');

      if (modalTitle) modalTitle.textContent = title;
      if (modalImg) modalImg.src = img;
      if (modalPrice) modalPrice.textContent = price;
      if (modalArtisan) modalArtisan.textContent = artisan;

      if (addCartModalBtn) {
        addCartModalBtn.dataset.id = card.dataset.id || 'p-modal';
        addCartModalBtn.dataset.title = title;
        addCartModalBtn.dataset.price = rawPrice;
        addCartModalBtn.dataset.artisan = artisan;
        addCartModalBtn.dataset.image = img;
      }

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeBtn = overlay.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   7. Google & Apple OAuth Demonstration Buttons
   ========================================================================== */
function initOAuthDemoButtons() {
  document.addEventListener('click', (e) => {
    const googleBtn = e.target.closest('.btn-oauth-google');
    if (googleBtn) {
      e.preventDefault();
      const isSeller = document.getElementById('roleBtnSeller')?.classList.contains('active');
      const role = isSeller ? 'seller' : 'buyer';
      const email = isSeller ? 'radha.devi.shg@gmail.com' : 'patron.artisan@gmail.com';
      const name = isSeller ? 'Radha Devi (SHG Leader)' : 'Google Verified Patron';

      localStorage.setItem('hervana_user', JSON.stringify({
        name: name,
        email: email,
        role: role,
        provider: 'Google',
        isLoggedIn: true
      }));
      localStorage.setItem('hervana_logged_in', 'true');

      try {
        window.open('https://accounts.google.com/signin/v2/identifier', '_blank');
      } catch (err) {}

      showToast('Signing in with Google Account (' + email + ')...', 'success');

      setTimeout(() => {
        if (role === 'seller') {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
      return;
    }

    const appleBtn = e.target.closest('.btn-oauth-apple');
    if (appleBtn) {
      e.preventDefault();
      const isSeller = document.getElementById('roleBtnSeller')?.classList.contains('active');
      const role = isSeller ? 'seller' : 'buyer';
      const email = isSeller ? 'radha.devi.shg@apple.com' : 'patron.artisan@icloud.com';
      const name = isSeller ? 'Radha Devi (SHG Leader)' : 'Apple Verified Patron';

      localStorage.setItem('hervana_user', JSON.stringify({
        name: name,
        email: email,
        role: role,
        provider: 'Apple',
        isLoggedIn: true
      }));
      localStorage.setItem('hervana_logged_in', 'true');

      try {
        window.open('https://appleid.apple.com/auth/authorize', '_blank');
      } catch (err) {}

      showToast('Signing in with Apple ID (' + email + ')...', 'success');

      setTimeout(() => {
        if (role === 'seller') {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
      return;
    }
  });
}

/* ==========================================================================
   8. Catalog Filtering Engine (For products.html)
   ========================================================================== */
function initCatalogFilters() {
  const catalogGrid = document.querySelector('.catalog-products-grid');
  if (!catalogGrid) return;

  const searchInput = document.querySelector('#catalogSearch');
  const sortSelect = document.querySelector('#catalogSort');
  const categoryBoxes = document.querySelectorAll('.category-filter-checkbox');
  const priceRadios = document.querySelectorAll('.price-filter-radio');
  const resultsCount = document.querySelector('.catalog-results-count strong');
  const wishlistCheckbox = document.querySelector('#wishlistFilterCheckbox');

  let activeQuickCategory = 'all';

  function filterProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedPrice = document.querySelector('.price-filter-radio:checked')?.value || 'all';
    const isWishlistMode = (activeQuickCategory === 'wishlist') || (wishlistCheckbox && wishlistCheckbox.checked);

    const selectedCategories = Array.from(categoryBoxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    const cards = catalogGrid.querySelectorAll('.product-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const pid = card.dataset.id;
      const title = card.querySelector('.product-name')?.textContent?.toLowerCase() || card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const category = card.dataset.category?.toLowerCase() || '';
      const price = parseInt(card.dataset.price || '0', 10);

      // Search match
      const matchesSearch = !query || title.includes(query) || category.includes(query);

      // Category / Wishlist match
      let matchesCategory = true;
      if (isWishlistMode) {
        // ONLY display wishlisted products!
        matchesCategory = wishlist.includes(pid);
      } else if (selectedCategories.length > 0) {
        matchesCategory = selectedCategories.includes(category);
      } else if (activeQuickCategory !== 'all') {
        matchesCategory = (category === activeQuickCategory.toLowerCase());
      }

      // Price match
      let matchesPrice = true;
      if (selectedPrice === 'under500') matchesPrice = price < 500;
      else if (selectedPrice === '500to1500') matchesPrice = price >= 500 && price <= 1500;
      else if (selectedPrice === '1500to3000') matchesPrice = price > 1500 && price <= 3000;
      else if (selectedPrice === 'above3000') matchesPrice = price > 3000;

      if (matchesSearch && matchesCategory && matchesPrice) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Empty state banner if wishlist mode is on but wishlist is empty
    let emptyWishlistBanner = catalogGrid.querySelector('.catalog-empty-wishlist-banner');
    if (isWishlistMode && visibleCount === 0) {
      if (!emptyWishlistBanner) {
        emptyWishlistBanner = document.createElement('div');
        emptyWishlistBanner.className = 'catalog-empty-wishlist-banner';
        emptyWishlistBanner.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);';
        catalogGrid.appendChild(emptyWishlistBanner);
      }
      emptyWishlistBanner.innerHTML = `
        <div style="font-size:3.5rem; margin-bottom:1rem;">❤️</div>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">No Wishlisted Products Yet</h3>
        <p style="font-size:0.9rem; max-width:440px; margin:0 auto 1.5rem; color:var(--text-secondary);">Click the heart icon on any handcrafted product across our 30 artisan creations to save it to your personal wishlist.</p>
        <button type="button" class="btn btn-primary" onclick="showAllCatalogCreations()">Explore All 30 Products</button>
      `;
      emptyWishlistBanner.style.display = '';
    } else if (emptyWishlistBanner) {
      emptyWishlistBanner.style.display = 'none';
    }

    if (resultsCount) {
      if (isWishlistMode) {
        resultsCount.textContent = `${visibleCount} wishlisted item${visibleCount === 1 ? '' : 's'} displayed`;
      } else {
        resultsCount.textContent = `${visibleCount} products found`;
      }
    }
  }

  // Expose filterProducts globally so toggleWishlist can refresh the grid
  window.filterProductsCatalog = filterProducts;

  window.showAllCatalogCreations = function() {
    activeQuickCategory = 'all';
    if (wishlistCheckbox) wishlistCheckbox.checked = false;
    const allPill = document.querySelector('.category-quick-pill[data-cat="all"]');
    if (allPill) allPill.click();
    else filterProducts();
  };

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const order = sortSelect.value;
      const cards = Array.from(catalogGrid.querySelectorAll('.product-card'));
      cards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price || '0', 10);
        const priceB = parseInt(b.dataset.price || '0', 10);
        if (order === 'lowToHigh') return priceA - priceB;
        if (order === 'highToLow') return priceB - priceA;
        return 0; // Default popularity
      });
      cards.forEach(c => catalogGrid.appendChild(c));
    });
  }

  // Category Quick Selection Pills
  const quickPills = document.querySelectorAll('.category-quick-pill');
  quickPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = pill.dataset.cat;
      activeQuickCategory = cat;

      quickPills.forEach(p => {
        p.style.background = 'var(--bg-surface)';
        p.style.color = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--text-main)';
        p.style.borderColor = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--border-color)';
        p.classList.remove('active');
      });

      if (cat === 'wishlist') {
        pill.style.background = '#EF4444';
        pill.style.color = '#FFFFFF';
        pill.style.borderColor = '#EF4444';
        pill.classList.add('active');
        if (wishlistCheckbox) wishlistCheckbox.checked = true;
      } else {
        pill.style.background = 'var(--primary)';
        pill.style.color = '#FFFFFF';
        pill.style.borderColor = 'var(--primary)';
        pill.classList.add('active');
        if (wishlistCheckbox) wishlistCheckbox.checked = false;
      }

      categoryBoxes.forEach(cb => {
        if (cat === 'all' || cat === 'wishlist') {
          cb.checked = false;
        } else {
          cb.checked = (cb.value.toLowerCase() === cat.toLowerCase());
        }
      });
      filterProducts();
    });
  });

  categoryBoxes.forEach(cb => {
    cb.addEventListener('change', () => {
      activeQuickCategory = 'all';
      if (wishlistCheckbox) wishlistCheckbox.checked = false;
      const checkedBoxes = Array.from(categoryBoxes).filter(b => b.checked);
      quickPills.forEach(p => {
        p.style.background = 'var(--bg-surface)';
        p.style.color = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--text-main)';
        p.style.borderColor = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--border-color)';
        p.classList.remove('active');
      });
      if (checkedBoxes.length === 1) {
        const matchingPill = document.querySelector(`.category-quick-pill[data-cat="${checkedBoxes[0].value}"]`);
        if (matchingPill) {
          matchingPill.style.background = 'var(--primary)';
          matchingPill.style.color = '#FFFFFF';
          matchingPill.style.borderColor = 'var(--primary)';
          matchingPill.classList.add('active');
        }
      } else if (checkedBoxes.length === 0) {
        const allPill = document.querySelector('.category-quick-pill[data-cat="all"]');
        if (allPill) {
          allPill.style.background = 'var(--primary)';
          allPill.style.color = '#FFFFFF';
          allPill.style.borderColor = 'var(--primary)';
          allPill.classList.add('active');
        }
      }
      filterProducts();
    });
  });

  if (wishlistCheckbox) {
    wishlistCheckbox.addEventListener('change', () => {
      if (wishlistCheckbox.checked) {
        const wishPill = document.querySelector('.category-quick-pill[data-cat="wishlist"]');
        if (wishPill) wishPill.click();
        else {
          activeQuickCategory = 'wishlist';
          filterProducts();
        }
      } else {
        activeQuickCategory = 'all';
        const allPill = document.querySelector('.category-quick-pill[data-cat="all"]');
        if (allPill) allPill.click();
        else filterProducts();
      }
    });
  }

  priceRadios.forEach(pr => pr.addEventListener('change', filterProducts));

  // Handle URL query parameters (?q=..., ?category=..., ?filter=wishlist, ?view=wishlist) on initial load
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    const catParam = urlParams.get('category');
    const filterParam = urlParams.get('filter') || urlParams.get('view');

    if (qParam && searchInput) {
      searchInput.value = qParam;
    }
    if (filterParam === 'wishlist') {
      const wishPill = document.querySelector('.category-quick-pill[data-cat="wishlist"]');
      if (wishPill) {
        wishPill.click();
      }
    } else if (catParam) {
      const targetCat = catParam.toLowerCase();
      activeQuickCategory = targetCat;

      // Highlight the matching quick pill
      quickPills.forEach(p => {
        p.style.background = 'var(--bg-surface)';
        p.style.color = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--text-main)';
        p.style.borderColor = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--border-color)';
        p.classList.remove('active');
        if (p.dataset.cat === targetCat) {
          p.style.background = 'var(--primary)';
          p.style.color = '#FFFFFF';
          p.style.borderColor = 'var(--primary)';
          p.classList.add('active');
        }
      });

      // Synchronize sidebar checkbox
      categoryBoxes.forEach(cb => {
        cb.checked = (cb.value.toLowerCase() === targetCat);
      });

      filterProducts();

      // Smoothly direct and scroll to the category section
      setTimeout(() => {
        const targetSection = document.getElementById('categories') || document.querySelector('.catalog-layout');
        if (targetSection) {
          const headerOffset = 90;
          const pos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }, 150);
    } else {
      filterProducts();
    }
  } catch (err) {
    // Graceful fallback
  }

  // Intercept category link clicks while on products.html to directly filter and scroll to the section
  document.addEventListener('click', (e) => {
    const catLink = e.target.closest('a[href*="category="]');
    if (catLink && window.location.pathname.includes('products.html')) {
      try {
        const url = new URL(catLink.href, window.location.href);
        const cat = url.searchParams.get('category');
        if (cat) {
          e.preventDefault();
          const targetCat = cat.toLowerCase();
          activeQuickCategory = targetCat;

          quickPills.forEach(p => {
            p.style.background = 'var(--bg-surface)';
            p.style.color = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--text-main)';
            p.style.borderColor = p.dataset.cat === 'wishlist' ? '#EF4444' : 'var(--border-color)';
            p.classList.remove('active');
            if (p.dataset.cat === targetCat) {
              p.style.background = 'var(--primary)';
              p.style.color = '#FFFFFF';
              p.style.borderColor = 'var(--primary)';
              p.classList.add('active');
            }
          });

          categoryBoxes.forEach(cb => {
            cb.checked = (cb.value.toLowerCase() === targetCat);
          });

          filterProducts();

          const targetSection = document.getElementById('categories') || document.querySelector('.catalog-layout');
          if (targetSection) {
            const headerOffset = 90;
            const pos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
          window.history.pushState(null, '', `products.html?category=${targetCat}#categories`);
        }
      } catch (ex) {}
    }
  });

  // Smooth scroll for top-level Categories navbar link on products.html
  document.addEventListener('click', (e) => {
    const navCatBtn = e.target.closest('a[href="#categories"]');
    if (navCatBtn) {
      e.preventDefault();
      const targetSection = document.getElementById('categories') || document.querySelector('.catalog-layout');
      if (targetSection) {
        const headerOffset = 90;
        const pos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    }
  });
}


/* ==========================================================================
   9. Newsletter Form Feedback
   ========================================================================== */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast('Thank you! You are subscribed to HerVana artisan updates.', 'success');
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   10. Hero Cinematic Background Video Controls & Accessibility
   ========================================================================== */
function initHeroVideoControls() {
  const video = document.getElementById('heroBgVideo');
  const playPauseBtn = document.getElementById('heroPlayPauseBtn');
  const muteBtn = document.getElementById('heroMuteBtn');

  if (!video) return;

  // Handle Play / Pause button
  if (playPauseBtn) {
    const pauseIcon = playPauseBtn.querySelector('.ctrl-icon-pause');
    const playIcon = playPauseBtn.querySelector('.ctrl-icon-play');
    const textSpan = playPauseBtn.querySelector('.ctrl-text');

    const updatePlayState = (isPaused) => {
      if (pauseIcon) pauseIcon.style.display = isPaused ? 'none' : 'block';
      if (playIcon) playIcon.style.display = isPaused ? 'block' : 'none';
      if (textSpan) textSpan.textContent = isPaused ? 'Play' : 'Pause';
      playPauseBtn.setAttribute('aria-label', isPaused ? 'Play background video' : 'Pause background video');
    };

    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        updatePlayState(false);
      } else {
        video.pause();
        updatePlayState(true);
      }
    });

    video.addEventListener('play', () => updatePlayState(false));
    video.addEventListener('pause', () => updatePlayState(true));
  }

  // Handle Mute / Unmute button
  if (muteBtn) {
    const mutedIcon = muteBtn.querySelector('.ctrl-icon-muted');
    const unmutedIcon = muteBtn.querySelector('.ctrl-icon-unmuted');
    const textSpan = muteBtn.querySelector('.ctrl-text');

    const updateMuteState = (isMuted) => {
      if (mutedIcon) mutedIcon.style.display = isMuted ? 'block' : 'none';
      if (unmutedIcon) unmutedIcon.style.display = isMuted ? 'none' : 'block';
      if (textSpan) textSpan.textContent = isMuted ? 'Muted' : 'Sound';
      muteBtn.setAttribute('aria-label', isMuted ? 'Unmute video audio' : 'Mute video audio');
    };

    // Autoplay requires muted
    video.muted = true;
    updateMuteState(true);

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      updateMuteState(video.muted);
      showToast(video.muted ? 'Video Muted 🔇' : 'Video Audio Enabled 🔊', 'demo');
    });
  }

  // Respect prefers-reduced-motion
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      video.pause();
    }
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  } catch (e) {
    // Media query not supported in this environment
  }

  // Fallback graceful degradation on error
  video.addEventListener('error', () => {
    video.style.display = 'none';
    const fallbackImg = document.querySelector('.hero-video-fallback');
    if (fallbackImg) fallbackImg.style.display = 'block';
  });
}
