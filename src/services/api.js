import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 1. Adjunta el Access Token JWT en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Si el token expira (401), intenta renovarlo automáticamente con el Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/usuarios/login') &&
      !originalRequest.url.includes('/usuarios/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post('http://localhost:8080/api/v1/usuarios/refresh', {
            refreshToken
          });
          localStorage.setItem('token', data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        } catch {
          // Si el refresh token también expiró, cierra la sesión
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('react_usuario_activo');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;