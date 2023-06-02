import APIService from '../utils/apiServices';

class RequestServices extends APIService {
    async getAccountActionLogs(params:any) {
        return await this.request('GET', `actionlog/search`, {}, {params: params});
    }

    async getUserActionLogs(userId:any, params:any) {
        return await this.request('GET', `actionlog/search/${userId}`, {}, {params: params});
    }
}
const service = new RequestServices();
export default service
