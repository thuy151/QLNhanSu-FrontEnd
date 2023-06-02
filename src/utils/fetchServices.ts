import LocalStorage from "./localStorage";
import {LANGUAGE_LIST} from "./constants";

export function fetchService (url:any) {
    const accessToken = LocalStorage.getInstance().read('accessToken');
    const localLanguage = LocalStorage.getInstance().read('language') || LANGUAGE_LIST[0]?.value;

    return fetch(url, {
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept-Language": localLanguage,
            "Authorization": `Bearer ${accessToken}`,
        },
    })
}
