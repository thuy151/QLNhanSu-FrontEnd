import APIService from '../utils/apiServices';

interface LoginData {
    username: string,
    password: string
}
interface ChangePasswordData {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    username: number
}
interface ResetPasswordData {
    username: string, 
    email: string
}

export interface AccountSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

class UserServices extends APIService {
    async login(data:LoginData) {
        return await this.request('POST', `login`, data);
    }

    async changePassword(data:ChangePasswordData) {
        return await this.request('PUT', `account/change-password`, data);
    }

    async resetPassword(data: ResetPasswordData) {
        return await this.request('PUT', `account/reset-password`,data);
    }

    async sendEmail(data: any) {
        return await this.request('POST', `sendMail`,data);
    }


    async getPageAccount(params: AccountSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `account/page/find-all`, {}, { params: apiParams });
    }

    async createAccount(data:any) {
        return await this.request('POST', `account/create`, data);
    }

    async updateAccount(id:any, data:any) {
        return await this.request('PUT', `account/update?id=${id}`, data);
    }

    async deleteAccount(id:number) {
        return await this.request('DELETE', `account/delete?id=${id}`);
    }

    async findAllAccount() {
        return await this.request('GET', `account/find-all`);
    }

    async getAccountById(id: number) {
        return await this.request('PUT', `account/find-by-id?id=${id}`);
    }

    async exportAccount(params: AccountSearchParams) {
        return await this.request('GET', `account/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new UserServices();
export default service
