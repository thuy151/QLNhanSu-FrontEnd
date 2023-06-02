import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Col, Form, Grid, Input, List, Row, Space, notification } from "antd";

import { ReactComponent as Checkbox } from "../../../../resources/images/checkbox-circle.svg";
import { ReactComponent as Error } from "../../../../resources/images/error.svg";
import CommonForm from "../../../../components/Common/Form";
import CommonButton from "../../../../components/Common/Button";
import LocalStorage from "../../../../utils/localStorage";
import { AT_LEAST_1_NUMBER, AT_LEAST_8_CHARS, REGEX_PASSWORD } from '../../../../utils/constants';

import userServices from "../../../../services/users.service";

export type StatusTypes = "error" | "success" | "warning" | "info";

// const atLeast8Chars = /^.{8,}$/;    // Ít nhất 8 kí tự
// const atLeast1Uppercase = /^(?=.*[A-Z]).*$/;    // Ít nhất 1 kí tự viết hoa
// const atLeast1Number = /^(?=.*\d).*$/;  // Ít nhất 1 số
// const passwordPattern = /^(?=.*\d).{8,}$/;
// const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function AccountChangPassword(props:any, ref:any){
    const { t } = useTranslation();
    const [activeIndexes, setActiveIndexes] = useState<number[]>([]);
    const [repeatError, setRepeatError] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);    const {
        profile
    } = useSelector((state:any) => state?.profileReducer);
    const screens = Grid.useBreakpoint();
    const [form] = Form.useForm();
    const newPassword = Form.useWatch("newPassword", form);
    
    useImperativeHandle(ref, () => ({
        formChanged,
        onClear
    }));

    const ListItems = [
        t('profilePage.changePasswordTab.condition.atLeast8Chars'),
        // t('profilePage.changePasswordTab.condition.atLeast1Uppercase'),
        t('profilePage.changePasswordTab.condition.atLeast1Number'),
    ]

    useEffect(() => {
        if (newPassword) {
            let newActiveIndexes: number[] = [];
            if (newPassword.match(AT_LEAST_8_CHARS)) {
                newActiveIndexes.push(0);
            }

            // if (newPassword.match(atLeast1Uppercase)) {
            //     newActiveIndexes.push(1);
            // }

            if (newPassword.match(AT_LEAST_1_NUMBER)) {
                newActiveIndexes.push(1);
            }
            setActiveIndexes(newActiveIndexes);
        } else {
            setActiveIndexes([]);
        }
    }, [newPassword])

    const onFinish = async (values: any) => {
        setIsLoading(true);
        const resp = await userServices.changePassword({...values, username: profile?.username});
        if (resp?.status === 200) {
            notification.success({
                message: t('accountPage.form.message.changePasswordSuccess'),
            });
            LocalStorage.getInstance().save('accessToken', null);
            window.location.href = '/';
        } 
        else {
            notification.error({
                message: resp?.data?.message || t('commonError.oopsSystem'),
            });
        }
        setIsLoading(false);
    }

    const onValuesChange = (changedValues: any) => {
        setFormChanged(true);
    }

    const onCancel = () => {
        form.resetFields();
    }
    
    const onClear = () => {
        form.resetFields();
        setFormChanged(false);
    }

    return (
        <>
            <div className="profile-tab-content">
                <div className="profile-tab-content-header">
                    <div className="profile-tab-content-header-left">
                        {t('profilePage.changePasswordTab.title')}
                    </div>
                </div>
                <CommonForm
                    form={form}
                    layout="vertical"
                    name="change-password"
                    requiredMark={false}
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                    scrollToFirstError={{ behavior: 'smooth'}}
                >
                    <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} order={screens.xs ? 2 : 1}>
                            <Form.Item
                                validateTrigger={["onChange", "onBlur"]}
                                name="currentPassword"
                                label={t('profilePage.changePasswordTab.label.currentPassword')}
                                rules={[
                                    { required: true, message: t('profilePage.changePasswordTab.validate.currentPassword') as string }
                                ]}
                            >
                                <Input.Password allowClear />
                            </Form.Item>
                            <Form.Item
                                validateTrigger={["onChange", "onBlur"]}
                                name="newPassword"
                                label={t('profilePage.changePasswordTab.label.newPassword')}
                                rules={[
                                    { required: true, message: t('profilePage.changePasswordTab.validate.newPassword') as string },
                                    { pattern: REGEX_PASSWORD, message: "" }
                                ]}
                            >
                                <Input.Password allowClear />
                            </Form.Item>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                validateTrigger={["onChange", "onBlur"]}
                                name="confirmPassword"
                                label={t('profilePage.changePasswordTab.label.reNewPassword')}
                                rules={[
                                    { required: true, message: t('profilePage.changePasswordTab.validate.reNewPassword') as string  },

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                setRepeatError(false);
                                                return Promise.reject();
                                            }

                                            if (getFieldValue('newPassword') !== value) {
                                                setRepeatError(true)
                                                return Promise.reject();
                                            }
                                            setRepeatError(false);
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password allowClear />
                            </Form.Item>
                            {repeatError ? <p className="password-error">{t('profilePage.changePasswordTab.validate.mismatched')}</p> : <></>}
                        </Col>
                        <Col xs={24} sm={12} order={screens.xs ? 1 : 2} style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="change-password-condition">
                                <div className="change-password-condition-title">{t('profilePage.changePasswordTab.label.requirementNewPassword')}</div>
                                <List
                                    split={false}
                                    dataSource={ListItems}
                                    renderItem={(item, index) => (
                                        <List.Item
                                            className={activeIndexes.includes(index) ? "password-condition-active" : newPassword ? "password-condition-error" : ""}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            {newPassword && !activeIndexes.includes(index) ?
                                                <><Error />{item}</> :
                                                <><Checkbox />{item}</>}
                                        </List.Item>
                                    )} />
                            </div>
                        </Col>
                    </Row>
                    <Space size={16} style={{ marginTop: 24 }}>
                        <CommonButton size={'small'} onClick={onCancel}>{t('common.button.cancel')}</CommonButton>
                        <CommonButton size={'small'} loading={isLoading} btnType="primary" htmlType="submit">{t('common.button.update')}</CommonButton>
                    </Space>
                </CommonForm>
            </div>
        </>
    )
}

export default forwardRef(AccountChangPassword);