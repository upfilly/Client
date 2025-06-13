/*
 * @file: index.js
 * @description: It Contain rest functions for api call .
 * @author: Poonam
 */

import axios from 'axios';
import querystring from 'querystring';
import { setAuthorizationToken } from '../auth';
import {  toast } from 'react-toastify';
import loader from '../loader';
import environment from '../../environment';
import methodModel from '../methods';


var config = {
    headers: { 'Content-Type': 'application/json' },
};

var baseUrl = environment.api


const handleError = (err, hideError) => {
    let message = ''
    if (err) {
        if (err && err.error && err.error.code == 401) {
            // localStorage.removeItem("persist:admin-app")
            // localStorage.removeItem("token")
            localStorage.clear()
            methodModel.route('/login')
        }
        message = err && err.error && err.error.message
        if (!message) message = err.message
        // if (!message) message = 'Server Error'
    }
    if (!hideError && err && err.error && err.error.code != 401) toast.error(message);
}

class ApiClient {
    static post(url1, params, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1

        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .post(url, JSON.stringify(params), config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill({ ...eres.data, success: false });
                    } else {
                        toast.error('Network Error')
                        reject(error);
                    }
                });
        });
    }

    static put(url1, params, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .put(url, JSON.stringify(params), config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        toast.error('Network Error')
                        reject(error);
                    }
                });
        });
    }

    static get(url1, params = {}, base = '', hidError = '') {

        let url = baseUrl + url1
        if (base) url = base + url1

        let query = querystring.stringify(params);
        url = query ? `${url}?${query}` : url;
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .get(url, config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data, hidError)
                        fulfill({ ...eres.data, success: false });
                    } else {
                        // localStorage.clear()
                        toast.error('Network Error')
                        reject(error);
                    }
                });
        });
    }

    static delete(url1, params = {}, base = '') {
        let url = baseUrl + url1
        if (base) url = base + url1

        let query = querystring.stringify(params);
        url = query ? `${url}?${query}` : url;
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            axios
                .delete(url, config)
                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        toast.error('Network Error')
                        reject(error);
                    }
                });
        });
    }

    static allApi(url, params, method = 'get') {
        if (method == 'get') {
            return this.get(url, params)
        } else if (method == 'put') {
            return this.put(url, params)
        } if (method == 'post') {
            return this.post(url, params)
        }
    }

    /*************** Form-Data Method ***********/
    static postFormData(url, params) {
        url = baseUrl + url
        setAuthorizationToken(axios);
        return new Promise(function (fulfill, reject) {
            var body = new FormData();
            let oArr = Object.keys(params)
            oArr.map(itm => {
                body.append(itm, params[itm]);
            })

            axios
                .postForm(url, body, {headers:{ 'Content-Type': 'multipart/form-data' }})

                .then(function (response) {
                    fulfill(response && response.data);
                })
                .catch(function (error) {
                    loader(false)
                    if (error && error.response) {
                        let eres = error.response;
                        handleError(eres.data)
                        fulfill(eres.data);
                    } else {
                        toast.error('Network Error')
                        reject(error);
                    }
                });
        });
    }

     static async multiImageUpload (url, params) {
        url = baseUrl + url
        setAuthorizationToken(axios);
        var body = new FormData();
            let oArr = Object.keys(params)
            oArr.map(itm => {
                body.append(itm, params[itm]);
            })

          return await axios
                .post(url, body, config)

                .then(function (response) {
                    return response && response.data
                })
                .catch(function (error) {
                    return error && error.response 
                });
    }

}

export default ApiClient;
