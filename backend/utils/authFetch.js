export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    const response = await fetch(url, options);
    if (response.status === 401) {
        localStorage.removeItem('token'); 
        window.location.href = '/';
    }
    return response.json();
};
