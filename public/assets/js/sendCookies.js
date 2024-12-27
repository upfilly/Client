// var sCookieName = "source";

// var _getCookie = function (sCookieName) {
//     sCookieName += "=";
//     var aCookies = document.cookie.split(";");
//     for (var i = 0; i < aCookies.length; i++) {
//         while (aCookies[i].charAt(0) == " ") aCookies[i] = aCookies[i].substring(1);
//         if (aCookies[i].indexOf(sCookieName) != -1) {
//             return aCookies[i].substring(sCookieName.length, aCookies[i].length);
//         }
//     }
// };

// var sChannel = _getCookie(sCookieName) ? _getCookie(sCookieName) : "aw";

// var saleData = {
//     amount: parseFloat(fTotalAmount).toFixed(2),
//     channel: sChannel,
//     currency: sCurrency,
//     orderRef: sOrderReference,
//     parts: "DEFAULT:" + parseFloat(fTotalAmount).toFixed(2),
//     test: "0",
//     voucher: sVoucherCode
// };

// var xhr = new XMLHttpRequest();
// xhr.open("POST", "https://api.upfilly.com/affiliatelink", true);

// xhr.setRequestHeader("Content-Type", "application/json");

// xhr.onload = function () {
//     if (xhr.status >= 200 && xhr.status < 300) {
//         console.log("Sale data successfully sent.");
//     } else {
//         console.error("Error sending sale data: " + xhr.statusText);
//     }
// };

// xhr.send(JSON.stringify(saleData));

// Function to get the value of a specific cookie
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") == 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return "";
}

function sendCookiesToAPI() {
    const cookies = document.cookie;
    
    let cookieObj = {};
    cookies.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=');
        cookieObj[name.trim()] = value;
    });

    fetch('https://your-api-endpoint.com/api/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cookieObj)
    })
    .then(response => response.json())
    .then(data => {
        console.log('API response:', data);
    })
    .catch(error => {
        console.error('Error sending data to API:', error);
    });
}

// Execute the function to send cookies to the API
sendCookiesToAPI();

