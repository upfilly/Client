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
// function getUrlParams() {
//     const params = new URLSearchParams(window.location.search);
//     let paramObject = {};
//     for (let [key, value] of params.entries()) {
//         paramObject[key] = value;
//     }
//     return paramObject;
// }

// // Function to set a cookie with a specified name, value, and expiration time (in days)
// function setCookie(name, value, days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
//     const expires = "expires=" + date.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set cookie with path /
// }

// // Function to store all URL parameters in cookies
// function storeParamsInCookies() {
//     const params = getUrlParams();
//     for (let key in params) {
//         if (params.hasOwnProperty(key)) {
//             // Store each URL parameter as a cookie
//             setCookie(key, params[key], 30);  // You can adjust the expiration as needed
//         }
//     }
// }

// storeParamsInCookies();

window.onload = function () {
    const body = document.querySelector('body'); // Select the body element
    const titlesObject = {}; // Object to store titles as keys
    const valuesObject = {}; // Object to store values

    // Function to extract content and separate into titles and values
    const extractDivContents = () => {
        // Reset the objects to avoid duplication
        const divs = body.querySelectorAll('div'); // Get all div elements
        let title = '';  // Variable to store the current title
        divs.forEach((div, index) => {
            // Check if the div contains relevant content (e.g., contains text or images)
            if (div.querySelector('img') || div.querySelector('a') || div.innerText.trim() !== '') {
                cleanElement(div); // Clean the div from unwanted content

                const content = div.innerText.trim(); // Get clean text content from div
                
                // If content is available, assign it as title or value
                if (content) {
                    if (title === '') {
                        // This is the title (first div)
                        title = content;
                    } else {
                        // This is the corresponding value (second div)
                        titlesObject[title] = content;  // Store the title as a key
                        valuesObject[title] = content;  // Store the value as the corresponding value
                        title = ''; // Reset the title after storing the pair
                    }
                }
            }
        });
    };

    // Function to clean the div from unwanted attributes and elements
    const cleanElement = (element) => {
        // Only remove unwanted elements (like <svg>, or specific classes) but preserve the class and style attributes
        const unwantedElements = element.querySelectorAll('svg, .some-unwanted-class'); // Add other unwanted selectors as needed
        unwantedElements.forEach(el => el.remove());

        // You can add more cleaning rules here if necessary (without touching class or style)
    };

    // Initialize content extraction on load
    extractDivContents();

    // Set up a MutationObserver to track changes in the body
    const observer = new MutationObserver(() => {
        extractDivContents(); // Re-extract content on any change
        console.log('Titles Object:', titlesObject);  // Log updated titles object
        console.log('Values Object:', valuesObject);  // Log updated values object
    });

    // Start observing the body for changes (subtree, child list, and character data changes)
    observer.observe(body, { childList: true, subtree: true, characterData: true });

    // Log the initial content with keys
    console.log('Initial Titles Object:', titlesObject);
    console.log('Initial Values Object:', valuesObject);
};

