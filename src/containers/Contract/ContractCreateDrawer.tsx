import { useEffect, useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";
import moment from 'moment';

import { ReactComponent as Close } from "../../resources/images/close-contained.svg";

import CommonDrawer from "../../components/Common/Drawer";
import CommonButton from "../../components/Common/Button";
import CommonFormItem from "../../components/Common/FormItem";
import CommonForm from "../../components/Common/Form";

import contractServices, { ContractAddParams } from "../../services/contracts.service";
import employeeServices from "../../services/employees.service";
import { useWatch } from "antd/es/form/Form";

export interface ContractCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentContract: any,
}

const ContractCreateDrawer = ({ visible, onAddSuccessful, currentContract, resetState }: ContractCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [dataSelectEmployee, setDataSelectEmployee] = useState<any[]>([])
    const signedDate = useWatch("signedDate", form);
    const expiry = useWatch("expiry", form);

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
        const body: ContractAddParams = {
            name: values?.name,
            description: values?.description,
            basicSalary: values?.basicSalary,
            expiry: moment(values?.expiry)?.format("YYYY-MM-DD"),
            signedDate: moment(values?.signedDate)?.format("YYYY-MM-DD"),
            status: values?.status,
            empId: values?.empId,
        }
        if (currentContract) {
            resp = await contractServices.updateContract(currentContract.id, body);
        } else {
            resp = await contractServices.createContract(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentContract) {
                notification.success({
                    message: t('Thêm mới hợp đồng thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa hợp đồng thành công'),
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
            title={currentContract ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa hợp đồng')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới hợp đồng')}</span>
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
                        <CommonButton
                            key="update"
                            btnType='primary'
                            size="large"
                            onClick={() => form.submit()}
                            loading={isSubmitLoading}
                        >
                            {currentContract ? t('common.button.save') : t('common.button.addNew')}
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
                    name: currentContract?.name,
                    description: currentContract?.description,
                    basicSalary: currentContract?.basicSalary,
                    expiry: currentContract ? moment(currentContract?.expiry) : undefined,
                    signedDate: currentContract ? moment(currentContract?.signedDate) : undefined,
                    status: currentContract ? currentContract?.status : true,
                    empId: currentContract?.employee?.id,
                }}
            >
                <div className="detail-page-box">
                    <div className="box-title">
                        {t('permissionsPage.form.infoBoxTitle')}
                    </div>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="name"
                                label={t('Tên hợp đồng')}
                                placeholder={t('Nhập tên hợp đồng') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Tên hợp đồng') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
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
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="signedDate"
                                label={t('Thời gian ký')}
                                rules={[
                                    { required: true, message: t('Vui lòng chọn Thời gian ký') as string }
                                ]}
                                showRequiredIcon={true}
                                type="datePicker"
                                placeholder={t('Chọn ngày ký') as string}
                                disabledDate={(current:any)=> expiry ? current > moment(expiry).endOf("day") : false}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="expiry"
                                label={t('Thời gian hết hạn')}
                                rules={[
                                    { required: true, message: t('Vui lòng chọn Thời gian hết hạn') as string }
                                ]}
                                showRequiredIcon={true}
                                type="datePicker"
                                placeholder={t('Chọn ngày hết hạn') as string}
                                disabledDate={(current:any)=> signedDate ? current < moment(signedDate).startOf("day") : false}
                            />
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <CommonFormItem
                                        name="basicSalary"
                                        label={t('Lương cơ bản')}
                                        rules={[
                                            { required: true, message: t('Vui lòng nhập Lương cơ bản') as string }
                                        ]}
                                        placeholder={"Nhập lương cơ bản"}
                                        showRequiredIcon={true}
                                        type='inputNumber'
                                        min={0}
                                    />
                                </Col>
                                <Col span={24}>
                                    <CommonFormItem
                                        name="status"
                                        label={t('Hợp đồng chính thức')}
                                        valuePropName="checked"
                                        type='switch'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="description"
                                label={t('Mô tả')}
                                placeholder={t('Nhập mô tả') as string}
                                type="textArea"
                                rows={4}
                                maxLength={200}
                                showRequiredIcon
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Mô tả') as string }
                                ]}
                            />
                        </Col>
                    </Row>
                </div>
            </CommonForm>
        </CommonDrawer>
    )
}

export default ContractCreateDrawer;