
const TokenKey = 'Admin-Token'

export function getToken () {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

// export function setToken(token) {
//   return Cookies.set(TokenKey, token, { expires: 7 })
// }

export function removeToken () {
  // return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(TokenKey)
}
export function setToken (token) {
  return sessionStorage.setItem(TokenKey, token)
}
