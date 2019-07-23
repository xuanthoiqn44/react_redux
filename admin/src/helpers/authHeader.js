export function authHeader() {
    let token = (typeof localStorage.token !== 'undefined')?localStorage.token:'';
    return (token)?{ 'Authorization': 'Bearer ' + token }:{};
}