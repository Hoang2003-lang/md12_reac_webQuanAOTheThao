// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Product endpoints
    PRODUCTS: {
        LIST: `${API_BASE_URL}/products`,
        DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
        CREATE: `${API_BASE_URL}/products/add`,
        UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
        DELETE: (id) => `${API_BASE_URL}/products/${id}`,
    }
};

// API Headers
export const getHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// API Response Handler
export const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

// Product API Services
export const productAPI = {
    // Get all products
    getAllProducts: async () => {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Get product by ID
    getProductById: async (id) => {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.DETAIL(id), {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Create new product
    createProduct: async (productData) => {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.CREATE, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Update product
    updateProduct: async (id, productData) => {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.DELETE(id), {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};

const apiConfig = {
    API_BASE_URL,
    API_ENDPOINTS,
    getHeaders,
    handleResponse,
    productAPI
};

export default apiConfig; 