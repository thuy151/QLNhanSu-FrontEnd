import APIService from '../utils/apiServices';

export interface PositionSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface PositionAddParams {
    allowance: number,
    name: string,
    description: string
}

class PositionServices extends APIService {
    async getPagePosition(params: PositionSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `position/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllPosition() {
        return await this.request('GET', `position/find-all`);
    }

    async getFindByIdPosition(id: number,) {
        return await this.request('GET', `position/find-by-id`, {}, { id: id });
    }

    async createPosition(data: PositionAddParams) {
        return await this.request('POST', `position/create`, data);
    }

    async updatePosition(id: number, data: any) {
        return await this.request('PUT', `position/update?id=${id}`, data);
    }

    async deletePosition(id: number) {
        return await this.request('DELETE', `position/delete?id=${id}`, {});
    }

    async exportPosition(params: PositionSearchParams) {
        return await this.request('GET', `position/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new PositionServices();
export default service
