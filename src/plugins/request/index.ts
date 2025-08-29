import axios from 'axios'

export const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosIns.interceptors.request.use(config => {
  config.withCredentials = true

  return config
},
error => {
  return Promise.reject(error)
})
