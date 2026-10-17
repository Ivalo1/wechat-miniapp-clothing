import { get, post } from './request'
export const getMemberInfo = () => get('/mini/member/info')
export const signIn = () => post('/mini/member/sign-in')
