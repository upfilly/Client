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

/******** Build white-label tenant subdomain URL ***********/
export const buildTenantSubdomainUrl = (subdomain, path = '/white-label-dashboard', options = {}) => {
    if (typeof window === 'undefined') return path;
    let cleanSubdomain = (subdomain || '').trim().toLowerCase();
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'upfilly.com';
    cleanSubdomain = cleanSubdomain.replace(new RegExp(`\\.?${rootDomain}$`, 'i'), '').replace(/\.?localhost$/i, '');
    if (!cleanSubdomain) return path;

    const host = window.location.hostname.toLowerCase();
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol;

    let targetBase = '';
    if (host === 'localhost' || host.endsWith('.localhost')) {
        targetBase = `${protocol}//${cleanSubdomain}.localhost${port}`;
    } else {
        targetBase = `${protocol}//${cleanSubdomain}.${rootDomain}`;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = new URL(cleanPath, targetBase);

    if (options.token) {
        targetUrl.searchParams.set('auth_token', options.token);
    }
    if (options.user) {
        targetUrl.searchParams.set('auth_user', typeof options.user === 'string' ? options.user : JSON.stringify(options.user));
    }

    return targetUrl.toString();
};

/******** Sync token and user across subdomains from URL handoff ***********/
export const syncTenantSessionFromUrl = () => {
    if (typeof window === 'undefined') return null;

    const search = new URLSearchParams(window.location.search);
    const urlToken = search.get('auth_token');
    const urlUser = search.get('auth_user');

    let synced = false;
    let user = null;

    if (urlToken) {
        localStorage.setItem('token', urlToken);
        synced = true;
    }

    if (urlUser) {
        try {
            user = JSON.parse(decodeURIComponent(urlUser));
            localStorage.setItem('crendentials', JSON.stringify(user));
            synced = true;
        } catch (e) {
            console.error('Failed to parse auth_user from URL', e);
        }
    }

    if (synced) {
        search.delete('auth_token');
        search.delete('auth_user');
        const cleanQuery = search.toString();
        const cleanUrl = window.location.pathname + (cleanQuery ? `?${cleanQuery}` : '') + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    return { token: urlToken, user };
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
