import _ from 'lodash';
import cookie from 'react-cookies';

/**
 * save object to cookie
 * @param key
 * @param data
 */
function cookieSaveObject(key, data) {
    //save(key,data,{ path: '/' });
    //cookie.save(key,data,{ path: '/' });
    try {
        cookie.save(key, _.isObject(data) ? JSON.stringify(data) : data, {path: '/'});
    }
    catch (e) {
        console.log("Cannot save data to local cookie", e);
    }
}

/**
 * read cookie
 * @param key
 * @returns {any}
 */
function cookieReadObject(key) {

    if (cookie == null) {
        throw new Error("fail to read object to Cookie");
    }
    //load cookie from brower
    let result = cookie.load(key);
    try {
        return JSON.parse(result);
    }
    catch (e) {
        return result;
    }
}

/**
 * delete cookie
 * @param key
 * @constructor
 */
function ClearCookieObject(key) {
    //clear cookie
    cookie.remove(key, {path: '/'});
}

/**
 * check if we can use localStorage
 * @returns {boolean}
 */
function isLocalStorageAvailable() {
    try {
        localStorage.setItem("test", "test");
        localStorage.setItem("test", undefined);

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * save object to local storage
 * @param key
 * @param data
 */
function localStorageSaveObject(key, data) {
    try {
        localStorage.setItem(key, _.isObject(data) ? JSON.stringify(data) : data);
    } catch (e) {
        console.log("Cannot save data to local storage", e);
    }
}

/**
 * read localStorage
 * @param key
 * @returns {any}
 */
function localStorageReadObject(key) {
    if (localStorage == null || typeof key !== 'string') {
        throw new Error("fail to read object to localStorage");
    }

    let result = localStorage.getItem(key);

    try {
        return JSON.parse(result);
    } catch (e) {
        return result;
    }
}

/**
 * Singleton LocalStore
 * @type {{getInstance}}
 */
const LocalStore  = (function () {
    let instance;

    function createInstance() {
        let object = {};

        if (isLocalStorageAvailable()) {
            object.save = localStorageSaveObject;
            object.read = localStorageReadObject;
        } else {
            object.save = cookieSaveObject;
            object.read = cookieReadObject;
        }

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default LocalStore