import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ContractIcon } from "../../../resources/images/contract.svg";

import contractServices from "../../../services/contracts.service";

function ContractCard() {
    const [contractList, setContractList] = useState<any[]>([]);
    const navigate = useNavigate()

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await contractServices.getPageContract(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setContractList(data?.content)
        } else {
            setContractList([])
        }
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    return (
        <Col span={6} xs={12} sm={12} lg={8} xl={6} xxl={6} onClick={()=>navigate("/contract")}>
            <div className='dashboard-container danger' style={{minHeight:0}}>
                <div className="dashboard-tag-wrapper">
                    <ContractIcon/>
                    <div className="title">HỢP ĐỒNG 
                    <div style={{fontWeight:900, marginTop: 2}}>{contractList?.length}</div>
                    </div>
                    <div className='footer'>
                        <div className="first" >Chính thức {contractList?.filter((item:any)=>item.status)?.length}</div>
                        <div className="second" >Thử việc {contractList?.filter((item:any)=>!item.status)?.length}</div>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default ContractCard