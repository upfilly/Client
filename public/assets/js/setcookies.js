// function setCookie(name, value, days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     const expires = "expires=" + date.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=/"
// }

// function getCookie(name) {
//     const decodedCookie = decodeURIComponent(document.cookie);
//     const cookies = decodedCookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i].trim();
//         if (cookie.indexOf(name + "=") == 0) {
//             return cookie.substring(name.length + 1, cookie.length)
//         }
//     }
//     return "";
// }

// setCookie("username", "JohnDoe", 30);

// let username = getCookie("username");
// console.log("Username from cookie: ", username);

// Function to extract all query parameters from the URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    let paramObject = {};
    for (let [key, value] of params.entries()) {
        paramObject[key] = value;
    }
    return paramObject;
}

// Function to set a cookie with a specified name, value, and expiration time (in days)
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set cookie with path /
}

// Function to store all URL parameters in cookies
function storeParamsInCookies() {
    const params = getUrlParams();
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            // Store each URL parameter as a cookie
            setCookie(key, params[key], 30);  // You can adjust the expiration as needed
        }
    }
}

storeParamsInCookies();

