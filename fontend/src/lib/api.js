const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  getHealth: () => request('/'),
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  logout: () => request('/auth/logout', {
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
  createCheckoutSession: (payload) => request('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
