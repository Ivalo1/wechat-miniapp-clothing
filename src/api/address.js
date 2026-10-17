import { get, post, put, del } from './request'
export const getAddressList = () => get('/mini/address/list')
export const addAddress = (data) => post('/mini/address', data)
export const updateAddress = (id, data) => put(`/mini/address/${id}`, data)
export const deleteAddress = (id) => del(`/mini/address/${id}`)
