import React from 'react'
import CommonModal from '../../components/Common/Modal'
import CommonForm from '../../components/Common/Form'
import { Form, notification } from 'antd';
import CommonFormItem from '../../components/Common/FormItem';
import userServices from "../../services/users.service";
import moment from 'moment';
import { DATE_TIME_FORMAT, REGEX_EMAIL } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

export interface ResetPasswordProps{
    open: boolean,
    onCancel: any,
}

function ResetPassword(props:ResetPasswordProps) {
    const [form] = Form.useForm();
    const {open , onCancel} = props;
    const { t } = useTranslation()

    const onRestPassword = async (values:any)=>{
        const resp = await userServices.resetPassword(values)
        const data = resp.data;
        if(resp.status===200){
            userServices.sendEmail({
                recipient: values.email,
                msgBody: `
                        Bạn đã đặt lại mật khẩu thành công! 
                        Mật khẩu hiện tại là: ${values.username}
                        Thời gian: ${moment().format(DATE_TIME_FORMAT)}
                `,
                subject: "Đặt lại mật khẩu thành công"
            })
            notification.success({
                message: 'Mật khẩu đã được đặt lại thành công. Vui lòng check mail để nhận mật khẩu mới!',
            });
            onCancel();
        }else{
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
    }
    return (
        <CommonModal
            open={open}
            title="Đặt lại mật khẩu"
            onCancel={onCancel}
            onOk={()=>form.submit()}
        >
            <CommonForm
                form={form}
                onFinish={onRestPassword}
            >
                <CommonFormItem
                    name= "username"
                    label="Tên Đăng nhập"
                    showRequiredIcon
                    placeholder="Nhập tên đăng nhập"
                    rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên đăng nhập"}]}
                />
                <CommonFormItem
                    name= "email"
                    label="Email"
                    placeholder="Nhập email"
                    showRequiredIcon
                    rules={[
                        { required: true, whitespace: true, message: "Vui lòng nhập email"},
                        { pattern : REGEX_EMAIL, message: "Email phải có dạng 'abc@gmail.com'"}
                    ]}
                />
            </CommonForm>
        </CommonModal>
    )
}

export default ResetPassword