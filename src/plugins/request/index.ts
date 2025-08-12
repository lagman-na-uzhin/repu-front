import axios from 'axios'

export const axiosIns = axios.create({
  baseURL: 'http://localhost:3000',
})

axiosIns.interceptors.request.use(config => {
  config.withCredentials = true

  return config
},
error => {
  return Promise.reject(error)
})
