import APIService from '../utils/apiServices';

export interface DepartmentSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface DepartmentAddParams {
    name: string,
    description: string
}

class DepartmentServices extends APIService {
    async getPageDepartment(params: DepartmentSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `department/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllDepartment() {
        return await this.request('GET', `department/find-all`);
    }

    async getFindByIdDepartment(id: number,) {
        return await this.request('GET', `department/find-by-id`, {}, { id: id });
    }

    async createDepartment(data: DepartmentAddParams) {
        return await this.request('POST', `department/create`, data);
    }

    async updateDepartment(id: number, data: any) {
        return await this.request('PUT', `department/update?id=${id}`, data);
    }

    async deleteDepartment(id: number) {
        return await this.request('DELETE', `department/delete?id=${id}`, {});
    }

    async exportDepartment(params: DepartmentSearchParams) {
        return await this.request('GET', `department/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new DepartmentServices();
export default service
