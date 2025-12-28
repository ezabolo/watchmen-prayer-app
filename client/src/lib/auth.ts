// Auth utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Set up axios interceptor to add auth token to requests
export const setupAuthInterceptor = () => {
  // This would be used if we had axios, but we're using fetch
  // Just keeping this for reference
};