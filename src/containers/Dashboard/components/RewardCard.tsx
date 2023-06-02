import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as RewardEmployeeIcon } from "../../../resources/images/reward-employee.svg";

import employeeRewardServices from "../../../services/employeeRewards.service";

function RewardCard() {
    const [rewardList, setRewardList] = useState<any[]>([]); //lưu lại list  khen thưởng kỉ luật chỉ dùng trong component này
    const navigate = useNavigate()

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeRewardServices.getPageEmployeeReward(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setRewardList(data?.content)
        } else {
            setRewardList([])
        }
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    return (
        <Col span={6} xs={12} sm={12} lg={8} xl={6} xxl={6} onClick={()=>navigate("/discipline-reward-employee")}>
            <div className='dashboard-container warning' style={{minHeight:0}}>
                <div className="dashboard-tag-wrapper">
                    <RewardEmployeeIcon/>
                    <div className="title">KHEN THƯỞNG - KỶ LUẬT
                    <div style={{fontWeight:900, marginTop: 2}}>{rewardList?.length}</div>
                    </div>
                    <div className='footer'>
                        <div className="first" >Khen thưởng {rewardList?.filter((item:any)=>item?.disciplineReward?.isReward)?.length}</div>
                        <div className="second" >Kỷ luật {rewardList?.filter((item:any)=>!item?.disciplineReward?.isReward)?.length}</div>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default RewardCard