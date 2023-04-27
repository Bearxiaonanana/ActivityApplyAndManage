import Cookies from 'js-cookie'

const TokenKey = 'User-Token'

export function getToken() {
  return Cookies.get('User-Token')
}

export function setToken(token) {
  return Cookies.set('User-Token', token, { expires: 7, path: '' })
}

export function removeToken() {
  return Cookies.remove('User-Token')
}
