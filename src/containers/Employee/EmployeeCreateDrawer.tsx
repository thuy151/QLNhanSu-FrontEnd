import { useCallback, useEffect, useState } from "react";
import { Avatar, Upload, Col, Form, Row, Space, notification, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment"
import ImgCrop from 'antd-img-crop';

import { ReactComponent as Close } from "../../resources/images/close-contained.svg";
import { ReactComponent as CameraIcon } from "../../resources/images/camera-icon.svg";

import CommonDrawer from "../../components/Common/Drawer";
import CommonButton from "../../components/Common/Button";
import CommonFormItem from "../../components/Common/FormItem";
import CommonForm from "../../components/Common/Form";
import { DATE_FORMAT, REGEX_EMAIL, REGEX_PHONE_NUMBER } from "../../utils/constants";

import employeeServices, { EmployeeAddParams } from "../../services/employees.service";
import departmentServices from "../../services/departments.service";
import certificateServices from "../../services/certificates.service";
import positionServices from "../../services/positions.service";
import { useSelector } from "react-redux";

export interface EmployeeCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentEmployee: any,
}

const EmployeeCreateDrawer = ({ visible, onAddSuccessful, currentEmployee, resetState }: EmployeeCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [departmentList, setDepartmentList] = useState<any[]>([]);
    const [positionList, setPositionList] = useState<any[]>([]);
    const [certificateList, setCertificateList] = useState<any[]>([]);
    const [fileAvatar, setFileAvatar] = useState<any>();
    const [fileAvatarData, setFileAvatarData] = useState<any>(undefined);
    const {
        profile
    } = useSelector((state:any) => state?.profileReducer);

    const onFinish = (values: any) => {
        onSubmit(values)
    }

    console.log("currentEmployee",currentEmployee)

    const getData = useCallback(async () => {
        if (currentEmployee) {
            setFileAvatar(currentEmployee?.avatar?.fileDownloadUri);
        }
    }, [currentEmployee])

    const getDepartmentData = async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            sortDirection: "name",
        }
        const resp = await departmentServices.getPageDepartment(paramsSearch);
        const data = resp?.data;

        console.log(data)
        if (resp?.status === 200) {
            setDepartmentList(data?.content?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setDepartmentList([])
        }
    }

    const getPositionData = async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            sortDirection: "name",
        }
        const resp = await positionServices.getPagePosition(paramsSearch);
        const data = resp?.data;

        console.log(data)
        if (resp?.status === 200) {
            setPositionList(data?.content?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setPositionList([])
        }
    }

    const getCertificateData = async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            sortDirection: "name",
        }        
        const resp = await certificateServices.getPageCertificate(paramsSearch);
        const data = resp?.data;

        console.log(data)
        if (resp?.status === 200) {
            setCertificateList(data?.content?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setCertificateList([])
        }
    }

    useEffect(() => {
        getData();
        getDepartmentData();
        getPositionData();
        getCertificateData();
    }, [getData])

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: EmployeeAddParams = {
            cccd: values?.cccd,
            gender: values?.gender,
            permanentAddress: values?.permanentAddress,
            insuranceCode: values?.insuranceCode,
            education: values?.education,
            name: values?.name,
            status: values?.status,
            address: values?.address,
            dob: moment(values?.dob).format('YYYY-MM-DD HH:mm:ss'),
            phoneNumber: values?.phoneNumber,
            email: values?.email,
            avatar: fileAvatarData,
            specialize: values?.specialize,
            certificateIds: values?.certificateIds,
            positionId: values?.positionId,
            departmentId: values?.departmentId,
            disciplineRewardIds: []
        }
        console.log("body",body)
        if (currentEmployee) {
            body.dob = moment(values?.dob).format('YYYY-MM-DD');
            delete body.avatar;
            resp = await employeeServices.updateEmployee(currentEmployee.id, body);
        } else {
            if(!fileAvatarData){
                notification.error({
                    message: t('Avatar không được để trống'),
                });
                setIsSubmitLoading(false)
                return;
            }
            resp = await employeeServices.createEmployee(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentEmployee) {
                notification.success({
                    message: t('Thêm mới nhân viên thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa nhân viên thành công'),
                });
                if(profile?.employee?.id === currentEmployee?.id){
                    window.location.reload();
                }
            }
            onAddSuccessful();
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        setIsSubmitLoading(false)
    }

    const onUploadFile = async (options: any) => {
        if (!options?.file) {
            setFileAvatar(undefined);
            setFileAvatarData(undefined);
            return
        }
        
        console.log("options?.file", options?.file)
        const reader = new FileReader()
        reader.readAsDataURL(options?.file)
        reader.onload = () => {
            console.log('called: ', reader)
            setFileAvatar(reader.result);
        }
        if(currentEmployee){
            const resp = await employeeServices.updateAvatarEmployee({
                id: currentEmployee.id, 
                avatar: options?.file
            });
            setIsChangeAvatar(true)
            if (resp?.status === 200) {
                notification.success({
                    message: t('Cập nhật ảnh đại diện thành công'),
                });
            }else{
                notification.error({
                    message: t('Cập nhật ảnh đại diện thất bại. Vui lòng tải lại ảnh!'),
                });
            }
        }else{
            setFileAvatarData(options?.file);
        }
    }

    const onClose = () => {
        if(isChangeAvatar){
            onAddSuccessful()
        }else{
            resetState();
        }
    }

    return (
        <CommonDrawer
            closable={false}
            mask={true}
            maskClosable={false}
            width={'60%'}
            title={currentEmployee ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa nhân viên')}</span>
                    <Close onClick={onClose} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới nhân viên')}</span>
                    <Close onClick={onClose} />
                </div>}
            placement="right"
            open={visible}
            onClose={onClose}
            footer={[
                <Row className='row-drawer' key='footer'>
                    <Space>
                        <CommonButton
                            key="close"
                            btnType='default'
                            size="large"
                            onClick={onClose}
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
                            {currentEmployee ? t('common.button.save') : t('common.button.addNew')}
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
                    cccd: currentEmployee?.cccd,
                    gender: currentEmployee ? currentEmployee?.gender : 0,
                    permanentAddress: currentEmployee?.permanentAddress,
                    insuranceCode: currentEmployee?.insuranceCode,
                    education: currentEmployee?.education,
                    name: currentEmployee?.name,
                    status: currentEmployee ? currentEmployee?.status : true,
                    address: currentEmployee?.address,
                    dob: currentEmployee ? moment(currentEmployee?.dob) : undefined,
                    phoneNumber: currentEmployee?.phoneNumber,
                    email: currentEmployee?.email,
                    specialize: currentEmployee?.specialize,
                    positionId: currentEmployee?.position?.id,
                    departmentId: currentEmployee?.department?.id,
                }}
            >
                <div className="detail-page-box">
                    <Row gutter={20}>
                        <Col span={24}>
                            <div className="avatar-box-container" style={{paddingTop: 2}}>
                                <div className="avatar-box">
                                    {fileAvatar
                                        ? <Avatar className="avatar" src={fileAvatar} icon={<UserOutlined />} />
                                        :
                                        <Avatar className="avatar" icon={<UserOutlined />} />
                                    }
                                    <div className="avatar-change-icon">
                                        <ImgCrop showGrid rotationSlider aspectSlider showReset>
                                            <Upload
                                                fileList={[]}
                                                customRequest={onUploadFile}
                                            >
                                                <CameraIcon />
                                            </Upload>
                                        </ImgCrop>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="name"
                                label={t('Họ và tên')}
                                placeholder={t('Nhập họ và tên') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Họ và tên') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="dob"
                                label={t('Ngày sinh')}
                                placeholder={t('Nhập ngày sinh') as string}
                                rules={[
                                    { required: true, message: t('Vui lòng nhập Ngày sinh') as string }
                                ]}
                                type='datePicker'
                                disabledDate={(current: any) => current > moment().endOf("day")}
                                showRequiredIcon={true}
                                format={DATE_FORMAT}
                            />
                        </Col>

                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="phoneNumber"
                                label={t('Số điện thoại')}
                                placeholder={t('Nhập số điện thoại') as string}
                                rules={[
                                    { pattern: new RegExp(REGEX_PHONE_NUMBER), message: t('Số điện thoại gồm 10 chữ số') as string },
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Số điện thoại') as string }
                                ]}
                                maxLength={10}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="gender"
                                label={t('Giới tính')}
                            >
                                <Radio.Group >
                                    <Radio value={0}>Nam</Radio>
                                    <Radio value={1}>Nữ</Radio>
                                </Radio.Group>
                            </CommonFormItem>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="cccd"
                                label={t('Số CCCD')}
                                placeholder={t('Nhập số CCCD') as string}
                                rules={[
                                    { pattern: new RegExp(REGEX_PHONE_NUMBER), message: t('Số CCCD gồm 12 chữ số') as string },
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Số CCCD') as string }
                                ]}
                                maxLength={12}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="email"
                                label={t('Email')}
                                placeholder={t('Nhập email') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Email') as string },
                                    { pattern : REGEX_EMAIL, message: "Email phải có dạng 'abc@gmail.com'"}
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="insuranceCode"
                                label={t('Mã số BHYT')}
                                placeholder={t('Nhập mã số BHYT') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Mã số BHYT') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="address"
                                label={t('Quê quán')}
                                placeholder={t('Nhập quê quán') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Quê quán') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="permanentAddress"
                                label={t('Địa chỉ thường trú')}
                                placeholder={t('Nhập địa chỉ thường trú') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Địa chỉ thường trú') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="specialize"
                                label={t('Chuyên ngành')}
                                placeholder={t('Nhập chuyên ngành') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Chuyên ngành') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="education"
                                label={t('Học vấn')}
                                placeholder={t('Nhập học vấn') as string}
                                rules={[
                                    { required: true, whitespace: true, message: t('Vui lòng nhập Học vấn') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={12}>
                            <CommonFormItem
                                name="departmentId"
                                label={t('Phòng ban')}
                                placeholder={t('Chọn phòng ban') as string}
                                rules={[
                                    { required: true,  message: t('Vui lòng nhập Phòng ban') as string }
                                ]}
                                showRequiredIcon={true}
                                type= "select"
                                options={departmentList}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <CommonFormItem
                                name="positionId"
                                label={t('Chức vụ')}
                                placeholder={t('Chọn chức vụ') as string}
                                rules={[
                                    { required: true, message: t('Vui lòng nhập Chức vụ') as string }
                                ]}
                                showRequiredIcon={true}
                                type= "select"
                                options={positionList}
                            />
                        </Col>
                        { !currentEmployee?.id ?
                            <Col span={12}>
                                <CommonFormItem
                                    name="certificateIds"
                                    label={t('Chứng chỉ')}
                                    placeholder={t('Chọn chứng chỉ') as string}
                                    rules={[
                                        { required: true, message: t('Vui lòng nhập Chứng chỉ') as string }
                                    ]}
                                    showRequiredIcon={true}
                                    type= "select"
                                    mode="multiple"
                                    options={certificateList}
                                />
                            </Col> :<></>
                        }
                        <Col span={12}>
                            <CommonFormItem
                                name="status"
                                label={t('Trạng thái làm việc')}
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

export default EmployeeCreateDrawer;