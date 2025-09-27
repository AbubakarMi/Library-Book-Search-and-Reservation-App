/**
 * Performance optimization configurations for Adustech Library
 */

// Image optimization settings
export const IMAGE_CONFIG = {
  quality: 80,
  formats: ['webp', 'jpeg'],
  sizes: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  domains: ['i.pravatar.cc', 'images.unsplash.com', 'firebasestorage.googleapis.com'],
};

// Cache configurations
export const CACHE_CONFIG = {
  // Static assets cache duration (1 year)
  STATIC_ASSETS: 31536000,
  // API responses cache duration (5 minutes)
  API_RESPONSES: 300,
  // User data cache duration (1 hour)
  USER_DATA: 3600,
  // Search results cache duration (15 minutes)
  SEARCH_RESULTS: 900,
};

// Lazy loading configurations
export const LAZY_LOAD_CONFIG = {
  rootMargin: '50px',
  threshold: 0.1,
  // Components to lazy load
  COMPONENTS: [
    'AdminReportDashboard',
    'ExportReport',
    'ReportGenerator',
    'UserManagement',
    'BookManagement',
  ],
};

// Bundle splitting configuration
export const BUNDLE_CONFIG = {
  // Vendor libraries to split
  vendors: ['react', 'react-dom', 'next'],
  // Common chunks
  commons: ['@/components/ui', '@/lib/utils'],
  // Async chunks
  async: ['charts', 'pdf-generation', 'excel-export'],
};

// Network optimization
export const NETWORK_CONFIG = {
  // Enable request deduplication
  deduplication: true,
  // Request timeout (30 seconds)
  timeout: 30000,
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential',
  },
  // Compression
  compression: {
    gzip: true,
    brotli: true,
    threshold: 1024, // Only compress files larger than 1KB
  },
};

// Database optimization
export const DB_CONFIG = {
  // Firestore pagination
  pageSize: 20,
  // Index fields for common queries
  indexedFields: [
    'email',
    'username',
    'registrationNumber',
    'role',
    'department',
    'createdAt',
    'status',
  ],
  // Cache Firestore queries
  enablePersistence: true,
  // Offline support
  enableOffline: true,
};

// Memory optimization
export const MEMORY_CONFIG = {
  // Maximum number of cached items
  maxCacheSize: 100,
  // Clean up interval (5 minutes)
  cleanupInterval: 300000,
  // Weak references for large objects
  useWeakRefs: true,
  // Virtual scrolling threshold
  virtualScrollThreshold: 100,
};

// Performance monitoring
export const MONITORING_CONFIG = {
  // Enable performance monitoring
  enabled: process.env.NODE_ENV === 'production',
  // Metrics to track
  metrics: [
    'FCP', // First Contentful Paint
    'LCP', // Largest Contentful Paint
    'FID', // First Input Delay
    'CLS', // Cumulative Layout Shift
    'TTFB', // Time to First Byte
  ],
  // Sampling rate (10% in production)
  sampleRate: 0.1,
  // Report to analytics
  reportToAnalytics: true,
};

// Code splitting routes
export const ROUTE_SPLITTING = {
  // Routes to pre-load
  preload: ['/dashboard', '/login', '/signup'],
  // Routes to lazy load
  lazy: [
    '/dashboard/admin/reports',
    '/dashboard/admin/users',
    '/dashboard/admin/books',
    '/support',
    '/settings',
  ],
  // Route-based code splitting
  chunks: {
    auth: ['/login', '/signup', '/forgot-password'],
    dashboard: ['/dashboard'],
    admin: ['/dashboard/admin'],
    user: ['/dashboard/user'],
    public: ['/', '/about', '/contact'],
  },
};

// Service Worker optimization
export const SW_CONFIG = {
  // Cache strategies
  strategies: {
    pages: 'NetworkFirst',
    assets: 'CacheFirst',
    api: 'NetworkFirst',
    images: 'CacheFirst',
  },
  // Cache names
  cacheNames: {
    pages: 'adustech-pages-v1',
    assets: 'adustech-assets-v1',
    api: 'adustech-api-v1',
    images: 'adustech-images-v1',
  },
  // Precache files
  precache: [
    '/',
    '/dashboard',
    '/login',
    '/manifest.json',
    '/offline',
  ],
};

// Bundle analyzer configuration
export const BUNDLE_ANALYZER_CONFIG = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
};

// Performance budgets
export const PERFORMANCE_BUDGETS = {
  // Initial bundle size (250KB gzipped)
  initialBundle: 250 * 1024,
  // Route chunks (150KB gzipped)
  routeChunk: 150 * 1024,
  // Total JavaScript (500KB gzipped)
  totalJS: 500 * 1024,
  // Total CSS (50KB gzipped)
  totalCSS: 50 * 1024,
  // Images per page (1MB)
  images: 1024 * 1024,
  // Fonts (100KB)
  fonts: 100 * 1024,
};

// Tree shaking optimization
export const TREE_SHAKING_CONFIG = {
  // Enable tree shaking
  enabled: true,
  // Mark side effects
  sideEffects: false,
  // Unused exports removal
  removeUnusedExports: true,
  // Dead code elimination
  deadCodeElimination: true,
  // Module concatenation
  concatenateModules: true,
};