import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react'
import {useTranslation} from "react-i18next";
import {EditOutlined} from '@ant-design/icons'
import {Form, Space, notification} from "antd";
import { useSelector} from "react-redux";

import CommonButton from "../../../../components/Common/Button";
import CommonForm from "../../../../components/Common/Form";
import CommonFormItem from "../../../../components/Common/FormItem";

import { REGEX_EMAIL, REGEX_PHONE_NUMBER } from "../../../../utils/constants";
import moment from 'moment';

import employeeServices, { EmployeeAddParams } from "../../../../services/employees.service";

function AccountProfile (props:any, ref:any) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [employeeDetail, setEmployeeDetail] = useState<any>(undefined);

    const {
        profile
    } = useSelector((state:any) => state?.profileReducer);

    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        isEdit,
        onClear
    }));


    const getData = useCallback(async ()=>{
        const resp = await  employeeServices.getFindByIdEmployee(profile?.employee?.id)
        const data = resp?.data;
        console.log("data",data)
        if (resp?.status === 200){
            setEmployeeDetail(data);
            form.setFieldsValue({
                name: data?.name,
                username: profile?.username,
                role: profile?.scope,
                dob: data?.dob ? moment(data?.dob) : undefined,
                phoneNumber: data?.phoneNumber,
                email: data?.email,
                modifiedDate: data?.updateTime ? moment(data?.updateTime) : undefined,
            })
        }else{
            setEmployeeDetail(undefined);
        }
    },[form, profile?.employee?.id, profile?.scope, profile?.username])

    useEffect(()=>{
        getData();
    },[getData]);


    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values:any) => {
        const body: EmployeeAddParams = {
            name: values?.name,
            dob: moment(values?.dob).format('YYYY-MM-DD'),
            phoneNumber: values?.phoneNumber,
            email: values?.email,
            cccd: employeeDetail?.cccd,
            hsl: employeeDetail?.hsl,
            gender: employeeDetail?.gender,
            permanentAddress: employeeDetail?.permanentAddress,
            insuranceCode: employeeDetail?.insuranceCode,
            education: employeeDetail?.education,
            status: employeeDetail?.status,
            address: employeeDetail?.address,
            specialize: employeeDetail?.specialize,
            certificateIds: [],
            positionId: employeeDetail?.position?.id,
            departmentId: employeeDetail?.department?.id
        }

        setIsLoading(true)
        const resp = await employeeServices.updateEmployee(employeeDetail.id, body);
        const data = resp?.data;
        if (resp?.status === 200) {
            notification.success({
                message: t('Đổi thông tin thành công!'),
            });
            setIsEdit(false);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        setIsLoading(false)
    }

    const onClear = () => {
        getData();
        setIsEdit(false)
    }

    return <div className="profile-tab-content">
        <div className="profile-tab-content-header">
            <div className="profile-tab-content-header-left">
                {t('profilePage.accountProfileTab.title')}
            </div>
            <div className="profile-tab-content-header-right">
                {
                    !isEdit &&
                    <EditOutlined className='cursor-pointer' onClick={() => setIsEdit(true)}/>
                }
            </div>
        </div>

        <CommonForm
            form={form}
            onFinish={onFinish}
            layout="horizontal"
            isLoading={isLoading}
        >
            <CommonFormItem
                isView={!isEdit}
                name="name"
                label={t('profilePage.accountProfileTab.label.fullName')}
                placeholder={t('profilePage.accountProfileTab.placeholder.fullName') as string}
                rules={[
                    { required: true, message: t('validate.fullNameRequired') as string }
                ]}
            />
            <CommonFormItem
                isView={!isEdit}
                name="username"
                label={t('profilePage.accountProfileTab.label.userName')}
                placeholder={t('profilePage.accountProfileTab.placeholder.userName') as string}
                disabled={true}
            />
            <CommonFormItem
                isView={!isEdit}
                name="role"
                label={t('profilePage.accountProfileTab.label.roles')}
                placeholder={t('profilePage.accountProfileTab.placeholder.roles') as string}
                disabled={true}
            />
            <CommonFormItem
                isView={!isEdit}
                name="dob"
                label={t('Ngày sinh')}
                placeholder={t('Chọn ngày sinh') as string}
                type="datePicker"
            />
            <CommonFormItem
                isView={!isEdit}
                name="phoneNumber"
                label={t('profilePage.accountProfileTab.label.phoneNumber')}
                placeholder={t('profilePage.accountProfileTab.placeholder.phoneNumber') as string}
                rules={[
                    { pattern: new RegExp(REGEX_PHONE_NUMBER), message: t('Số điện thoại gồm 10 chữ số') as string },
                    { required: true, whitespace: true, message: t('Vui lòng nhập Số điện thoại') as string }
                ]}
                maxLength={10}
            />
            <CommonFormItem
                isView={!isEdit}
                name="email"
                label={t('Email')}
                placeholder={t('Nhập email') as string}
                rules={[
                    { required: true, whitespace: true, message: t('Vui lòng nhập Email') as string },
                    { pattern : REGEX_EMAIL, message: "Email phải có dạng 'abc@gmail.com'"}
                ]}
            />
            <CommonFormItem
                isView={!isEdit}
                name="modifiedDate"
                label={t('profilePage.accountProfileTab.label.modifiedDate')}
                disabled={true}
                type="datePicker"
                placeholder={t('profilePage.accountProfileTab.placeholder.modifiedDate') as string}
            />
            {
                isEdit && <Space className="form-btn-container">
                    <CommonButton size={'small'} onClick={onClear}>
                        {t('common.button.cancel')}
                    </CommonButton>
                    <CommonButton btnType="primary" size={'small'} htmlType="submit">
                        {t('common.button.save')}
                    </CommonButton>
                </Space>
            }
        </CommonForm>

    </div>
}

export default forwardRef(AccountProfile);

