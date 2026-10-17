import { get, post, del } from './request'
export const getCartList = () => get('/mini/cart/list')
export const addToCart = (data) => post('/mini/cart/add', data)
export const updateCart = (data) => post('/mini/cart/update', data)
export const removeFromCart = (id) => del(`/mini/cart/${id}`)
