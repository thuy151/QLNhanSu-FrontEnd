import APIService from '../utils/apiServices';

export interface ContractSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface ContractAddParams {
    name: string,
    description: string,
    expiry: string,
    basicSalary: number,
    signedDate: string,
    status: boolean,
    empId: number
}

class ContractServices extends APIService {
    async getPageContract(params: ContractSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `contract/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllContract() {
        return await this.request('GET', `contract/find-all`);
    }

    async getFindByIdContract(id: number,) {
        return await this.request('GET', `contract/find-by-id`, {}, { id: id });
    }

    async getFindByEmployee(employeeId: number,) {
        return await this.request('GET', `contract/find-by-id`, {}, { id: employeeId });
    }

    async createContract(data: ContractAddParams) {
        return await this.request('POST', `contract/create`, data);
    }

    async updateContract(id: number, data: any) {
        return await this.request('PUT', `contract/update?id=${id}`, data);
    }

    async deleteContract(id: number) {
        return await this.request('DELETE', `contract/delete?id=${id}`, {});
    }

    async exportContract(params: ContractSearchParams) {
        return await this.request('GET', `contract/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new ContractServices();
export default service
