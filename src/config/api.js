// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/login`,
        LOGOUT: `${API_BASE_URL}/logout`,
        PROFILE: `${API_BASE_URL}/profile`,
        CHANGE_PASSWORD: `${API_BASE_URL}/change-password`,
        RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
    },
    // User endpoints
    USERS: {
        LIST: `${API_BASE_URL}/users`,
        DELETE: (id) => `${API_BASE_URL}/users/${id}`,
    },
    // Product endpoints
    PRODUCTS: {
        LIST: `${API_BASE_URL}/products`,
        DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
        CREATE: `${API_BASE_URL}/products/add`,
        UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
        DELETE: (id) => `${API_BASE_URL}/products/${id}`,
    },
    // Post endpoints
    POSTS: {
        LIST: `${API_BASE_URL}/posts`,
        DETAIL: (id) => `${API_BASE_URL}/posts/${id}`,
        CREATE: `${API_BASE_URL}/posts/add`,
        UPDATE: (id) => `${API_BASE_URL}/posts/${id}`,
        DELETE: (id) => `${API_BASE_URL}/posts/${id}`,
    },
    // Notification endpoints
    NOTIFICATIONS: {
        ADD: `${API_BASE_URL}/notifications/add`,
        GET_BY_USER: (userId) => `${API_BASE_URL}/notifications/user/${userId}`,
        MARK_AS_READ: (id) => `${API_BASE_URL}/notifications/read/${id}`,
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

// Auth API Services
export const authAPI = {
    // Login
    login: async (credentials) => {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    // Logout
    logout: async () => {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Get Profile
    getProfile: async () => {
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Update Profile
    updateProfile: async (profileData) => {
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(profileData)
        });
        return handleResponse(response);
    },

    // Change Password
    changePassword: async (passwordData) => {
        const response = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(passwordData)
        });
        return handleResponse(response);
    },

    // Reset Password
    resetPassword: async (email) => {
        const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        });
        return handleResponse(response);
    }
};

// User API Services
export const userAPI = {
    // Get all users
    getAllUsers: async () => {
        const response = await fetch(API_ENDPOINTS.USERS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Delete user
    deleteUser: async (id) => {
        const response = await fetch(API_ENDPOINTS.USERS.DELETE(id), {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
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

// Post API Services
export const postAPI = {
    // Get all posts
    getAllPosts: async () => {
        const response = await fetch(API_ENDPOINTS.POSTS.LIST, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Get post by ID
    getPostById: async (id) => {
        const response = await fetch(API_ENDPOINTS.POSTS.DETAIL(id), {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Create new post
    createPost: async (postData) => {
        const response = await fetch(API_ENDPOINTS.POSTS.CREATE, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        });
        return handleResponse(response);
    },

    // Update post
    updatePost: async (id, postData) => {
        const response = await fetch(API_ENDPOINTS.POSTS.UPDATE(id), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        });
        return handleResponse(response);
    },

    // Delete post
    deletePost: async (id) => {
        const response = await fetch(API_ENDPOINTS.POSTS.DELETE(id), {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};

// Chat API Services
export const chatAPI = {
    // Create new chat
    createChat: async (chatData) => {
        const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(chatData)
        });
        return handleResponse(response);
    },

    // Send message
    sendMessage: async (messageData) => {
        const response = await fetch(API_ENDPOINTS.CHATS.SEND_MESSAGE, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(messageData)
        });
        return handleResponse(response);
    },

    // Get messages for a chat
    getMessages: async (chatId) => {
        const response = await fetch(API_ENDPOINTS.CHATS.GET_MESSAGES(chatId), {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Get all chats for a user
    getUserChats: async (userId) => {
        const response = await fetch(API_ENDPOINTS.CHATS.GET_USER_CHATS(userId), {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Mark messages as read
    markAsRead: async (readData) => {
        const response = await fetch(API_ENDPOINTS.CHATS.MARK_AS_READ, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(readData)
        });
        return handleResponse(response);
    }
};

// Notification API Services
export const notificationAPI = {
    // Add notification
    addNotification: async (notificationData) => {
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.ADD, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(notificationData)
        });
        return handleResponse(response);
    },

    // Get notifications by user
    getUserNotifications: async (userId) => {
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.GET_BY_USER(userId), {
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId), {
            method: 'PUT',
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
    authAPI,
    userAPI,
    productAPI,
    postAPI,
    chatAPI,
    notificationAPI
};

export default apiConfig; 