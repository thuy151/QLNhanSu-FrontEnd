import APIService from '../utils/apiServices';

export interface EmployeeSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface EmployeeAddParams {
    cccd: string,
    gender: string,
    permanentAddress: string,
    insuranceCode: string,
    education: string,
    name: string,
    status: boolean,
    address: string,
    dob: any,
    phoneNumber: string,
    email: string,
    avatar?: any,
    specialize: string,
    disciplineRewardIds?: number[],
    certificateIds: number[],
    positionId: number,
    departmentId: number
}

class EmployeeServices extends APIService {
    async getPageEmployee(params: EmployeeSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `employee/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllEmployee() {
        return await this.request('GET', `employee/find-all`);
    }

    async getFindByIdEmployee(id: number,) {
        return await this.request('GET', `employee/find-by-id?id=${id}`);
    }

    async createEmployee(data: EmployeeAddParams) {
        return await this.upload('POST', `employee/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async updateEmployee(id: number, data: any) {
        return await this.request('PUT', `employee/update-info?id=${id}`, data);
    }

    async updateAvatarEmployee(data: any) {
        return await this.request('PUT', `employee/update-avatar`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async deleteEmployee(id: number) {
        return await this.request('DELETE', `employee/delete?id=${id}`, {});
    }

    async downloadAvatar(fileName: string) {
        return await this.request('GET', `employee/download-avatar/${fileName}`);
    }

    async exportEmployee(params: EmployeeSearchParams) {
        return await this.request('GET', `employee/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new EmployeeServices();
export default service
