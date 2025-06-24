const API_BASE_URL = 'http://localhost:3001/api/';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/login`,
        LOGOUT: `${API_BASE_URL}/logout`,
        PROFILE: `${API_BASE_URL}/profile`,
        CHANGE_PASSWORD: `${API_BASE_URL}/change-password`,
        RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/users`,
        DELETE: (id) => `${API_BASE_URL}/users/${id}`,
    },
    PRODUCTS: {
        LIST: `${API_BASE_URL}/products`,
        DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
        CREATE: `${API_BASE_URL}/products/add`,
        UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
        DELETE: (id) => `${API_BASE_URL}/products/${id}`,
    },
    POSTS: {
        LIST: `${API_BASE_URL}/posts`,
        DETAIL: (id) => `${API_BASE_URL}/posts/${id}`,
        CREATE: `${API_BASE_URL}/posts/add`,
        UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
        DELETE: (id) => `${API_BASE_URL}/posts/${id}`,
    },
    ORDERS: {
        LIST: `${API_BASE_URL}/orders`,
        DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
        CREATE: `${API_BASE_URL}/orders/add`,
        UPDATE_STATUS: (id) => `${API_BASE_URL}/orders/${id}/status`,
        DELETE: (id) => `${API_BASE_URL}/orders/${id}`,
        GET_BY_USER: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
        STATS: `${API_BASE_URL}/orders/stats`,
    },
    NOTIFICATIONS: {
        ADD: `${API_BASE_URL}/notifications/add`,
        GET_BY_USER: (userId) => `${API_BASE_URL}/notifications/user/${userId}`,
        MARK_AS_READ: (id) => `${API_BASE_URL}/notifications/read/${id}`,
    },
    CHATS: {
        CREATE: `${API_BASE_URL}/chats/create`,
        SEND_MESSAGE: `${API_BASE_URL}/chats/message`,
        GET_MESSAGES: (chatId) => `${API_BASE_URL}/chats/${chatId}`,
        GET_USER_CHATS: (userId) => `${API_BASE_URL}/chats/user/${userId}`,
        MARK_AS_READ: `${API_BASE_URL}/chats/read`,
    }
};

export const getHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

export const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    const result = await response.json();
    return result?.data ?? result;
};

// === AUTH ===
export const authAPI = {
    login: async (credentials) => {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(credentials)
        });
        return handleResponse(res);
    },
    logout: async () => {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST', headers: getHeaders()
        });
        return handleResponse(res);
    },
    getProfile: async () => {
        const res = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    updateProfile: async (data) => {
        const res = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    changePassword: async (data) => {
        const res = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
            method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    resetPassword: async (email) => {
        const res = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify({ email })
        });
        return handleResponse(res);
    }
};

// === USERS ===
export const userAPI = {
    getAllUsers: async () => {
        const res = await fetch(API_ENDPOINTS.USERS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    deleteUser: async (id) => {
        const res = await fetch(API_ENDPOINTS.USERS.DELETE(id), {
            method: 'DELETE', headers: getHeaders()
        });
        return handleResponse(res);
    }
};

// === PRODUCTS ===
export const productAPI = {
    getAllProducts: async () => {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    getProductById: async (id) => {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.DETAIL(id), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    createProduct: async (data) => {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.CREATE, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    updateProduct: async (id, data) => {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
            method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    deleteProduct: async (id) => {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.DELETE(id), {
            method: 'DELETE', headers: getHeaders()
        });
        return handleResponse(res);
    }
};

// === POSTS ===
export const postAPI = {
    getAllPosts: async () => {
        const res = await fetch(API_ENDPOINTS.POSTS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    getPostById: async (id) => {
        const res = await fetch(API_ENDPOINTS.POSTS.DETAIL(id), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    createPost: async (data) => {
        const res = await fetch(API_ENDPOINTS.POSTS.CREATE, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    updatePost: async (id, data) => {
        const res = await fetch(API_ENDPOINTS.POSTS.UPDATE(id), {
            method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    deletePost: async (id) => {
        const res = await fetch(API_ENDPOINTS.POSTS.DELETE(id), {
            method: 'DELETE', headers: getHeaders()
        });
        return handleResponse(res);
    }
};

// === ORDERS ===
export const orderAPI = {
    getAllOrders: async () => {
        const res = await fetch(API_ENDPOINTS.ORDERS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    getOrderById: async (id) => {
        const res = await fetch(API_ENDPOINTS.ORDERS.DETAIL(id), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    createOrder: async (data) => {
        const res = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    updateOrderStatus: async (id, status) => {
        const res = await fetch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), {
            method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status })
        });
        return handleResponse(res);
    },
    deleteOrder: async (id) => {
        const res = await fetch(API_ENDPOINTS.ORDERS.DELETE(id), {
            method: 'DELETE', headers: getHeaders()
        });
        return handleResponse(res);
    },
    getOrdersByUserId: async (userId) => {
        const res = await fetch(API_ENDPOINTS.ORDERS.GET_BY_USER(userId), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    getOrderStats: async () => {
        const res = await fetch(API_ENDPOINTS.ORDERS.STATS, {
            headers: getHeaders()
        });
        return handleResponse(res);
    }
};

// === CHATS ===
export const chatAPI = {
    createChat: async (data) => {
        const res = await fetch(API_ENDPOINTS.CHATS.CREATE, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    sendMessage: async (data) => {
        const res = await fetch(API_ENDPOINTS.CHATS.SEND_MESSAGE, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    getMessages: async (chatId) => {
        const res = await fetch(API_ENDPOINTS.CHATS.GET_MESSAGES(chatId), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    getUserChats: async (userId) => {
        const res = await fetch(API_ENDPOINTS.CHATS.GET_USER_CHATS(userId), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    markAsRead: async (data) => {
        const res = await fetch(API_ENDPOINTS.CHATS.MARK_AS_READ, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    }
};

// === NOTIFICATIONS ===
export const notificationAPI = {
    addNotification: async (data) => {
        const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.ADD, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    getUserNotifications: async (userId) => {
        const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.GET_BY_USER(userId), {
            headers: getHeaders()
        });
        return handleResponse(res);
    },
    markAsRead: async (id) => {
        const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id), {
            method: 'PUT', headers: getHeaders()
        });
        return handleResponse(res);
    }
};

const apiConfig = {
    API_BASE_URL,
    API_ENDPOINTS,
    getHeaders,
    handleResponse,
    authAPI,
    userAPI,
    productAPI,
    postAPI,
    orderAPI,
    chatAPI,
    notificationAPI
};

export default apiConfig;
