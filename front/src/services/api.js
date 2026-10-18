export const BASE_URL = 'http://localhost:4000/api';

export const API_ENDPOINTS = {
  login: `${BASE_URL}/auth/login`,         
  register: `${BASE_URL}/auth/register`,  
  logout: `${BASE_URL}/auth/logout`,       
  me: `${BASE_URL}/auth/me`,               
  posts: `${BASE_URL}/posts`,              
};