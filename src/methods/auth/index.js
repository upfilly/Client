/*
 * @file: index.js
 * @description: Auth functions here
 * @date: 10 June 2020
 * @author: Poonam
 * */


export const User = (store) => {
    return store.getState().user;
};

/******** Routing authentication middleware ***********/
export const Auth = (store) => {
    // return false;
    return User(store).loggedIn;
};


/******** Resolve active tenant from browser host ***********/
export const getTenantDomain = () => {
    if (typeof window === 'undefined') return '';
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.localhost')) {
        return host.replace('.localhost', '');
    }
    const parts = host.split('.');
    if (parts.length > 2 && !['www', 'api', 'admin', 'app', 'cname'].includes(parts[0])) {
        return parts[0];
    }
    return '';
};

/******** Set Authorization token and tenant headers in axios ***********/
export const setAuthorizationToken = (axios) => {
    let token = localStorage.getItem("token")
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common.Authorization;
    }

    const tenantDomain = getTenantDomain();
    if (tenantDomain) {
        axios.defaults.headers.common['x-tenant-domain'] = tenantDomain;
    } else {
        delete axios.defaults.headers.common['x-tenant-domain'];
    }
};
