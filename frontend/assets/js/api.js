
const API_BASE = 'http://127.0.0.1:8000/api/v1';

const apiClient = {
    async getCalculatorHistory() {
        return this._request(`${API_BASE}/calculator/history`);
    },

    async createCalculatorEntry(expression, result) {
        return this._request(`${API_BASE}/calculator/history`, {
            method: 'POST',
            body: { expression, result }
        });
    },

    async deleteCalculatorEntry(id) {
        return this._request(`${API_BASE}/calculator/history/${id}`, {
            method: 'DELETE'
        });
    },

    async clearCalculatorHistory() {
        return this._request(`${API_BASE}/calculator/history`, {
            method: 'DELETE'
        });
    },

    // GST Actions
    async getGstHistory() {
        return this._request(`${API_BASE}/gst/history`);
    },

    async createGstEntry(amount, gst_rate, gst_type, gst_amount, grand_total) {
        return this._request(`${API_BASE}/gst/history`, {
            method: 'POST',
            body: { 
                amount: parseFloat(amount), 
                gst_rate: parseFloat(gst_rate), 
                gst_type, 
                gst_amount: parseFloat(gst_amount), 
                grand_total: parseFloat(grand_total) 
            }
        });
    },

    async deleteGstEntry(id) {
        return this._request(`${API_BASE}/gst/history/${id}`, {
            method: 'DELETE'
        });
    },

    async clearGstHistory() {
        return this._request(`${API_BASE}/gst/history`, {
            method: 'DELETE'
        });
    },
    async getDashboardStats() {
        return this._request(`${API_BASE}/dashboard/stats`);
    },
    async _request(url, options = {}) {
        const headers = { 'Content-Type': 'application/json' };
        
        const config = {
            method: options.method || 'GET',
            headers: {
                ...headers,
                ...options.headers
            }
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || `HTTP API request failed with status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Fetch Error [${url}]:`, error);
            throw error;
        }
    }
};

window.apiClient = apiClient;
