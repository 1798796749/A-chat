import axios from 'axios'
import { useStore } from '../../store/index'

function token() {
  return useStore().token
}
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
})
// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (token()) {
      config.headers['Authorization'] = 'Bearer ' + token()
    }
    // console.log(config)
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)
export default service
