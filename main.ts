// ============================================================
// Dominion Estates — main.ts
// Structured for static site interactivity and easy Angular/React migrations.
// ============================================================

// ── Interfaces ──────────────────────────────────────────────

interface Photo {
  url: string;
  alt: string;
}

interface Listing {
  id: string;
  badge: string;
  location: string;
  title: string;
  price: number;
  priceUnit: string;
  beds: string;
  baths: string;
  utilitiesIncluded: boolean;
  description: string;
  amenities: string[];
  photos: Photo[];
  furnishedFinderUrl: string;
  cleaningFee?: number;
  deposit?: number;
  minStay: number; // days
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  listingId: string;
  moveInDate: string;
  message: string;
}

// ── ListingService ───────────────────────────────────────────

class ListingService {
  private listings: Listing[] = [
    {
      id: 'newport-1',
      badge: 'Available Now',
      location: 'Newport Beach, CA',
      title: 'Newport Beach Furnished Apartment — Unit 1',
      price: 3495,
      priceUnit: 'month',
      beds: '1 Bed · Queen Bed',
      baths: '1 Bath · Fully Furnished',
      utilitiesIncluded: true,
      minStay: 30,
      cleaningFee: 150,
      deposit: 500,
      description:
        'Indulge in modern coastal luxury at Dominion Estates. This premium 1-bedroom, 1-bathroom apartment features ' +
        'a beautifully furnished interior with a dedicated office desk, high-speed WiFi, and flat-screen smart TVs. ' +
        'Enjoy a fully equipped gourmet kitchen, self check-in access, and assigned parking. ' +
        'Ideally situated just minutes from John Wayne Airport, golden sands, premium shopping districts, and fine dining. ' +
        'Guests enjoy complete access to private pools, hot tubs, high-end fitness facilities, and tennis/basketball courts. ' +
        'Perfect for corporate relocations and mid-term stays (30-day minimum). All utilities are included in the rate.',
      amenities: [
        '🛋️ Fully Furnished',
        '🛏️ Queen Bed',
        '🍳 Full Kitchen',
        '📶 High-Speed WiFi',
        '📺 Smart TV',
        '💼 Office Desk',
        '🚗 Assigned Parking',
        '🏊 Private Pool & Spa',
        '🏋️ Fitness Gym',
        '🏸 Tennis & Basketball',
        '🧺 Laundry Access',
        '🚪 Self Check-In',
        '⚡ Utilities Included'
      ],
      furnishedFinderUrl: 'https://www.furnishedfinder.com/property/522051_1',
      photos: [
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132677-full.jpg', alt: 'Living Room Lounge' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132654-full.jpg', alt: 'Master Bedroom suite' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132664-full.jpg', alt: 'Fully Equipped Kitchen' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132666-full.jpg', alt: 'Modern Bathroom' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132668-full.jpg', alt: 'Private Sun Terrace' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132669-full.jpg', alt: 'Resort Swimming Pool' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132670-full.jpg', alt: 'Exterior courtyard' }
      ]
    },
    {
      id: 'newport-2',
      badge: 'Available Now',
      location: 'Newport Beach, CA',
      title: 'Newport Beach Furnished Apartment — Unit 2',
      price: 3495,
      priceUnit: 'month',
      beds: '1 Bed · Queen Bed',
      baths: '1 Bath · Fully Furnished',
      utilitiesIncluded: true,
      minStay: 30,
      cleaningFee: 150,
      deposit: 500,
      description:
        'This premium 1-bedroom, 1-bathroom apartment is the sister unit to Unit 1, located in the same luxury building ' +
        'and sharing the same suite of high-end resort amenities. Features a fully equipped kitchen, self check-in ' +
        'smart locks, private terrace access, dedicated study/work desk, and premium bedding. ' +
        'All utilities (electric, gas, high-speed internet, water, and trash) are bundled in the rate. ' +
        'Perfect for executive business travelers, traveling healthcare workers, or temporary coastal residencies.',
      amenities: [
        '🛋️ Fully Furnished',
        '🛏️ Queen Bed',
        '🍳 Full Kitchen',
        '📶 High-Speed WiFi',
        '📺 Smart TV',
        '💼 Office Desk',
        '🚗 Assigned Parking',
        '🏊 Private Pool & Spa',
        '🏋️ Fitness Gym',
        '🏸 Tennis & Basketball',
        '🧺 Laundry Access',
        '🚪 Self Check-In',
        '⚡ Utilities Included'
      ],
      furnishedFinderUrl: 'https://www.furnishedfinder.com/property/522051_1',
      photos: [
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132671-full.jpg', alt: 'Living Area & Seating' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132674-full.jpg', alt: 'Comfortable Bedroom' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132675-full.jpg', alt: 'Dining area and Kitchen' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132676-full.jpg', alt: 'Bathroom Vanity' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132678-full.jpg', alt: 'Courtyard Pool View' },
        { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132677-full.jpg', alt: 'Living Space Overview' }
      ]
    },
    {
      id: 'newport-3',
      badge: 'Available Now',
      location: 'Newport Beach, CA',
      title: 'Cozy 1BR Apartment Near Beach, Dining & Airport',
      price: 3495,
      priceUnit: 'month',
      beds: '1 Bed · Queen Bed',
      baths: '1 Bath · Fully Furnished',
      utilitiesIncluded: true,
      minStay: 30,
      cleaningFee: 150,
      deposit: 500,
      description:
        'This private 1BR apartment includes a bedroom, living room, kitchen, bathroom, WiFi, A/C, and assigned/private parking. ' +
        'Recently refreshed with updated décor, improved furnishings, fresh bedding, and a cleaner guest-ready setup. ' +
        'The kitchen includes a refrigerator, microwave, dishwasher, coffee maker, cookware, dishes, cups, cutlery, and basic utensils. ' +
        'Located inside a Newport Beach apartment community with access to the pool, gym, tennis/basketball courts, and laundry area. ' +
        'Guests have private access to the full 1BR apartment plus available community amenities. This is a self-check-in property — ' +
        'guests receive detailed check-in instructions covering building, gate/access, parking, and unit details ahead of arrival. ' +
        'Ideally situated near the beach, dining, and John Wayne Airport.',
      amenities: [
        '🛋️ Fully Furnished',
        '🛏️ Queen Bed',
        '🍳 Full Kitchen',
        '📶 High-Speed WiFi',
        '📺 Smart TV',
        '💼 Office Desk',
        '🚗 Assigned Parking',
        '🏊 Private Pool & Spa',
        '🏋️ Fitness Gym',
        '🏸 Tennis & Basketball',
        '🧺 Laundry Access',
        '🚪 Self Check-In',
        '⚡ Utilities Included'
      ],
      furnishedFinderUrl: 'https://www.furnishedfinder.com/property/522051_1',
      photos: [
        { url: 'images/newport-3/01_COVER_living_room_wide_current.jpg', alt: 'Furnished living room in Newport Beach apartment rental' },
        { url: 'images/newport-3/02_bedroom_updated_clean_rug.jpg', alt: 'Furnished bedroom with queen bed in Newport Beach rental' },
        { url: 'images/newport-3/03_bedroom_wide_with_paintings.jpg', alt: 'Newport Beach furnished apartment bedroom wide view' },
        { url: 'images/newport-3/04_bedroom_side_view_rug.jpg', alt: 'Cozy furnished bedroom in Newport Beach mid-term rental' },
        { url: 'images/newport-3/05_bedroom_tv_view.jpg', alt: 'Bedroom with smart TV in Newport Beach furnished apartment' },
        { url: 'images/newport-3/06_bedroom_extra_linens_closet.jpg', alt: 'Bedroom closet with fresh linens in Newport Beach rental' },
        { url: 'images/newport-3/07_living_room_seating_wide.jpg', alt: 'Spacious living room seating in Newport Beach furnished rental' },
        { url: 'images/newport-3/08_living_room_sofa_current.jpg', alt: 'Comfortable sofa in Newport Beach furnished apartment living room' },
        { url: 'images/newport-3/09_living_room_accent_chair.jpg', alt: 'Leather accent chair in Newport Beach furnished rental' },
        { url: 'images/newport-3/10_dining_area_wide.jpg', alt: 'Dining area in Newport Beach furnished apartment' },
        { url: 'images/newport-3/11_dining_work_area.jpg', alt: 'Dining and work area in Newport Beach mid-term rental' },
        { url: 'images/newport-3/12_desk_workspace.jpg', alt: 'Dedicated work desk in Newport Beach furnished apartment' },
        { url: 'images/newport-3/13_kitchen_wide.jpg', alt: 'Fully equipped kitchen in Newport Beach furnished rental' },
        { url: 'images/newport-3/14_kitchen_counter_sink.jpg', alt: 'Kitchen counter and sink in Newport Beach furnished apartment' },
        { url: 'images/newport-3/15_kitchen_decor_stove.jpg', alt: 'Kitchen stove and cookware in Newport Beach rental' },
        { url: 'images/newport-3/16_bathroom_vanity_clean.jpg', alt: 'Clean bathroom vanity in Newport Beach furnished apartment' },
        { url: 'images/newport-3/17_bathroom_vanity_angle.jpg', alt: 'Bathroom vanity in Newport Beach furnished rental' },
        { url: 'images/newport-3/18_bathroom_amenities.jpg', alt: 'Bathroom amenities in Newport Beach furnished apartment' },
        { url: 'images/newport-3/19_bathroom_counter_detail.jpg', alt: 'Bathroom counter detail in Newport Beach rental' },
        { url: 'images/newport-3/20_living_room_detail.jpg', alt: 'Living room decor detail in Newport Beach furnished apartment' },
        { url: 'images/newport-3/21_bedroom_angle_with_mirror.jpg', alt: 'Furnished bedroom with mirror in Newport Beach rental' },
        { url: 'images/newport-3/22_bedroom_painting_lamps.jpg', alt: 'Bedroom with wall art and lamps in Newport Beach furnished apartment' }
      ]
    }
  ];

  getAll(): Listing[] {
    return this.listings;
  }

  getById(id: string): Listing | undefined {
    return this.listings.find((l) => l.id === id);
  }
}

// ── BookingService ───────────────────────────────────────────

class BookingService {
  // Configured placeholder Formspree endpoint from original source structure
  private readonly FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrevkqvo';

  async submit(data: BookingFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(this.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return { success: true, message: "Thank you! Your inquiry was sent successfully. We will follow up within 24 hours." };
      } else {
        return { success: false, message: 'We encountered an error. Please email us directly at info@dominionestatesrentals.com.' };
      }
    } catch {
      return { success: false, message: 'Network error. Please verify your internet connection or email info@dominionestatesrentals.com.' };
    }
  }

  async handleSubmit(form: HTMLFormElement, listingId: string): Promise<void> {
    const statusEl = document.getElementById('form-status') as HTMLElement;
    const btnText = form.querySelector('.btn-normal-text') as HTMLElement;
    const btnLoading = form.querySelector('.btn-loading-text') as HTMLElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (btnText && btnLoading && submitBtn) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      submitBtn.disabled = true;
    }
    
    statusEl.className = 'form-status-container';
    statusEl.style.display = 'none';

    const data: BookingFormData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      listingId,
      moveInDate: (form.elements.namedItem('moveInDate') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    const result = await this.submit(data);

    if (btnText && btnLoading && submitBtn) {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }

    statusEl.textContent = result.message;
    statusEl.style.display = 'block';
    statusEl.className = `form-status-container ${result.success ? 'success' : 'error'}`;

    if (result.success) form.reset();
  }
}

// ── ModalComponent ────────────────────────────────────────────

class ModalComponent {
  private currentSlide: number = 0;
  private photos: Photo[] = [];
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.getElementById('modal-overlay') as HTMLElement;
    
    // Close modal if clicked outside
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.nextPhoto();
      if (e.key === 'ArrowLeft') this.prevPhoto();
    });
  }

  open(listing: Listing): void {
    this.photos = listing.photos;
    this.currentSlide = 0;
    this.renderModal(listing);
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  nextPhoto(): void {
    if (this.photos.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.photos.length;
    this.updateGallery();
  }

  prevPhoto(): void {
    if (this.photos.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.photos.length) % this.photos.length;
    this.updateGallery();
  }

  goToPhoto(index: number): void {
    this.currentSlide = index;
    this.updateGallery();
  }

  private updateGallery(): void {
    const track = document.getElementById('modal-track') as HTMLElement;
    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    // Prefetch the neighbours so the next/prev click shows instantly.
    [this.currentSlide + 1, this.currentSlide - 1].forEach((i) => {
      const p = this.photos[(i + this.photos.length) % this.photos.length];
      if (p) {
        const img = new Image();
        img.src = p.url;
      }
    });
    document.querySelectorAll('.slider-dot-modal').forEach((d, i) => {
      d.classList.toggle('active', i === this.currentSlide);
    });
    const counter = document.getElementById('photo-counter-modal');
    if (counter) {
      counter.textContent = `${this.currentSlide + 1} / ${this.photos.length}`;
    }
  }

  private renderModal(listing: Listing): void {
    const content = document.getElementById('modal-content') as HTMLElement;
    const fees: string[] = [];
    if (listing.cleaningFee) fees.push(`Cleaning Fee: $${listing.cleaningFee}`);
    if (listing.deposit) fees.push(`Refundable Security Deposit: $${listing.deposit}`);

    // Eager-load the first two slides so the opening image and the first
    // "next" click are instant; lazy-load the rest so they don't all
    // download at once and starve the visible photo.
    const photosHtml = listing.photos
      .map((p, i) => `<img src="${p.url}" alt="${p.alt}" width="1400" height="1050" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${i === 0 ? 'high' : 'low'}" onerror="this.src='';this.style.background='#0A1931';this.style.display='flex';" />`)
      .join('');

    const dotsHtml = listing.photos
      .map((_, i) => `<span class="slider-dot slider-dot-modal ${i === 0 ? 'active' : ''}" onclick="modalComponent.goToPhoto(${i})"></span>`)
      .join('');

    const amenitiesHtml = listing.amenities
      .map((a) => `<span class="amenity-pill">${a}</span>`)
      .join('');

    content.innerHTML = `
      <div class="modal-close-header">
        <button class="btn-modal-close" onclick="modalComponent.close()">✕ Close</button>
      </div>

      <!-- Image Gallery -->
      <div class="modal-gallery">
        <div style="height: 100%; overflow: hidden;">
          <div id="modal-track" class="modal-gallery-track">${photosHtml}</div>
        </div>
        <button class="slider-arrow prev" onclick="modalComponent.prevPhoto()">&#8249;</button>
        <button class="slider-arrow next" onclick="modalComponent.nextPhoto()">&#8250;</button>
        <div class="slider-dots">${dotsHtml}</div>
        <span id="photo-counter-modal" class="modal-photo-counter">1 / ${listing.photos.length}</span>
      </div>

      <!-- Content Panels -->
      <div class="modal-body">
        <div class="modal-info-panel">
          <div class="modal-loc-info">📍 ${listing.location}</div>
          <h2 class="modal-title-text">${listing.title}</h2>
          <div class="modal-price-tag">$${listing.price.toLocaleString()} <span>/ ${listing.priceUnit}</span></div>
          
          <div class="modal-key-specs">
            <span>🛏️ ${listing.beds}</span>
            <span>🚿 ${listing.baths}</span>
            <span>📅 Min. Stay: ${listing.minStay} days</span>
            <span>⚡ Utilities Included</span>
          </div>

          ${fees.length ? `<div class="modal-fees-notice"><strong>Fee Information:</strong> ${fees.join(' &nbsp;·&nbsp; ')}</div>` : ''}

          <p class="modal-description-paragraph">${listing.description}</p>
          
          <div class="modal-amenities-section">
            <h4>Included Amenities:</h4>
            <div class="modal-amenities-tags">${amenitiesHtml}</div>
          </div>
          
          <div style="margin-top: 35px; border-top: 1px solid var(--border); padding-top: 25px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
            <a href="${listing.furnishedFinderUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--gold-dark); text-decoration: none; font-size: 0.9rem; font-weight: 600;">
              Also view on Furnished Finder ↗
            </a>
            <span style="color: var(--border);">|</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">KeyCheck verification available upon request</span>
          </div>
        </div>

        <!-- Request Stay Booking Form -->
        <div class="modal-booking-panel">
          <h3>Request Stay</h3>
          <p>Please enter your contact details and desired dates to request reservation availability.</p>
          
          <form id="modal-booking-form" class="inquiry-form">
            <div class="form-status-container" id="form-status"></div>
            
            <div class="form-group">
              <label for="modal-name">Full Name</label>
              <input type="text" id="modal-name" name="name" class="form-input" required placeholder="John Doe" />
            </div>

            <div class="form-group">
              <label for="modal-email">Email Address</label>
              <input type="email" id="modal-email" name="email" class="form-input" required placeholder="john@example.com" />
            </div>

            <div class="form-group">
              <label for="modal-phone">Phone Number</label>
              <input type="tel" id="modal-phone" name="phone" class="form-input" placeholder="(949) 555-0199" />
            </div>

            <div class="form-group">
              <label for="modal-date">Desired Move-in Date</label>
              <input type="date" id="modal-date" name="moveInDate" class="form-input" required />
            </div>

            <div class="form-group">
              <label for="modal-message">Message / Special Requests</label>
              <textarea id="modal-message" name="message" class="form-input" placeholder="Introduce yourself! Let us know if you have corporate requests or pets..."></textarea>
            </div>

            <button type="submit" class="btn-submit-form">
              <span class="btn-normal-text">Send Booking Request</span>
              <span class="btn-loading-text">Sending request...</span>
            </button>
            
            <div style="margin-top: 15px; text-align: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                Ready to book? You can also <a href="#payments" onclick="modalComponent.close();" style="color: var(--gold-dark); text-decoration: none; font-weight: bold;">Pay Deposit</a> directly.
              </span>
            </div>
          </form>
        </div>
      </div>
    `;

    // Attach form submit handler
    const form = document.getElementById('modal-booking-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await bookingService.handleSubmit(form, listing.id);
      });
    }
  }
}

// ── CardComponent ─────────────────────────────────────────────

class CardComponent {
  private slidePositions: Map<string, number> = new Map();

  renderAll(listings: Listing[]): void {
    const grid = document.getElementById('listings-grid') as HTMLElement;
    if (!grid) return;
    
    grid.innerHTML = listings.map((l) => this.renderCard(l)).join('');
    listings.forEach((l) => this.slidePositions.set(l.id, 0));
  }

  private renderCard(l: Listing): string {
    const displayPhotos = l.photos.slice(0, 5);
    const slidesHtml = displayPhotos
      .map((p, i) => `<img src="${p.url}" alt="${p.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.src='';this.parentElement.style.background='#0A1931'" />`)
      .join('');
      
    const dotsHtml = displayPhotos
      .map((_, i) => `<span class="slider-dot slider-dot-${l.id} ${i === 0 ? 'active' : ''}" onclick="cardComponent.goTo('${l.id}', ${i}); event.stopPropagation();"></span>`)
      .join('');

    return `
      <div class="listing-card" onclick="modalComponent.open(listingService.getById('${l.id}'))">
        <!-- Gallery Slider -->
        <div class="card-slider" id="slider-${l.id}">
          <div class="slides-wrapper" id="slides-${l.id}">${slidesHtml}</div>
          <button class="slider-arrow prev" onclick="cardComponent.slide('${l.id}', -1); event.stopPropagation();">&#8249;</button>
          <button class="slider-arrow next" onclick="cardComponent.slide('${l.id}', 1); event.stopPropagation();">&#8250;</button>
          <div class="slider-dots">${dotsHtml}</div>
          <div class="listing-status-badge">${l.badge}</div>
        </div>

        <!-- Listing Details -->
        <div class="listing-details">
          <div class="listing-loc">📍 ${l.location}</div>
          <h3 class="listing-title">${l.title}</h3>
          <div class="listing-rate">$${l.price.toLocaleString()} <span>/ ${l.priceUnit}</span></div>
          
          <div class="listing-quick-specs">
            <span>🛏️ ${l.beds}</span>
            <span>🚿 ${l.baths}</span>
            <span>⚡ Utilities Incl.</span>
          </div>

          <p class="listing-brief-desc">${l.description.substring(0, 150)}...</p>
          
          <!-- Actions -->
          <div class="listing-ctas">
            <button class="btn btn-navy" onclick="modalComponent.open(listingService.getById('${l.id}')); event.stopPropagation();">
              Request Stay
            </button>
            <a href="https://square.link/u/UtOUcZAp" target="_blank" rel="noopener noreferrer" class="btn btn-solid" onclick="event.stopPropagation();">
              Pay Deposit
            </a>
          </div>
        </div>
      </div>
    `;
  }

  slide(id: string, direction: number): void {
    const slides = document.getElementById(`slides-${id}`) as HTMLElement;
    if (!slides) return;
    
    const count = slides.querySelectorAll('img').length;
    const currentIdx = this.slidePositions.get(id) ?? 0;
    const nextIdx = (currentIdx + direction + count) % count;
    
    this.slidePositions.set(id, nextIdx);
    slides.style.transform = `translateX(-${nextIdx * 100}%)`;
    this.updateDots(id, nextIdx);
  }

  goTo(id: string, index: number): void {
    const slides = document.getElementById(`slides-${id}`) as HTMLElement;
    if (!slides) return;
    
    this.slidePositions.set(id, index);
    slides.style.transform = `translateX(-${index * 100}%)`;
    this.updateDots(id, index);
  }

  private updateDots(id: string, activeIndex: number): void {
    const dots = document.querySelectorAll(`.slider-dot-${id}`);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
}

// ── Bootstrap & Initialisation ─────────────────────────────────

const listingService = new ListingService();
const bookingService = new BookingService();
const modalComponent = new ModalComponent();
const cardComponent = new CardComponent();

document.addEventListener('DOMContentLoaded', () => {
  // Render listings
  cardComponent.renderAll(listingService.getAll());

  // Setup smooth scroll for page anchors
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
