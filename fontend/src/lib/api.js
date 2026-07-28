const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.map((cb) => cb());
  refreshSubscribers = [];
}

async function request(path, options = {}, isRetry = false) {
  const isFormData = options.body instanceof FormData;
  const token = localStorage.getItem('synergy_access_token');
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });
  if (response.status === 401 && !isRetry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        isRefreshing = false;
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData?.token) {
            localStorage.setItem('synergy_access_token', refreshData.token);
          }
          onRefreshed();
          return request(path, options, true);
        }
      } catch (err) {
        isRefreshing = false;
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
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const backendHost = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
  return `${backendHost}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const api = {
  // Public & User APIs
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  getPublicCarousels: () => request('/public/carousels'),
  getPublicServices: () => request('/public/services'),
  getPublicSettings: () => request('/public/settings'),
  getHealth: () => request('/'),
  login: async (payload) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.token) localStorage.setItem('synergy_access_token', res.token);
    return res;
  },
  register: async (payload) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.token) localStorage.setItem('synergy_access_token', res.token);
    return res;
  },
  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('synergy_access_token');
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

  // Patient Appointments
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
