import APIService from '../utils/apiServices';

export interface RestSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface RestAddParams {
    reason: string,
    fromDate: any,
    toDate: any,
    haveSalary: boolean,
    empId: number
}

class RestServices extends APIService {
    async getPageRest(params: RestSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `rest/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllRest() {
        return await this.request('GET', `rest/find-all`);
    }

    async getFindByIdRest(id: number,) {
        return await this.request('GET', `rest/find-by-id`, {}, { id: id });
    }

    async getFindByEmployee(employeeId: number,) {
        return await this.request('GET', `rest/find-by-id`, {}, { id: employeeId });
    }

    async createRest(data: RestAddParams) {
        return await this.request('POST', `rest/create`, data);
    }

    async updateRest(id: number, data: any) {
        return await this.request('PUT', `rest/update?id=${id}`, data);
    }

    async deleteRest(id: number) {
        return await this.request('DELETE', `rest/delete?id=${id}`, {});
    }

    async exportRest(params: RestSearchParams) {
        return await this.request('GET', `rest/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new RestServices();
export default service
