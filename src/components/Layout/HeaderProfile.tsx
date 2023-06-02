import React, { useState, useCallback, useEffect } from 'react';
import {Avatar, Dropdown, Space} from 'antd';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {UserOutlined} from "@ant-design/icons";

import LocalStorage from "../../utils/localStorage";
import employeeServices from "../../services/employees.service";

function DashboardSearch() {
    const { t } = useTranslation();
    const navigate= useNavigate();
    const {
        profile
    } = useSelector((state:any) => state?.profileReducer);
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

    const logout = () => {
        window.location.href = '/'
        LocalStorage.getInstance().save('accessToken', null);
    }

    const itemsDropdownProfile = [
        {
            key: '1',
            label: (
                <div onClick={()=> navigate("/profile?tab=account-profile")}>
                    {t('layout.header.personalInfo')}
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={()=> navigate("/profile?tab=change-password")}>
                    {t('layout.header.changePassword')}
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={logout}>
                    {t('layout.header.logout')}
                </div>
            ),
        },
    ];

    return <Dropdown menu={{ items: itemsDropdownProfile }} trigger={["click"]}>
        <Space className="cursor-pointer">
            {
                employeeDetail?.avatar?.fileDownloadUri
                    ? <Avatar className="header-avatar" src={employeeDetail?.avatar?.fileDownloadUri} icon={<UserOutlined />} />
                    : <Avatar className="header-avatar" icon={<UserOutlined />} />
            }
            {/* <Avatar className="header-avatar" src={profile?.avatar} icon={<UserOutlined />} /> */}
        </Space>
    </Dropdown>;
}

export default DashboardSearch;

