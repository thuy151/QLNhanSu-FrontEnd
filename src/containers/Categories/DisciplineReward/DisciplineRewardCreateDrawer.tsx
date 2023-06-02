import { useState } from "react";
import { Col, Form, Row, Space, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as Close } from "../../../resources/images/close-contained.svg";

import CommonDrawer from "../../../components/Common/Drawer";
import CommonButton from "../../../components/Common/Button";
import CommonFormItem from "../../../components/Common/FormItem";
import CommonForm from "../../../components/Common/Form";

import disciplineRewardServices, { DisciplineRewardAddParams } from "../../../services/disciplineRewards.service";
import { useWatch } from "antd/es/form/Form";

export interface DisciplineRewardCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentDisciplineReward: any,
}

const DisciplineRewardCreateDrawer = ({ visible, onAddSuccessful, currentDisciplineReward, resetState }: DisciplineRewardCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const checkIsReward = useWatch("isReward", form);


    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: DisciplineRewardAddParams = {
            "description": values?.description,
            "name": values?.name,
            "isReward": values?.isReward
        }
        if (currentDisciplineReward) {
            resp = await disciplineRewardServices.updateDisciplineReward(currentDisciplineReward.id, body);
        } else {
            resp = await disciplineRewardServices.createDisciplineReward(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentDisciplineReward) {
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
            title={currentDisciplineReward ?
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
                        <CommonButton
                            key="update"
                            btnType='primary'
                            size="large"
                            onClick={() => form.submit()}
                            loading={isSubmitLoading}
                        >
                            {currentDisciplineReward ? t('common.button.save') : t('common.button.addNew')}
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
                    name: currentDisciplineReward?.name,
                    allowance: currentDisciplineReward?.allowance,
                    description: currentDisciplineReward?.description,
                    isReward: currentDisciplineReward ? (currentDisciplineReward?.isReward === 0 ? true : false) : true
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
                                label={checkIsReward ? t('Nội dung khen thưởng') : t('Nội dung kỷ luật')}
                                placeholder={checkIsReward ? t('Nhập nội dung khen thưởng') as string : t('Nhập nội dung kỷ luật') as string}
                                rules={checkIsReward ? [{ whitespace: true, required: true, message: t('Vui lòng nhập Nội dung khen thưởng') as string }]
                                    :
                                    [{ whitespace: true, required: true, message: t('Vui lòng nhập Nội dung ky luật') as string }]
                                }
                                showRequiredIcon={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
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
                    <Row gutter={20} style={{ marginTop: 50 }}>
                        <Col span={24}>
                            <CommonFormItem
                                name="isReward"
                                label={t('Khen thưởng')}
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

export default DisciplineRewardCreateDrawer;