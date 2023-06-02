import { useCallback, useEffect, useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as Close } from "../../../resources/images/close-contained.svg";

import CommonDrawer from "../../../components/Common/Drawer";
import CommonButton from "../../../components/Common/Button";
import CommonFormItem from "../../../components/Common/FormItem";
import CommonForm from "../../../components/Common/Form";
import { PERMISSION_LIST, ACCOUNT_PAGE_STATUS,  } from "../../../utils/constants";

import accountsServices from "../../../services/users.service";
import employeeServices from "../../../services/employees.service";

export interface AccountDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentAccount: any,
}

const AccountDrawer = ({ visible, onAddSuccessful, currentAccount, resetState }: AccountDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [accountCheckList, setAccountCheckList] = useState<any[]>([]);

    const getAccount = useCallback(async ()=>{
        const resp = await accountsServices.findAllAccount();
        if(resp.status === 200){
            setAccountCheckList(resp?.data?.map((item:any)=> item?.employee?.id))
        }else{
            setAccountCheckList([]);
        }
    },[])

    useEffect(()=>{
        getAccount();
    },[getAccount])
    
    useEffect(()=>{
        console.log("accountCheckList",accountCheckList)
    },[accountCheckList])
    
    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeServices.getPageEmployee(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setEmployeeList(data?.content?.filter((item:any)=> {
                                                if(currentAccount){ 
                                                    //Lấy ra danh sách nhân viên chưa có tài khoản và nhân viên của tài khoản đang xem chi tiết (sửa)
                                                    return !accountCheckList.includes(item.id) || item.id === currentAccount?.employee?.id 
                                                }
                                                // lấy ra danh sách nhân viên chưa có tài khoản (lúc thêm mới)
                                                return !accountCheckList.includes(item.id) 
                                        })?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setEmployeeList([])
        }
    },[accountCheckList, currentAccount])

    useEffect(()=>{
        getData();
    },[getData])

    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        setIsSubmitLoading(true)
        let resp;
        if (currentAccount) {
            resp = await accountsServices.updateAccount(currentAccount.id, values);
        } else {
            resp = await accountsServices.createAccount(values);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentAccount) {
                notification.success({
                    message: t('accountPage.form.message.createSuccess'),
                });
            } else {
                notification.success({
                    message: t('accountPage.form.message.updateSuccess'),
                });
            } 
            onAddSuccessful();
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }

        setIsSubmitLoading(false)
    }

    return (
        <CommonDrawer
            closable={false}
            mask={true}
            maskClosable={false}
            width={'60%'}
            title={currentAccount ?
                <div className="drawer-title">
                    <span>{t('accountPage.form.detailTitle')}</span>
                    <Close onClick={resetState} />
                </div>
                : <div className="drawer-title">
                    <span>{t('accountPage.form.createTitle')}</span>
                    <Close onClick={resetState} />
                </div>}
            placement="right"
            open={visible}
            onClose={resetState}
            footer={[
                <Row className='row-drawer' key='footer'>
                    <Space>
                        <CommonButton
                            key="close"
                            btnType='default'
                            size="large"
                            onClick={resetState}
                        >
                            {t('common.button.close')}
                        </CommonButton>
                        <CommonButton
                            key="update"
                            btnType='primary'
                            size="large"
                            onClick={() => form.submit()}
                            loading={isSubmitLoading}
                        >
                            {currentAccount ? t('common.button.save') : t('common.button.addNew')}
                        </CommonButton>
                    </Space>
                </Row>
            ]}
        >
            <CommonForm
                key="form"
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    permission: currentAccount?.permission,
                    username: currentAccount?.username,
                    empId: currentAccount?.employee?.id,
                    status: currentAccount?.status
                }}
            >
                <div className="detail-page-box">
                    <div className="box-title">
                        {t('accountPage.form.infoBoxTitle')}
                    </div>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                disabled={currentAccount ? true : false}
                                name="username"
                                label={t('accountPage.form.label.username')}
                                placeholder={t('accountPage.form.placeholder.username') as string}
                                rules={currentAccount ? [] : [
                                    { whitespace: true, required: true, message: t('accountPage.form.validate.username') as string }
                                ]}
                                showRequiredIcon={currentAccount ? false : true}
                            />
                        </Col>
                        {/* !profile?.authorities?.find((item:any)=>item.authority==="ACCOUNT_UPDATE") */}
                        <Col span={12}>
                            <CommonFormItem
                                name="empId"
                                label="Nhân viên"
                                placeholder={"Chọn nhân viên"}
                                rules={currentAccount ? [] : [
                                    { required: true,  message: "Chọn nhân viên"}
                                ]}
                                showRequiredIcon={currentAccount ? false : true}
                                type="select"
                                options={employeeList}
                                disabled={currentAccount ? true : false}
                            />
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="permission"
                                label={t('accountPage.form.label.groups')}
                                placeholder={t('accountPage.form.placeholder.groups') as string}
                                rules={[
                                    { required: true, message: t('accountPage.form.validate.groups') as string }
                                ]}
                                showRequiredIcon={true}
                                type="select"
                                maxTagCount={2}
                                options={PERMISSION_LIST}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="status"
                                label={t('Trạng thái')}
                                placeholder="Chọn trạng thái"
                                rules={[
                                    { required: true, message: t('Vui lòng chọn Trạng thái!') as string }
                                ]}
                                showRequiredIcon={true}
                                type="select"
                                options={ACCOUNT_PAGE_STATUS?.map((item:any)=> ({value: item.value, label: item.label}))}
                            />
                        </Col>
                    </Row>
                </div>
            </CommonForm>
        </CommonDrawer>
    )
}

export default AccountDrawer;