import APIService from '../utils/apiServices';

export interface DisciplineRewardSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface DisciplineRewardAddParams {
    name: string,
    description: string,
    isReward: boolean
}

class DisciplineRewardServices extends APIService {
    async getPageDisciplineReward(params: DisciplineRewardSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `discipline-reward/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllDisciplineReward() {
        return await this.request('GET', `discipline-reward/find-all`);
    }

    async getFindByIdDisciplineReward(id: number,) {
        return await this.request('GET', `discipline-reward/find-by-id`, {}, { id: id });
    }

    async createDisciplineReward(data: DisciplineRewardAddParams) {
        return await this.request('POST', `discipline-reward/create`, data);
    }

    async updateDisciplineReward(id: number, data: any) {
        return await this.request('PUT', `discipline-reward/update?id=${id}`, data);
    }

    async deleteDisciplineReward(id: number) {
        return await this.request('DELETE', `discipline-reward/delete?id=${id}`, {});
    }

    async exportDisciplineReward(params: DisciplineRewardSearchParams) {
        return await this.request('GET', `discipline-reward/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new DisciplineRewardServices();
export default service
