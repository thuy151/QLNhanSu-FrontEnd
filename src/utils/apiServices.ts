import { AxiosInstance } from "axios";

import LocalStorage from "./localStorage";
import { LANGUAGE_LIST } from "./constants";

import axios from "axios";
class APIService {
    private instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL
        });
    }

    async request(method: string, path: string, data: any = {}, config = {}) {
        this.handleRequestHeader()
        // let newPath = path;
        // if (method === "GET" && data) {
        //     for (let p in data) {
        //         if (p) {
        //             newPath = updateQueryStringParameter(newPath, p, data[p])
        //         }
        //     }
        // }
        try {
            return await this.instance.request({ method, url: path, data, ...config });
        } catch (error: any) {
            return this.handleResponseError(error);
        }
    }

    async upload(method: string, path: string, data = {}, config = {}) {
        this.handleRequestHeader(true)
        try {
            return await this.instance.request({ method, url: path, data, ...config });
        } catch (error: any) {
            return this.handleResponseError(error);
        }
    }

    handleRequestHeader(isUpload = false) {
        const accessToken = LocalStorage.getInstance().read('accessToken');
        const localLanguage = LocalStorage.getInstance().read('language') || LANGUAGE_LIST[0]?.value;

        this.instance.defaults.headers.common['Accept-Language'] = localLanguage;
        if (isUpload) {
            this.instance.defaults.headers.common['Accept'] = `application/json`;
            this.instance.defaults.headers.common['Content-Type'] = `multipart/form-data`;
        } else {
            this.instance.defaults.headers.common['Accept'] = `application/json`;
            this.instance.defaults.headers.common['Content-Type'] = `application/json;charset=UTF-8`;
        }

        if (accessToken) {
            this.instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    handleResponseError({ response, request, message }: any) {
        // Server trả về lỗi không thành công
        if (response) {
            this.handleLoginState(response);
            return response;
        } else {
            // Reponse dont have, token is faild
            // comment when request_timeout data.
            // this.store.clearData();
            // window.location.reload();
        }

        // Không nhận được phản hồi từ phía server
        if (request) {
            return { code: '408', message: `request_timeout` };
        }

        return { code: '999', message };
    }

    // xóa accessToken và return về màn login
    handleLoginState(response: any) {
        if (response.status === 401) {
            const pathname = window.location.pathname
            if (pathname) {
                LocalStorage.getInstance().save('redirectUrl', pathname);
            }
            LocalStorage.getInstance().save('accessToken', null);
            window.location.href = '/'
            // window.location.reload();
        }
    }
}

export default APIService;
