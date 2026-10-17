import { post } from './request'
export const wxLogin = (code) => post('/mini/auth/login', { code })
