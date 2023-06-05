import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Avatar, Col, Radio, Row, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';

import { ReactComponent as CameraIcon } from "../../../resources/images/camera-icon.svg";

import CommonForm from '../../../components/Common/Form';
import CommonFormItem from '../../../components/Common/FormItem';
import { DATE_FORMAT, REGEX_EMAIL, REGEX_PHONE_NUMBER } from '../../../utils/constants';

import departmentServices from "../../../services/departments.service";
import certificateServices from "../../../services/certificates.service";
import positionServices from "../../../services/positions.service";

function EmployeeInfoTab(props:any) {
    const {form, currentEmployee, onFinish, fileAvatar, onUploadFile} = props;
    const [departmentList, setDepartmentList] = useState<any[]>([]);
    const [positionList, setPositionList] = useState<any[]>([]);
    const [certificateList, setCertificateList] = useState<any[]>([]);
    const { t } = useTranslation();
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
        getDepartmentData();
        getPositionData();
        getCertificateData();
    }, [])
    return (
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
                hsl: currentEmployee?.hsl,
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
                            name="hsl"
                            label={t('Hệ số lương')}
                            placeholder={t('Nhập hệ số lương') as string}
                            rules={[
                                {required: true, message: t('Vui lòng nhập Hệ số lương') as string }
                            ]}
                            showRequiredIcon={true}
                            type="inputNumber"
                            min={1.0}
                        />
                    </Col>
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
    )
}

export default EmployeeInfoTab