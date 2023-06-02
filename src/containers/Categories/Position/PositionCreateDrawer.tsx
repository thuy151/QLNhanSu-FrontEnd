import { useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as Close } from "../../../resources/images/close-contained.svg";

import CommonDrawer from "../../../components/Common/Drawer";
import CommonButton from "../../../components/Common/Button";
import CommonFormItem from "../../../components/Common/FormItem";
import CommonForm from "../../../components/Common/Form";

import positionServices, { PositionAddParams } from "../../../services/positions.service";

export interface PositionCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentPosition: any,
}

const PositionCreateDrawer = ({ visible, onAddSuccessful, currentPosition, resetState }: PositionCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);


    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: PositionAddParams = {
            "description": values?.description,
            "allowance": values.allowance,
            "name": values?.name,
        }
        if (currentPosition) {
            resp = await positionServices.updatePosition(currentPosition.id, body);
        } else {
            resp = await positionServices.createPosition(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentPosition) {
                notification.success({
                    message: t('Thêm mới chức vụ thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa chức vụ thành công'),
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
            title={currentPosition ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa chức vụ')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới chức vụ')}</span>
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
                            {currentPosition ? t('common.button.save') : t('common.button.addNew')}
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
                    name: currentPosition?.name,
                    allowance: currentPosition?.allowance,
                    description: currentPosition?.description,
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
                                label={t('Tên chức vụ')}
                                placeholder={t('Nhập tên chức vụ') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Tên chức vụ') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={24}>
                            <CommonFormItem
                                name="allowance"
                                label={t('Trợ cấp chức vụ (VNĐ)')}
                                placeholder={t('Nhập trợ cấp chức vụ') as string}
                                rules={[
                                    { required: true, message: t('Vui lòng nhập Trợ cấp chức vụ') as string }
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

export default PositionCreateDrawer;