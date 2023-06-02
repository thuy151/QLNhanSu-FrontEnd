import React, {useEffect, useRef, useState} from 'react'
import { Button, Form, Checkbox, Input, Select, Row, Col, Modal } from 'antd';
import userServices from "../../services/users.service";
import LocalStorage from "../../utils/localStorage";
import { useTranslation } from "react-i18next";
import {useDispatch} from "react-redux";
import jwt_decode from 'jwt-decode';

import background from "../../resources/images/login/background-login.jpg";
import { ReactComponent as Logo } from "../../resources/images/logo_small.svg";

import {LANGUAGE_LIST} from "../../utils/constants";
import {saveProfile} from "../../redux/actions/profile.actions";
import CommonModal from '../../components/Common/Modal';
import CommonForm from '../../components/Common/Form';
import CommonFormItem from './../../components/Common/FormItem';
import ResetPassword from './ResetPassword';

const localLanguage = LocalStorage.getInstance().read('language');
function Login() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const formRef = useRef<any>()
    const [currentLanguage, setCurrentLanguage] = useState(localLanguage || LANGUAGE_LIST[0]?.value);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showResetPassword, setShowResetPassword] = useState<boolean>(false)

    useEffect(() => {
        dispatch(saveProfile(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // hàm login 
    const onFinish = async (values:any) => {
        setIsLoading(true);
        const resp = await userServices.login(values); 
        const data = resp?.data;
        if (resp?.status === 200) {
            LocalStorage.getInstance().save('accessToken', data?.access_token); // nếu thành công thì lưu token vào local..
            getProfile(data?.access_token) 
        } else {
            if (formRef?.current) {
                formRef?.current?.setFields([
                    {
                        name: 'username',
                        errors: [''],
                    },
                    {
                        name: 'password',
                        errors: [t('login.wrongPassword')],
                    },
                ]);
            }
        }
        setIsLoading(false);
    };
    // giải mã token
    const getProfile = async (token:any) => {
        const user = await jwt_decode(token);
        dispatch(saveProfile(user)) //lưu vào redux
        const redirectUrl = LocalStorage.getInstance().read('redirectUrl');
        if (redirectUrl) {
            LocalStorage.getInstance().save('redirectUrl', null);
            window.location.href = redirectUrl
        } else {
            window.location.reload()
        }
    }

    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-container" style={{backgroundImage: `url(${background})` }}>
            <div className="login-box">
                <div className="text-center">
                    <Logo className="style-size-logo"/>
                </div>

                {/* <h3 className="txt-welcome">{t('login.welcome')}</h3> */}
                <h2 className="txt-title">{t('login.title')}</h2>
                <Form
                    ref={formRef}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    size={'large'}
                >
                    <Form.Item
                        name="username"
                        validateTrigger={"onBlur"}
                        rules={[{ required: true, message: t('validate.usernameRequired') as string }]}
                    >
                        <Input
                            placeholder={t('login.usernamePlaceholder') as string}
                            allowClear
                            maxLength={50}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        validateTrigger={"onBlur"}
                        rules={[{ required: true, message: t('validate.passwordRequired') as string }]}
                    >
                        <Input.Password
                            placeholder={t('login.passwordPlaceholder') as string}
                            maxLength={20}
                        />
                    </Form.Item>

                    <Row>
                        <Col span={12}>
                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>{t('login.rememberLabel')}</Checkbox>
                            </Form.Item>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="forgetPass" >
                                <div 
                                    style={{textAlign: "end", fontWeight: 700, color: "white", cursor: "pointer"}}
                                    onClick={()=> setShowResetPassword(true)}
                                >
                                    Quên mật khẩu?
                                </div>
                            </Form.Item>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Button loading={isLoading} type="primary" className="btn-login" htmlType="submit">
                                {t('login.submit')}
                            </Button>
                        </Col>
                    </Row>

                    { showResetPassword ?
                        <ResetPassword
                            open={showResetPassword}
                            onCancel={()=> setShowResetPassword(false)}
                        />
                        : <></>
                    }
                </Form>
            </div>
        </div>
    );
}

export default Login;

