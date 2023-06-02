import APIService from '../utils/apiServices';

export interface EmployeeRewardSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface EmployeeRewardAddParams {
    empId: number,
    disciplineRewardIds: number[]
}

class EmployeeRewardServices extends APIService {
    async getPageEmployeeReward(params: EmployeeRewardSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `discipline-reward-emp/page/find-all`, {}, { params: apiParams });
    }

    async getFindByIdEmployeeReward(id: number,) {
        return await this.request('GET', `discipline-reward-emp/find-by-id?id=${id}`);
    }

    async getFindByIdEmployee(id: number,) {
        return await this.request('GET', `discipline-reward-emp/find-by-employee?id=${id}`);
    }
    
    async getFindByIdReward(id: number,) {
        return await this.request('GET', `discipline-reward-emp/find-by-discipline-reward?id=${id}`);
    }

    async createEmployeeReward(data: EmployeeRewardAddParams) {
        return await this.upload('POST', `discipline-reward-emp/create`, data);
    }

    async updateEmployeeReward(id: number, data: any) {
        return await this.request('PUT', `discipline-reward-emp/update-info?id=${id}`, data);
    }

    async deleteEmployeeReward(id: number) {
        return await this.request('DELETE', `discipline-reward-emp/delete?id=${id}`, {});
    }

    async exportEmployeeReward(params: EmployeeRewardSearchParams) {
        return await this.request('GET', `discipline-reward-emp/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new EmployeeRewardServices();
export default service
