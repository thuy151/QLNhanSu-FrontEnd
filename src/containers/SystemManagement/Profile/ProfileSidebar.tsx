import React, { useCallback, useEffect, useState } from 'react'
import { Avatar } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Camera from "./CameraAntd";
import moment from 'moment';
import { DATE_FORMAT } from '../../../utils/constants';


import employeeServices from "../../../services/employees.service";

function ProfileSidebar() {
    const { t } = useTranslation();
    const {profile} = useSelector((state: any) => state?.profileReducer);
    const [employeeDetail, setEmployeeDetail] = useState<any>(undefined);

    const getData = useCallback(async ()=>{
        const resp = await  employeeServices.getFindByIdEmployee(profile?.employee?.id)
        const data = resp?.data;
        console.log("data",data)
        if (resp?.status === 200){
            setEmployeeDetail(data);
        }else{
            setEmployeeDetail(undefined);
        }
    },[profile?.employee?.id])

    useEffect(()=>{
        getData();
    },[getData]);

    return <div className="profile-page" style={{ marginTop: 0 }}>
        <div className="profile-page-sidebar">
            <div className="avatar-box-container">
                <div className="avatar-box">
                    {
                        employeeDetail?.avatar?.fileDownloadUri
                            ? <Avatar className="avatar" src={employeeDetail?.avatar?.fileDownloadUri} icon={<UserOutlined />} />
                            : <Avatar className="avatar" icon={<UserOutlined />} />
                    }
                    <Camera />
                </div>
            </div>


            <div className="profile-info">
                <div className="profile-info-full-name">{employeeDetail?.name}</div>
                <div className="profile-info-role">{employeeDetail?.position?.name}</div>
                <div className='profile-info-row'>
                    <div>
                        <span className='profile-info-account-label'>{t('Phòng ban')}</span>
                        <span className='profile-info-account-value'>{employeeDetail?.department?.name}</span>
                    </div>
                </div>
                <div className='profile-info-row'>
                    <div>
                        <span className='profile-info-account-label'>{t('profilePage.accountProfileTab.label.phoneNumber')}</span>
                        <span className='profile-info-account-value'>{employeeDetail?.phoneNumber}</span>
                    </div>
                </div>
                <div className='profile-info-row'>
                    <div>
                        <span className='profile-info-account-label'>{t('Ngày sinh')}</span>
                        <span className='profile-info-account-value'>{employeeDetail?.dob ? moment(employeeDetail?.dob).format(DATE_FORMAT) : ""}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ProfileSidebar;

