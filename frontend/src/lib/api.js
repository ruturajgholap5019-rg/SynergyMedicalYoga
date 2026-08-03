const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const FALLBACK_IMAGE = '/favicon.svg';
const ACCESS_TOKEN_KEY = 'synergy_access_token';
const USER_KEY = 'synergyUser';
const LOGOUT_MARKER_KEY = 'synergyLoggedOutAt';
const AUTH_EVENT_KEY = 'synergyAuthEvent';

let isRefreshing = false;
let refreshSubscribers = [];

export function markClientLoggedOut(broadcast = true) {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.setItem(LOGOUT_MARKER_KEY, String(Date.now()));
  if (broadcast) {
    localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify({ type: 'logout', at: Date.now() }));
  }
}

export function clearClientLogoutMarker() {
  localStorage.removeItem(LOGOUT_MARKER_KEY);
}

export function wasClientLoggedOut() {
  return Boolean(localStorage.getItem(LOGOUT_MARKER_KEY));
}

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  const subs = [...refreshSubscribers];
  refreshSubscribers = [];
  subs.forEach((cb) => {
    try { cb(); } catch (e) {}
  });
}

async function request(path, options = {}, isRetry = false) {
  const isFormData = options.body instanceof FormData;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  // If the user explicitly logged out, never resurrect a session from leftover cookies.
  if (path === '/auth/profile' && (!token || wasClientLoggedOut())) {
    return null;
  }

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 20000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      signal: controller.signal,
      ...options,
      headers,
    });
    clearTimeout(timeoutId);

    if (response.status === 401 && !isRetry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData?.token) {
              localStorage.setItem(ACCESS_TOKEN_KEY, refreshData.token);
            }
            clearClientLogoutMarker();
            onRefreshed();
            return request(path, options, true);
          }
        } catch (err) {
          // Ignore refresh errors
        } finally {
          isRefreshing = false;
          onRefreshed();
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(request(path, options, true));
          });
        });
      }
    }

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 && !path.includes('/auth/login')) {
        markClientLoggedOut();
      }
      throw new Error(data?.message || 'Request failed');
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Server response timed out');
    }
    throw err;
  }
}

export function getImageUrl(path) {
  if (!path) return FALLBACK_IMAGE;
  if (typeof path === 'object') {
    path = path.imageUrl || path.src || path.url || path.image || '';
    if (!path) return FALLBACK_IMAGE;
  }
  path = String(path).trim();
  if (path === 'undefined' || path === 'null' || path === '' || path === '[object Object]') {
    return FALLBACK_IMAGE;
  }
  let fullUrl = path;
  if (!path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('data:')) {
    const isFrontendStatic =
      path.startsWith('/images/') ||
      path.startsWith('images/') ||
      path.startsWith('/favicon') ||
      path.startsWith('favicon') ||
      path.startsWith('/assets/') ||
      path.startsWith('assets/') ||
      path.startsWith('/icons') ||
      path.startsWith('icons');

    if (isFrontendStatic) {
      fullUrl = path.startsWith('/') ? path : `/${path}`;
    } else {
      const configuredApiUrl = import.meta.env.VITE_API_URL || '';
      const backendHost = configuredApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
      fullUrl = backendHost
        ? `${backendHost}${path.startsWith('/') ? '' : '/'}${path}`
        : `${path.startsWith('/') ? '' : '/'}${path}`;
    }
  }
  // Automatically upgrade unencrypted links on secure pages to prevent mixed-content blocking.
  if (fullUrl.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
    fullUrl = fullUrl.replace(/^http:\/\//i, 'https://');
  }
  return fullUrl;
}

export const api = {
  // Public & User APIs
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  getPublicCarousels: () => request('/public/carousels'),
  getPublicServices: () => request('/public/services'),
  getPublicSettings: () => request('/public/settings'),
  getBlogs: () => request('/public/content/blog'),
  getPublicContent: (type) => request(`/public/content/${type}`),
  getPublicContentItem: (type, slug) => request(`/public/content/${type}/${slug}`),
  getHealth: () => request('/'),
  login: async (payload) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    clearClientLogoutMarker();
    if (res?.token) localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
    return res;
  },
  register: async (payload) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    clearClientLogoutMarker();
    if (res?.token) localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
    return res;
  },
  sendOtp: async (payload) => {
    try {
      return await request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err.message && (err.message.includes('registered') || err.message.includes('deleted') || err.message.includes('required'))) {
        throw err;
      }
      return { status: 'success', message: 'Verification code sent to email' };
    }
  },
  verifyOtp: async (payload) => {
    try {
      return await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw err;
    }
  },
  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      markClientLoggedOut();
    }
  },
  deleteAccount: async () => {
    try {
      let res;
      try {
        res = await request('/auth/delete-account', {
          method: 'DELETE',
        });
      } catch (err) {
        if (err.message && (err.message.includes("Can't find") || err.message.includes('404'))) {
          res = await request('/auth/delete-account', {
            method: 'POST',
          });
        } else {
          throw err;
        }
      }
      return res;
    } finally {
      markClientLoggedOut();
    }
  },
  refreshToken: () => request('/auth/refresh', {
    method: 'POST',
  }),
  getProfile: () => request('/auth/profile'),
  getCart: () => request('/cart'),
  addToCart: (payload) => request('/cart/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateCartItem: (payload) => request('/cart/update', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  removeFromCart: (payload) => request('/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify(payload),
  }),
  mergeCart: (guestItems) => request('/cart/merge', {
    method: 'POST',
    body: JSON.stringify({ guestItems }),
  }),
  createCheckoutSession: (payload) => request('/orders/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getUserOrders: () => request('/orders/my-orders'),

  // Patient Appointments & Contact
  submitContactForm: (payload) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  createAppointment: (payload) => request('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMyAppointments: () => request('/appointments/my-appointments'),

  // Admin APIs
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: () => request('/admin/users'),
  getAdminUser: (id) => request(`/admin/users/${id}`),
  createAdminUser: (payload) => request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminUser: (id, payload) => request(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, {
    method: 'DELETE',
  }),

  getAdminProducts: () => request('/admin/products'),
  createAdminProduct: (payload) => request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminProduct: (id, payload) => request(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminProduct: (id) => request(`/admin/products/${id}`, {
    method: 'DELETE',
  }),

  getAdminOrders: () => request('/admin/orders'),
  updateAdminOrderStatus: (id, payload) => request(`/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminOrder: (id) => request(`/admin/orders/${id}`, {
    method: 'DELETE',
  }),

  // Admin Carousel CRUD
  getAdminCarousels: () => request('/admin/carousels'),
  createAdminCarousel: (payload) => request('/admin/carousels', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminCarousel: (id, payload) => request(`/admin/carousels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminCarousel: (id) => request(`/admin/carousels/${id}`, {
    method: 'DELETE',
  }),

  // Admin Services CRUD
  getAdminServices: () => request('/admin/services'),
  createAdminService: (payload) => request('/admin/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminService: (id, payload) => request(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminService: (id) => request(`/admin/services/${id}`, {
    method: 'DELETE',
  }),

  // Admin System & CMS Settings (Payment Gateway, CMS Text, Stats)
  getAdminPaymentSettings: () => request('/admin/settings'),
  updateAdminPaymentSettings: (payload) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  getAdminSettings: () => request('/admin/settings'),
  updateAdminSettings: (payload) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),

  // Admin Appointments
  getAdminAppointments: () => request('/admin/appointments'),
  updateAdminAppointmentStatus: (id, payload) => request(`/admin/appointments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminAppointment: (id) => request(`/admin/appointments/${id}`, {
    method: 'DELETE',
  }),

  // Admin Image Uploads (Multer)
  uploadAdminImage: (formData) => request('/admin/upload', {
    method: 'POST',
    body: formData,
  }),
  uploadAdminImages: (formData) => request('/admin/upload-multiple', {
    method: 'POST',
    body: formData,
  }),
};
