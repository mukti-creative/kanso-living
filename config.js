/**
 * ============================================================================
 *  CLIENT_CONFIG — the ONLY file you need to edit for a new client.
 * ============================================================================
 *  Everything the page displays is read from this object by app.js:
 *  branding, colors, copywriting, listings, facilities, banks, testimonials
 *  and WhatsApp settings.
 *
 *  Quick checklist for a new client (details in README.md):
 *    1. brand + meta          → name, logo icon, page title
 *    2. theme                 → paste a palette preset (see PALETTE PRESETS)
 *    3. whatsapp.phone        → international format, digits only (62812...)
 *    4. images                → overwrite files in ./assets/ or change the paths
 *    5. properties.items      → one object per unit/typology
 *    6. copy sections         → hero, pillars, facilities, kpr, footer ...
 *
 *  Tones: wherever you see `tone`, use one of
 *    'primary' | 'secondary' | 'accent' | 'dark' | 'surface'
 *  They map to the theme colors below, so recoloring the brand recolors them.
 *
 *  Icons: any name from https://fonts.google.com/icons (Material Symbols).
 *
 *  Switching to English: translate the strings in `meta`, `hero`, `pillars`,
 *  `properties`, `facilities`, `kpr`, `consultation`, `footer`, `ui`,
 *  `whatsapp.messages`, and set `locale: 'en-US'`, `currency.prefix: '$'`.
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
 *  IMAGES
 *  Every image used on the page lives here. Files are stored locally in
 *  ./assets/ (originally sunlit modern-architecture photos from Unsplash),
 *  so the page works offline and never depends on a third-party CDN.
 *  To swap an image, overwrite the file or point to a new path/URL.
 * ------------------------------------------------------------------------- */
const IMAGES = {
  hero:        './assets/hero.jpg',      // hero card
  interior:    './assets/interior.jpg',  // facilities card 1
  park:        './assets/park.jpg',      // facilities card 2

  // Property galleries
  atelier:     ['./assets/atelier-1.jpg', './assets/interior.jpg', './assets/atelier-2.jpg'],
  veranda:     ['./assets/veranda-1.jpg', './assets/veranda-2.jpg', './assets/veranda-3.jpg'],
  horizon:     ['./assets/park.jpg', './assets/horizon-2.jpg', './assets/horizon-3.jpg'],

  // Floorplan placeholder (replace with the real denah per unit)
  floorplan:   './assets/floorplan.jpg',
};

/* ---------------------------------------------------------------------------
 *  COLOR PALETTE PRESETS — copy a preset's values into `theme` below.
 * ------------------------------------------------------------------------- */
// Preset 1: Vibrant Architectural Pop (default)
//   primary '#1E5EFF'  secondary '#FF5A1F'  accent '#FFC700'  dark '#121417'
//
// Preset 2: Tropical Emerald & Sky
//   primary '#0E9F6E'  secondary '#0EA5E9'  accent '#FDE047'  dark '#0B2A24'
//   onPrimary '#FFFFFF'  onSecondary '#0B2A24'  onAccent '#0B2A24'
//
// Preset 3: Modern Warm Terracotta & Navy
//   primary '#1E3A8A'  secondary '#C8553D'  accent '#F2C14E'  dark '#111827'
//   onPrimary '#FFFFFF'  onSecondary '#FFFFFF'  onAccent '#111827'

const CLIENT_CONFIG = {
  /* ---- Images (defined at the top of this file) ------------------------- */
  images: IMAGES,

  /* ---- Page / SEO ------------------------------------------------------- */
  locale: 'id-ID',            // number formatting (id-ID → 1.250.000.000)
  currency: { prefix: 'Rp' },
  meta: {
    lang: 'id',
    title: 'Kanso Living — Hunian Modern Bergaya Swiss Bento di Jakarta Selatan',
    description: 'Rumah modern penuh cahaya matahari dengan akses tol 5 menit, KPR transparan, dan DP ringan. Jadwalkan kunjungan hari ini.',
  },

  /* ---- Brand ------------------------------------------------------------ */
  brand: {
    name: 'Kanso Living',
    logoIcon: 'grid_view',    // Material Symbols icon name (or swap logo markup in index.html)
    developer: 'Kanso Living Development',
  },

  /* ---- Theme (drives Tailwind tokens through CSS variables) ------------- */
  theme: {
    primary:        '#1E5EFF', // was "electric-blue"
    secondary:      '#FF5A1F', // was "tangerine"
    accent:         '#FFC700', // was "sunlit-yellow"
    dark:           '#121417', // was "charcoal" (footer, dark cards)
    surface:        '#FFFFFF',
    surfaceSubtle:  '#F8FAFC',
    onSurface:      '#121417',
    onSurfaceMuted: '#475569',
    outline:        '#E2E8F0',
    onPrimary:      '#FFFFFF', // text on primary blocks
    onSecondary:    '#121417',
    onAccent:       '#121417',
    onDark:         '#FFFFFF',
    darkMuted:      '#94A3B8', // secondary text on dark
    darkSurface:    '#1E2229', // dividers on dark
  },

  /* ---- WhatsApp --------------------------------------------------------- */
  whatsapp: {
    phone: '628110000000', // international format, digits only (no + or spaces)
    // Placeholders: {brand} {unit} {price} {dp} {dpAmount} {tenor} {rate} {monthly}
    messages: {
      general:  'Halo {brand}, saya ingin berkonsultasi mengenai unit yang tersedia.',
      visit:    'Halo {brand}, saya ingin menjadwalkan kunjungan ke marketing gallery.',
      property: 'Halo {brand}, saya tertarik dengan unit "{unit}". Mohon info ketersediaan dan harga terbaru.',
      kpr:      'Halo {brand}, saya ingin mengajukan KPR.\n\nUnit: {unit}\nHarga: {price}\nDP: {dp}% ({dpAmount})\nTenor: {tenor} tahun\nBunga fixed: {rate}%\nEstimasi cicilan: {monthly}/bulan\n\nMohon info proses selanjutnya.',
    },
  },

  /* ---- Navigation ------------------------------------------------------- */
  nav: [
    { label: 'Properti',      href: '#properties' },
    { label: 'Fasilitas',     href: '#facilities' },
    { label: 'Simulasi KPR',  href: '#kpr-simulation' },
    { label: 'Tentang',       href: '#about' },
  ],
  header: { ctaLabel: 'Jadwalkan Kunjungan' },

  /* ---- Hero ------------------------------------------------------------- */
  hero: {
    badge: { status: 'Tahap 02 Dibuka', location: 'Jakarta Selatan' },
    title: 'Temukan Hunian Modern yang Terang dan Nyaman',
    subtitle: 'Rumah modular penuh cahaya dengan proporsi Swiss yang rapi, akses tol hanya 5 menit, dan KPR transparan bersama bank rekanan.',
    primaryCta:   { label: 'Lihat Properti', href: '#properties' },
    secondaryCta: { label: 'Simulasi KPR',   href: '#kpr-simulation' },
    metrics: [
      { value: '180+',  label: 'Unit Terserah-terima' },
      { value: '4,25%', label: 'Bunga KPR Fixed' },
      { value: '5 mnt', label: 'Ke Gerbang Tol' },
    ],
    // 'natural' = original photo colors (default) | 'duotone' = grayscale + brand-blue tint
    imageStyle: 'natural',
    imageAlt: 'Rumah modern dengan geometri beton bersih di bawah sinar matahari',
    badges: [
      { icon: 'verified', tone: 'primary',   label: 'Siap Huni' },
      { icon: 'payments', tone: 'secondary', label: 'DP 0%' },
    ],
    locationChip: { icon: 'location_on', tone: 'primary', label: 'Lokasi Strategis' },
  },

  /* ---- Four pillars ----------------------------------------------------- */
  pillars: {
    title: 'Dibangun di Atas Empat Keunggulan',
    subtitle: 'Setiap cluster memadukan kemudahan akses, arsitektur sejuk alami, dan kejelasan legalitas.',
    items: [
      { tone: 'secondary', icon: 'alt_route',      title: 'Akses Strategis',   text: 'Lima menit ke gerbang tol JORR dan dua belas menit ke stasiun MRT.' },
      { tone: 'primary',   icon: 'architecture',   title: 'Arsitektur Modern', text: 'Kaca double-height dan ventilasi silang membawa cahaya alami ke setiap ruangan.' },
      { tone: 'accent',    icon: 'account_balance',title: 'KPR Mudah',         text: 'Pra-persetujuan KPR dengan lima bank rekanan dan opsi DP 0%.' },
      { tone: 'dark',      icon: 'trending_up',    title: 'Investasi Unggul',  text: 'Kenaikan nilai rata-rata 9,4% per tahun di kawasan transit Jakarta Selatan.' },
    ],
  },

  /* ---- Properties ------------------------------------------------------- */
  properties: {
    title: 'Hunian Pilihan',
    subtitle: 'Pilih tipe rumah untuk melihat denah, harga, dan jadwal serah terima.',
    filterAriaLabel: 'Filter properti berdasarkan tipe',
    // `id` must match each item's `category`. Keep { id: 'all' } first.
    categories: [
      { id: 'all',       label: 'Semua Tipe' },
      { id: 'cluster',   label: 'Rumah Cluster' },
      { id: 'villa',     label: 'Villa Taman' },
      { id: 'townhouse', label: 'Townhouse' },
    ],
    /**
     * One object per unit.
     *  price  → number in Rupiah (no dots)
     *  lt/lb  → Luas Tanah / Luas Bangunan in m²
     *  kt/km  → Kamar Tidur / Kamar Mandi
     *  carport→ number of cars
     *  certificate → 'SHM' | 'HGB' | ...
     *  promo  → badge shown on card + modal; tone picks its color
     */
    items: [
      {
        id: 'atelier',
        category: 'cluster',
        typeLabel: 'Rumah Cluster',
        location: 'Kemang Utara',
        name: 'The Atelier Residence',
        price: 2950000000,
        promo: { label: 'Siap Huni', tone: 'surface' },
        lt: 120, lb: 145, kt: 3, km: 3, carport: 2, certificate: 'SHM',
        description: 'Rumah dua lantai dengan void tinggi, jendela besar menghadap taman, dan lantai kayu oak. Cocok untuk keluarga muda yang mengutamakan cahaya alami dan sirkulasi udara.',
        images: IMAGES.atelier,
        floorplan: IMAGES.floorplan,
      },
      {
        id: 'veranda',
        category: 'villa',
        typeLabel: 'Villa Taman',
        location: 'Pondok Indah',
        name: 'Kanso Veranda Villa',
        price: 4450000000,
        promo: { label: 'Unit Hook', tone: 'accent' },
        lt: 210, lb: 210, kt: 4, km: 4, carport: 3, certificate: 'SHM',
        description: 'Villa di lot sudut dengan veranda luas, taman privat, dan area makan semi-terbuka. Dilengkapi smart lock dan instalasi panel surya siap pasang.',
        images: IMAGES.veranda,
        floorplan: IMAGES.floorplan,
      },
      {
        id: 'horizon',
        category: 'townhouse',
        typeLabel: 'Townhouse',
        location: 'Cilandak',
        name: 'Horizon Urban Row',
        price: 2450000000,
        promo: { label: 'Fase Baru', tone: 'primary' },
        lt: 84, lb: 128, kt: 3, km: 2, carport: 1, certificate: 'HGB',
        description: 'Townhouse tiga lantai dengan rooftop terrace, layout efisien, dan akses langsung ke jalur hijau. Pilihan ideal untuk profesional yang aktif di pusat kota.',
        images: IMAGES.horizon,
        floorplan: IMAGES.floorplan,
      },
    ],
  },

  /* ---- Facilities ------------------------------------------------------- */
  facilities: {
    eyebrow: 'Lingkungan & Fasilitas',
    title: 'Dirancang untuk Keseharian yang Mudah',
    text: 'Setiap kawasan Kanso berpusat pada koridor hijau yang nyaman dijelajahi, keamanan pintar 24 jam, dan ruang sosial khusus penghuni.',
    tags: [
      { icon: 'directions_car', label: '5 Menit ke Tol' },
      { icon: 'park',           label: 'Taman Hijau' },
      { icon: 'shield_lock',    label: 'Keamanan Pintar' },
      { icon: 'pool',           label: 'Clubhouse' },
    ],
    highlight: { icon: 'eco', label: '40% Ruang Terbuka Hijau' },
    gallery: [
      { image: IMAGES.interior, alt: 'Ruang tamu modern yang terang oleh sinar matahari',
        title: 'Interior Penuh Cahaya', subtitle: 'Plafon 3,4 m & lantai kayu oak', icon: 'wb_sunny', tone: 'primary' },
      { image: IMAGES.park, alt: 'Taman residensial dan paviliun clubhouse',
        title: 'Central Park & Paviliun', subtitle: 'Jogging track & co-working lounge', icon: 'weekend', tone: 'secondary' },
    ],
  },

  /* ---- KPR calculator + banks + testimonials ---------------------------- */
  kpr: {
    eyebrow: 'Simulasi KPR Interaktif',
    title: 'Hitung Estimasi Cicilan Bulanan Anda',
    labels: {
      unit: 'Pilih Unit',
      customUnit: 'Harga Lainnya (Manual)',
      price: 'Harga Properti',
      dp: 'Uang Muka / DP (%)',
      tenor: 'Tenor Pinjaman',
      rate: 'Bunga Fixed (% per tahun)',
      monthly: 'Estimasi Cicilan per Bulan',
      loan: 'Pokok Pinjaman',
      dpAmount: 'Nominal DP',
      perMonth: '/ bln',
      years: 'Tahun',
      cta: 'Ajukan KPR',
      disclaimer: '*Simulasi bersifat estimasi. Persetujuan dan suku bunga final mengikuti kebijakan bank.',
    },
    defaultUnitId: 'atelier',   // pre-selected unit (id from properties.items) or 'custom'
    dpOptions: [
      { value: 0,  label: '0% (Promo DP Nol)' },
      { value: 10, label: '10% Standar' },
      { value: 20, label: '20% Pilihan Utama' },
      { value: 30, label: '30% Cicilan Ringan' },
    ],
    defaultDp: 10,
    tenorOptions: [5, 10, 15, 20, 25], // years (5–25)
    defaultTenor: 15,
    defaultRate: 4.25,
    bankTitle: 'Bank Rekanan KPR Resmi',
    banks: ['BCA', 'Mandiri', 'BRI', 'BNI', 'CIMB'],
    bankBadge: 'DP 0%',
  },

  testimonials: [
    { stars: 5, quote: 'Serah terima dua minggu lebih cepat dari jadwal, dan cahaya alami di ruang tamu kami tetap terang sampai sore tanpa membuat rumah panas.',
      name: 'Nadia & Dimas Pratama', unit: 'Unit Atelier 14' },
  ],

  /* ---- Bottom CTA ------------------------------------------------------- */
  consultation: {
    title: 'Merencanakan Rumah Impian?',
    text: 'Bicara langsung dengan penasihat kami untuk kunjungan lokasi privat, ketersediaan unit, dan pengecekan kelayakan KPR instan.',
    buttonLabel: 'Konsultasi via WhatsApp',
  },

  /* ---- Footer ----------------------------------------------------------- */
  footer: {
    about: 'Hunian modern penuh cahaya dengan kejelasan modular ala Swiss di seluruh Jakarta Selatan.',
    columns: [
      { title: 'Jelajahi', links: [
        { label: 'Properti',     href: '#properties' },
        { label: 'Fasilitas',    href: '#facilities' },
        { label: 'Simulasi KPR', href: '#kpr-simulation' },
      ] },
      { title: 'Perusahaan', links: [
        { label: 'Tentang Kami',      href: '#about' },
        { label: 'Jadwalkan Kunjungan', href: '#consultation' },
        { label: 'Bank Rekanan',      href: '#kpr-simulation' },
      ] },
    ],
    galleryTitle: 'Marketing Gallery',
    address: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
    hours: 'Setiap hari 09.00 – 17.00 WIB',
    copyright: '© 2026 Kanso Living Development. Hak cipta dilindungi.',
    tagline: 'Arsitektur Modular Swiss',
  },

  /* ---- UI strings (modal, menu, specs) ---------------------------------- */
  ui: {
    skipToContent: 'Lewati ke konten utama',
    openMenu: 'Buka menu navigasi',
    closeMenu: 'Tutup menu navigasi',
    startingFrom: 'Mulai dari',
    inspect: 'Lihat detail',
    close: 'Tutup',
    specs: { lt: 'Luas Tanah', lb: 'Luas Bangunan', kt: 'Kamar Tidur', km: 'Kamar Mandi', carport: 'Carport', certificate: 'Sertifikat' },
    specsShort: { lt: 'LT', lb: 'LB', kt: 'KT', km: 'KM' },
    carportUnit: 'Mobil',
    gallery: 'Galeri',
    floorplanLabel: 'Denah',
    modalWhatsApp: 'Tanya Unit Ini via WhatsApp',
    modalSimulate: 'Simulasikan KPR Unit Ini',
    price: 'Harga',
  },
};
