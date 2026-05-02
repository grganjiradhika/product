// ============================================
// STORAGE EXAMPLES - Interview Preparation
// ============================================

// ============================================
// 1. LOCAL STORAGE (Persistent - until manually cleared)
// ============================================

// Set data in localStorage
function setLocalStorage(username, phone) {
    localStorage.setItem('username', username);
    localStorage.setItem('phone', phone);

    // Or store as JSON object
    const userData = { username, phone };
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Get data from localStorage
function getLocalStorage() {
    const username = localStorage.getItem('username');
    const phone = localStorage.getItem('phone');

    console.log('Username:', username);
    console.log('Phone:', phone);

    return { username, phone };
}

// Get object from localStorage
function getLocalStorageObject() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Remove specific item from localStorage
function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
}

// Clear all localStorage
function clearLocalStorage() {
    localStorage.clear();
}

// ============================================
// 2. COOKIES (Can be persistent or session-based)
// ============================================

// Set cookie
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;

    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

// Set multiple cookies
function setUserCookies(username, phone, days = 7) {
    setCookie('username', username, days);
    setCookie('phone', phone, days);
}

// Get cookie by name
function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

// Get all user cookies
function getUserCookies() {
    const username = getCookie('username');
    const phone = getCookie('phone');

    return { username, phone };
}

// Delete cookie
function deleteCookie(name) {
    setCookie(name, '', -1);
}

// Delete all cookies
function deleteAllCookies() {
    document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        deleteCookie(name);
    });
}

// ============================================
// 3. SESSION STORAGE (Cleared when tab/browser closes)
// ============================================

// Set data in sessionStorage
function setSessionStorage(username, phone) {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('phone', phone);

    // Or store as JSON object
    const userData = { username, phone };
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Get data from sessionStorage
function getSessionStorage() {
    const username = sessionStorage.getItem('username');
    const phone = sessionStorage.getItem('phone');

    console.log('Username:', username);
    console.log('Phone:', phone);

    return { username, phone };
}

// Get object from sessionStorage
function getSessionStorageObject() {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Remove specific item from sessionStorage
function removeSessionStorageItem(key) {
    sessionStorage.removeItem(key);
}

// Clear all sessionStorage
function clearSessionStorage() {
    sessionStorage.clear();
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Using localStorage
console.log('=== LOCAL STORAGE ===');
setLocalStorage('john_doe', '1234567890');
getLocalStorage();
console.log('Object:', getLocalStorageObject());

// Example 2: Using Cookies
console.log('=== COOKIES ===');
setUserCookies('jane_smith', '9876543210', 7); // expires in 7 days
console.log('Cookies:', getUserCookies());

// Example 3: Using sessionStorage
console.log('=== SESSION STORAGE ===');
setSessionStorage('bob_johnson', '5555555555');
getSessionStorage();
console.log('Object:', getSessionStorageObject());

// ============================================
// COMPARISON TABLE
// ============================================
/*
┌─────────────────────┬──────────────┬──────────────┬────────────────┐
│ Feature             │ localStorage │ sessionStorage│ cookies        │
├─────────────────────┼──────────────┼──────────────┼────────────────┤
│ Expiration          │ Never        │ Tab closes   │ Configurable   │
│ Storage Limit       │ ~5-10MB      │ ~5-10MB      │ ~4KB           │
│ Sent with requests  │ No           │ No           │ Yes (HTTP)     │
│ Server accessible   │ No           │ No           │ Yes (if not HttpOnly) │
│ Scope               │ Domain       │ Tab          │ Domain/path    │
│ Synchronous         │ Yes          │ Yes          │ Yes            │
└─────────────────────┴──────────────┴──────────────┴────────────────┘
*/

// ============================================
// SECURITY CONSIDERATIONS
// ============================================
/*
1. localStorage - Data persists but vulnerable to XSS attacks
   → Don't store sensitive data like passwords
   → Good for: user preferences, non-sensitive user info

2. sessionStorage - Data only in current tab, cleared on close
   → More secure than localStorage
   → Good for: temporary user data during session

3. Cookies - Can be sent to server automatically
   → Use HttpOnly flag to prevent XSS access
   → Use Secure flag for HTTPS only
   → Use SameSite attribute to prevent CSRF attacks
   → Good for: authentication tokens (with proper flags)
*/

export {
    setLocalStorage,
    getLocalStorage,
    getLocalStorageObject,
    removeLocalStorageItem,
    clearLocalStorage,
    setCookie,
    setUserCookies,
    getCookie,
    getUserCookies,
    deleteCookie,
    deleteAllCookies,
    setSessionStorage,
    getSessionStorage,
    getSessionStorageObject,
    removeSessionStorageItem,
    clearSessionStorage,
};
