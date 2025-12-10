// src/api/api.js
import axios from 'axios'

export const api = axios.create({
  //Se você rodar no celular (Expo Go), troque localhost pelo IP da sua máquina na rede local, por exemplo: baseURL: 'http://192.168.0.105:3000'
  baseURL: 'http://localhost:3000', // backend NestJS
  timeout: 10000,
})

// Função auxiliar para extrair data da resposta do Axios
export const resolveApiResponse = async (axiosPromise) => {
  const response = await axiosPromise
  return response.data
}

// ==================== GALPÕES ====================
export const galpoesAPI = {
  getAll: () => api.get('/galpoes'),
  getById: (id) => api.get(`/galpoes/${id}`),
  create: (data) => api.post('/galpoes', data),
  update: (id, data) => api.patch(`/galpoes/${id}`, data),
  delete: (id) => api.delete(`/galpoes/${id}`),
}

// ==================== GALINHAS ====================
export const galinhasAPI = {
  getAll: () => api.get('/galinhas'),
  getById: (id) => api.get(`/galinhas/${id}`),
  create: (data) => api.post('/galinhas', data),
  update: (id, data) => api.patch(`/galinhas/${id}`, data),
  delete: (id) => api.delete(`/galinhas/${id}`),
}

// ==================== NINHOS ====================
export const ninhosAPI = {
  getAll: () => api.get('/ninhos'),
  getById: (id) => api.get(`/ninhos/${id}`),
  create: (data) => api.post('/ninhos', data),
  update: (id, data) => api.patch(`/ninhos/${id}`, data),
  delete: (id) => api.delete(`/ninhos/${id}`),
}

// ==================== OVOS ====================
export const ovosAPI = {
  getAll: () => api.get('/ovos'),
  getById: (id) => api.get(`/ovos/${id}`),
  create: (data) => api.post('/ovos', data),
  update: (id, data) => api.patch(`/ovos/${id}`, data),
  delete: (id) => api.delete(`/ovos/${id}`),
}

// ==================== MEDIÇÕES AMBIENTE ====================
export const medicoesAPI = {
  getAll: () => api.get('/medicoes-ambiente'),
  getById: (id) => api.get(`/medicoes-ambiente/${id}`),
  create: (data) => api.post('/medicoes-ambiente', data),
  update: (id, data) => api.patch(`/medicoes-ambiente/${id}`, data),
  delete: (id) => api.delete(`/medicoes-ambiente/${id}`),
}

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
}
