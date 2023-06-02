import APIService from '../utils/apiServices';

class RequestServices extends APIService {

    async upload(files:any, body?:any) {
        const bodyFormData = new FormData();
        for (let file of files) {
            bodyFormData.append('file ', file);
        }
        if (body) {
            for (let p in body) {
                if (body[p]) {
                    bodyFormData.append(p, body[p]);
                }
            }
        }
        return await this.request('POST', `uploadFile`, bodyFormData, {
            headers: {
                "Content-Disposition": "attachment"
            }
        });
    }

}
const service = new RequestServices();
export default service
