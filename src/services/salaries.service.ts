import APIService from '../utils/apiServices';

export interface SalarySearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface SalaryAddParams {
    empId: number,
    month: number,
    year: number,
    overtime: number,
    workdayCount: number,
    description: string
}
export interface thongKeLuongProps{
    from: number,
    to: number,
    userId?: number,
}

class SalaryServices extends APIService {
    async getPageSalary(params: SalarySearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `salary/page/find-all-salary`, {}, { params: apiParams });
    }

    // async getFindAllSalary() {
    //     return await this.request('GET', `rest/find-all`);
    // }

    // async getFindByIdSalary(id: number,) {
    //     return await this.request('GET', `rest/find-by-id`, {}, { id: id });
    // }

    async getFindByEmployee(employeeId: number,) {
        return await this.request('GET', `salary/find-by-employee?id=${employeeId}`, {});
    }

    async createSalary(data: SalaryAddParams) {
        return await this.request('POST', `salary/create`, data);
    }

    // async updateSalary(id: number, data: any) {
    //     return await this.request('PUT', `rest/update?id=${id}`, data);
    // }

    async deleteSalary(id: number) {
        return await this.request('DELETE', `salary/delete?id=${id}`, {});
    }

    async exportSalary(params: SalarySearchParams) {
        return await this.request('GET', `salary/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }
    async thongKeLuong(params: thongKeLuongProps) {
        return await this.request('GET', `salary/thong-ke-luong`, {}, {params});
    }
    

}
const service = new SalaryServices();
export default service
