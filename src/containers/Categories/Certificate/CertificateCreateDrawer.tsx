import { useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as Close } from "../../../resources/images/close-contained.svg";

import CommonDrawer from "../../../components/Common/Drawer";
import CommonButton from "../../../components/Common/Button";
import CommonFormItem from "../../../components/Common/FormItem";
import CommonForm from "../../../components/Common/Form";

import certificateServices, { CertificateAddParams } from "../../../services/certificates.service";

export interface CertificateCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentCertificate: any,
}

const CertificateCreateDrawer = ({ visible, onAddSuccessful, currentCertificate, resetState }: CertificateCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);


    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: CertificateAddParams = {
            "description": values?.description,
            "name": values?.name,
            "expiry": values?.expiry
        }
        if (currentCertificate) {
            resp = await certificateServices.updateCertificate(currentCertificate.id, body);
        } else {
            resp = await certificateServices.createCertificate(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentCertificate) {
                notification.success({
                    message: t('Thêm mới chứng chỉ thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa chứng chỉ thành công'),
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
            title={currentCertificate ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa chứng chỉ')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới chứng chỉ')}</span>
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
                            {currentCertificate ? t('common.button.save') : t('common.button.addNew')}
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
                    name: currentCertificate?.name,
                    expiry: currentCertificate?.expiry,
                    description: currentCertificate?.description,
                }}
            >
                <div className="detail-page-box">
                    <div className="box-title">
                        {t('permissionsPage.form.infoBoxTitle')}
                    </div>
                    <Row gutter={20}>
                        <Col span={24}>
                            <CommonFormItem
                                name="name"
                                label={t('Tên chứng chỉ')}
                                placeholder={t('Nhập tên chứng chỉ') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Tên chứng chỉ') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={24}>
                            <CommonFormItem
                                name="expiry"
                                label={t('Thời hạn (Tháng)')}
                                placeholder={t('Nhập thời hạn') as string}
                                rules={[
                                    { required: true, message: t('Vui lòng nhập Thời hạn') as string }
                                ]}
                                showRequiredIcon={true}
                                type="inputNumber"
                                min={0}
                            />
                        </Col>
                        <Col span={24}>
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

export default CertificateCreateDrawer;