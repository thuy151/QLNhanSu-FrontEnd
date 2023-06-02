import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as AccountIcon } from "../../../resources/images/user.svg";

import accountsServices from "../../../services/users.service";

function AccountCard() {
    const [accountList, setAccountList] = useState<any[]>([]);
    const navigate = useNavigate()

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await accountsServices.getPageAccount(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setAccountList(data?.content)
        } else {
            setAccountList([])
        }
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    return (
        <Col span={6} xs={12} sm={12} lg={8} xl={6} xxl={6} onClick={()=>navigate("/account")}>
            <div className='dashboard-container success' style={{minHeight:0}}>
                <div className="dashboard-tag-wrapper">
                    <AccountIcon/>
                    <div className="title">TÀI KHOẢN
                    <div style={{fontWeight:900, marginTop: 2}}>{accountList?.length}</div>
                    </div>
                    <div className='footer'>
                        <div className="first" >Hoạt động {accountList?.filter((item:any)=>item.status===0)?.length}</div>
                        <div className="second" >Không hoạt động {accountList?.filter((item:any)=>item.status===1)?.length}</div>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default AccountCard