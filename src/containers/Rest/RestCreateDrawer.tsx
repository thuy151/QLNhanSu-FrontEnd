import { useEffect, useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";
import moment from 'moment';

import { ReactComponent as Close } from "../../resources/images/close-contained.svg";

import CommonDrawer from "../../components/Common/Drawer";
import CommonButton from "../../components/Common/Button";
import CommonFormItem from "../../components/Common/FormItem";
import CommonForm from "../../components/Common/Form";

import restServices, { RestAddParams } from "../../services/rests.service";
import employeeServices from "../../services/employees.service";
import { useSelector } from "react-redux";

export interface RestCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentRest: any,
}

const RestCreateDrawer = ({ visible, onAddSuccessful, currentRest, resetState }: RestCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [dataSelectEmployee, setDataSelectEmployee] = useState<any[]>([])
    const { profile } = useSelector((state: any) => state?.profileReducer);

    const getData = async (reload?: boolean) => {
        const resp = await employeeServices.getFindAllEmployee();
        const data = resp?.data;

        if (resp?.status === 200) {
            setDataSelectEmployee(data?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setDataSelectEmployee([]);
        }
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: RestAddParams = {
            empId: values?.empId || currentRest?.employee?.id,
            reason: values?.reason,
            fromDate: moment(values?.date[0]).format("YYYY-MM-DD"),
            toDate: moment(values?.date[1]).format("YYYY-MM-DD"),
            haveSalary: values?.haveSalary,
        }
        if (currentRest) {
            resp = await restServices.updateRest(currentRest.id, body);
        } else {
            resp = await restServices.createRest(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentRest) {
                notification.success({
                    message: t('Thêm mới nghỉ phép thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa nghỉ phép thành công'),
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
            title={currentRest ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa nghỉ phép')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới nghỉ phép')}</span>
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
                            {currentRest ? t('common.button.save') : t('common.button.addNew')}
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
                    empId: currentRest?.employee?.id,
                    reason: currentRest?.reason,
                    date: (currentRest?.fromDate && currentRest?.toDate) ? [moment(currentRest?.fromDate), moment(currentRest?.toDate)] : [],
                    haveSalary: currentRest ? currentRest?.haveSalary : true,
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
                                label={t('Nhân viên')}
                                placeholder={t('chọn nhân viên') as string}
                                rules={[
                                    { required: true, message: t('Vui lòng chọn Nhân viên') as string }
                                ]}
                                showRequiredIcon={true}
                                type="select"
                                options={dataSelectEmployee}
                            />
                        </Col>
                        <Col span={24}>
                            <CommonFormItem
                                name="reason"
                                label={t('Lý do')}
                                placeholder={t('Nhập lý do') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Lý do') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <CommonFormItem
                                name="date"
                                label={t('Thời gian nghỉ')}
                                rules={[
                                    { required: true, message: t('Vui lòng chọn Thời gian nghỉ') as string }
                                ]}
                                showRequiredIcon={true}
                                type="rangePicker"
                                placeholder={[t('common.fromDate'), t('common.toDate')]}
                            />
                        </Col>
                        <Col span={24}>
                            <CommonFormItem
                                name="haveSalary"
                                label={t('Nghỉ có lương')}
                                valuePropName="checked"
                                type='switch'
                            />
                        </Col>
                    </Row>
                </div>
            </CommonForm>
        </CommonDrawer>
    )
}

export default RestCreateDrawer;