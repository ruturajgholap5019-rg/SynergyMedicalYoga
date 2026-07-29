const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
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
  refreshSubscribers.map((cb) => cb());
  refreshSubscribers = [];
}

async function request(path, options = {}, isRetry = false) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (path === '/auth/profile' && (!token || wasClientLoggedOut())) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
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
            localStorage.setItem(ACCESS_TOKEN_KEY, refreshData.token);
          }
          clearClientLogoutMarker();
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
    if (response.status === 401 && !path.includes('/auth/login')) {
      markClientLoggedOut();
    }
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  login: async (payload) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.token) {
      clearClientLogoutMarker();
      localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
    }
    return res;
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
  getProfile: () => request('/auth/profile'),

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

  getAdminContentItems: () => request('/admin/content'),
  createAdminContentItem: (payload) => request('/admin/content', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateAdminContentItem: (id, payload) => request(`/admin/content/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deleteAdminContentItem: (id) => request(`/admin/content/${id}`, {
    method: 'DELETE',
  }),

  getAdminContactMessages: () => request('/admin/contact-messages'),
  updateAdminContactMessageStatus: (id, payload) => request(`/admin/contact-messages/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
};
