const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8080/api/v1';
  }
  // If loaded via local IP (192.168.x.x), use that hostname
  if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
    return `http://${hostname}:8080/api/v1`;
  }
  // Fallback for Vercel loading: point directly to local dev laptop IP on Wi-Fi
  return 'http://192.168.1.14:8080/api/v1';
};

const BASE_URL = getApiBaseUrl();

// Helper to retrieve JWT token and construct authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiService = {
  // --- AUTH ENDPOINTS ---
  
  async login(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || 'Authentication failed. Please check your credentials.');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('adminUser', data.username);
    return data;
  },

  async register(username, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || 'Registration failed.');
    }
    return response;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // --- PROPERTIES ENDPOINTS ---
  
  // Fetch properties with dynamic query filters and paging parameters (Public)
  async getProperties(filters = {}, page = 0, size = 10, sortBy = 'createdDate', direction = 'desc') {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('direction', direction);
    
    // Add filters if present
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.status) params.append('status', filters.status);
    if (filters.furnishingStatus) params.append('furnishingStatus', filters.furnishingStatus);
    
    const response = await fetch(`${BASE_URL}/properties?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    return response.json();
  },

  // Get details of a single property (Public)
  async getPropertyById(id) {
    const response = await fetch(`${BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error(`Property lookup failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new property listing (Admin - Secured)
  async createProperty(propertyData) {
    const response = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to create property listing');
    }
    return response.json();
  },

  // Update an existing property listing (Admin - Secured)
  async updateProperty(id, propertyData) {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update property listing');
    }
    return response.json();
  },

  // Delete a property listing (Admin - Secured)
  async deleteProperty(id) {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      throw new Error(`Failed to delete property: ${response.statusText}`);
    }
    return true;
  },

  // --- LEADS ENDPOINTS ---

  // Public lead capture hook (Public)
  async submitLead(leadData) {
    const response = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.errors ? Object.values(errData.errors).join(', ') : (errData.message || 'Failed to submit lead'));
    }
    return response.json();
  },

  // Fetch leads pipeline (Admin - Secured)
  async getLeads(filters = {}, page = 0, size = 10, sortBy = 'createdDate', direction = 'desc') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('direction', direction);

    if (filters.status) params.append('status', filters.status);
    if (filters.preferredLocation) params.append('preferredLocation', filters.preferredLocation);

    const response = await fetch(`${BASE_URL}/leads?${params.toString()}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      throw new Error(`Failed to fetch leads: ${response.statusText}`);
    }
    return response.json();
  },

  // Update lead workflow status (Admin CRM - Secured)
  async updateLeadStatus(id, status) {
    const response = await fetch(`${BASE_URL}/leads/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      throw new Error(`Failed to update lead status: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a lead (Admin - Secured)
  async deleteLead(id) {
    const response = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please log in as an administrator.');
      }
      throw new Error(`Failed to delete lead: ${response.statusText}`);
    }
    return true;
  },

  // Fetch dashboard stats (Admin - Secured)
  async getStats() {
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }
    return response.json();
  },

  // Fetch all agents (Admin - Secured)
  async getAgents() {
    const response = await fetch(`${BASE_URL}/agents`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }
    return response.json();
  }
};
