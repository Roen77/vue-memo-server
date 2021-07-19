// 쿠키에 토큰 저장
function saveAuthToCookie(value) {
  document.cookie = `memo_auth=${value}`;
}
// 쿠키에 사용자 정보 저장
function saveUserToCookie(value) {
  document.cookie = `memo_user=${value}`;
}
// 쿠키에 저장된 토근 정보 가져오기
function getAuthFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_auth\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}
// 쿠키에 저장된 사용자 정보 가져오기
function getUserFromCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)memo_user\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
}

function deleteCookie(value) {
  document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export {
  saveAuthToCookie,
  saveUserToCookie,
  getAuthFromCookie,
  getUserFromCookie,
  deleteCookie
}