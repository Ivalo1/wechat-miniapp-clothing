import { get } from './request'
export const getProductList = (params) => get('/mini/product/list', params)
export const getProductDetail = (id) => get(`/mini/product/${id}`)
