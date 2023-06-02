import { useCallback, useEffect, useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as Close } from "../../resources/images/close-contained.svg";

import CommonDrawer from "../../components/Common/Drawer";
import CommonButton from "../../components/Common/Button";
import CommonFormItem from "../../components/Common/FormItem";
import CommonForm from "../../components/Common/Form";

import employeeRewardServices from "../../services/employeeRewards.service";
import employeeServices from "../../services/employees.service";
import disciplineRewardServices from "../../services/disciplineRewards.service";
import { useSelector } from "react-redux";

export interface EmployeeRewardCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentEmployeeReward: any,
}

const EmployeeRewardCreateDrawer = ({ visible, onAddSuccessful, currentEmployeeReward, resetState }: EmployeeRewardCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const { profile } = useSelector((state: any) => state?.profileReducer);

    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [disciplineRewardList, setDisciplineRewardList] = useState<any[]>([]);
    
    const getDataReward = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await disciplineRewardServices.getPageDisciplineReward(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setDisciplineRewardList(data?.content?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setDisciplineRewardList([])
        }
    },[])

    useEffect(()=>{
        getDataReward();
    },[getDataReward])

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeServices.getPageEmployee(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setEmployeeList(data?.content
                                    ?.filter((item:any)=>item.status===true)
                                        ?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setEmployeeList([])
        }
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        if (currentEmployeeReward) {
            resp = await employeeRewardServices.updateEmployeeReward(currentEmployeeReward.id, values);
        } else {
            resp = await employeeRewardServices.createEmployeeReward(values);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentEmployeeReward) {
                notification.success({
                    message: t('Thêm mới khen thưởng-kỷ luật thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa khen thưởng-kỷ luật thành công'),
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
            title={currentEmployeeReward ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa khen thưởng-kỷ luật')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới khen thưởng-kỷ luật')}</span>
                    <Close onClick={() => resetState()} />
                </div>}
            placement="right"
            open={visible}
            onClose={() => resetState()}
            footer={[
                <Row className='row-drawer' key='footer'>
                    <Space>
                        <CommonButton
                            key="close"
                            btnType='default'
                            size="large"
                            onClick={() => resetState()}
                        >
                            {t('common.button.close')}
                        </CommonButton>
                        {(profile?.scope === "ADMIN" || profile?.scope === "MANAGER")&&<CommonButton
                            key="update"
                            btnType='primary'
                            size="large"
                            onClick={() => form.submit()}
                            loading={isSubmitLoading}
                        >
                            {currentEmployeeReward ? t('common.button.save') : t('common.button.addNew')}
                        </CommonButton>}
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
                    name: currentEmployeeReward?.name,
                    allowance: currentEmployeeReward?.allowance,
                    description: currentEmployeeReward?.description,
                    isReward: currentEmployeeReward ? (currentEmployeeReward?.isReward === 0 ? true : false) : true
                }}
                disabled={(profile?.scope === "ADMIN" || profile?.scope === "MANAGER")? false :true}
            >
                <div className="detail-page-box">
                    <div className="box-title">
                        {t('permissionsPage.form.infoBoxTitle')}
                    </div>
                    <Row gutter={20}>
                        <Col span={24}>
                            <CommonFormItem
                                name="empId"
                                label="Nhân viên được khen thưởng-kỷ luật"
                                placeholder="Chọn nhân viên"
                                rules={
                                    [{ required: true, message: t('Vui lòng chọn nhân viên') as string }]
                                }
                                showRequiredIcon
                                type="select"
                                options={employeeList}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <CommonFormItem
                                name="disciplineRewardIds"
                                label="Nội dung khen thưởng-kỷ luật"
                                placeholder="Chọn nội dung"
                                rules={
                                    [{ required: true, message: t('Vui lòng chọn nội dung') as string }]
                                }
                                mode="multiple"
                                showRequiredIcon
                                type="select"
                                options={disciplineRewardList}
                            />
                        </Col>
                    </Row>
                </div>
            </CommonForm>
        </CommonDrawer>
    )
}

export default EmployeeRewardCreateDrawer;