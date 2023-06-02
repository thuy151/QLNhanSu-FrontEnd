import APIService from '../utils/apiServices';

export interface CertificateSearchParams {
    searchText?: any,
    currentPageNumber?: number,
    pageSize?: number,
    sortColumn?: string,
    sortDirection?: string,
}

export interface CertificateAddParams {
    name: string,
    description: string,
    expiry: number
}

class CertificateServices extends APIService {
    async getPageCertificate(params: CertificateSearchParams) {
        let apiParams = {
            searchText: params.searchText || "",
            currentPageNumber: params.currentPageNumber || 0,
            pageSize: params.pageSize || 10,
            sortColumn: params.sortColumn || "updateTime",
            sortDirection: params.sortDirection || "DESC",
        }
        return await this.request('GET', `certificate/page/find-all`, {}, { params: apiParams });
    }

    async getFindAllCertificate() {
        return await this.request('GET', `certificate/find-all`);
    }

    async getFindByIdCertificate(id: number,) {
        return await this.request('GET', `certificate/find-by-id`, {}, { id: id });
    }

    async createCertificate(data: CertificateAddParams) {
        return await this.request('POST', `certificate/create`, data);
    }

    async updateCertificate(id: number, data: any) {
        return await this.request('PUT', `certificate/update?id=${id}`, data);
    }

    async deleteCertificate(id: number) {
        return await this.request('DELETE', `certificate/delete?id=${id}`, {});
    }

    async exportEmployee(params: CertificateSearchParams) {
        return await this.request('GET', `certificate/exportExcel`, {}, {
            responseType: 'blob',
            params: params,
        });
    }

}
const service = new CertificateServices();
export default service
