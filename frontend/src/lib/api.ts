const BASE_URL = 'http://localhost:8080/api';

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'API Request failed');
    }
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'API Request failed');
    }
    return res.json();
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'API Request failed');
    }
    return res.json();
  },
};
