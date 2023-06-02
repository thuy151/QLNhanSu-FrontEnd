import React, { useState, useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Tabs} from 'antd';
import type { TabsProps } from 'antd';

import AccountProfile from "./AccountProfile";
import AccountChangePassword from "./AccountChangePassword";
import CommonConfirmModal from '../../../../components/Common/ConfirmModal';
import { useQuery } from '../../../../utils/customHooks';
import { buildQueryString } from '../../../../utils/utilFunctions';

function Profile (props:any) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryObj:any = useQuery();
    const {params = {}} = queryObj
    const {
        tab: tabQuery,
    } = params
    const nextKey = useRef<string>("");
    const accountProfileRef = useRef<any>(null);
    const accountChangePasswordRef = useRef<any>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string>('account-profile');

    useEffect(()=>{
        console.log("tabQuery",tabQuery);
        setActiveKey(tabQuery);
    },[tabQuery])

    const items: TabsProps['items'] = [
        {
            key: 'account-profile',
            label: t('profilePage.accountProfileTab.title'),
            children: <AccountProfile ref={accountProfileRef}/>,
        },
        {
            key: 'change-password',
            label: t('profilePage.changePasswordTab.title'),
            children: <AccountChangePassword ref={accountChangePasswordRef}/>,
        }
    ];

    const onChange = (key: string) => {
        if (!accountProfileRef?.current?.isEdit && !accountChangePasswordRef?.current?.formChanged) {
            let queryString = buildQueryString({
                tab: key
            })
            navigate(`${queryString || ''}`);
        }
    };

    const onTabClick = (key: string) => {
        if (key !== activeKey) {
            if (accountProfileRef?.current?.isEdit || accountChangePasswordRef?.current?.formChanged) {
                setModalVisible(true);
                nextKey.current = key;
            } else {
                setActiveKey(key)
            }
        }
    };

    const onOk = () => {
        if (accountProfileRef?.current?.isEdit && accountProfileRef?.current?.onClear) {
            accountProfileRef?.current?.onClear()
        }
        if (accountChangePasswordRef?.current?.formChanged && accountChangePasswordRef?.current?.onClear) {
            accountChangePasswordRef?.current?.onClear()
        }
        setActiveKey(nextKey.current);
        setModalVisible(false);
        let queryString = buildQueryString({
            tab: nextKey.current,
        })
        navigate(`${queryString || ''}`);
    }



    return <div className="profile-body">
        <Tabs activeKey={activeKey} items={items} onChange={onChange} onTabClick={onTabClick} />
        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => setModalVisible(false)}
                visible={modalVisible}
                content={<span>{t('profilePage.messageConfirm')}</span>}
            /> : <></>
        }
    </div>
}

export default Profile;

