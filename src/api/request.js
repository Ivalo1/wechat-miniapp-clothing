import { storage } from '@/utils/storage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** 统一请求函数 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = storage.get('token')
    const header = { ...options.header }
    if (token) header['Authorization'] = `Bearer ${token}`

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        if (res.statusCode === 401) {
          storage.remove('token')
          storage.remove('userInfo')
          uni.navigateTo({ url: '/pages/login/index' })
          return reject(new Error('未登录'))
        }
        if (res.statusCode !== 200) {
          uni.showToast({ title: '服务器异常', icon: 'none' })
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        const body = res.data
        if (body.code === 0) {
          resolve(body.data)
        } else {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' })
          reject(new Error(body.message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const get = (url, params) => {
  let query = ''
  if (params) {
    const parts = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    if (parts.length) query = '?' + parts.join('&')
  }
  return request({ url: url + query, method: 'GET' })
}

export const post = (url, data) => request({ url, method: 'POST', data, header: { 'Content-Type': 'application/json' } })
export const put = (url, data) => request({ url, method: 'PUT', data, header: { 'Content-Type': 'application/json' } })
export const del = (url) => request({ url, method: 'DELETE' })

/** 文件上传 */
export const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const token = storage.get('token')
    uni.uploadFile({
      url: BASE_URL + '/mini/file/upload',
      filePath,
      name: 'file',
      header: token ? { 'Authorization': `Bearer ${token}` } : {},
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0) resolve(data.data)
        else {
          uni.showToast({ title: data.message || '上传失败', icon: 'none' })
          reject(new Error(data.message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default request
