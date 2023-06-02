import { Col } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as EmployeeIcon } from "../../../resources/images/staff.svg";

function EmployeeCard(props: any) {
    const {employeeList}= props;
    const navigate = useNavigate();

    return (
        <Col span={6} xs={12} sm={12} lg={8} xl={6} xxl={6} onClick={()=>navigate("/employee")}>
            <div className='dashboard-container info' style={{minHeight:0}}>
                <div className="dashboard-tag-wrapper">
                    <EmployeeIcon/>
                    <div className="title">NHÂN VIÊN 
                    <div style={{fontWeight:900, marginTop: 2}}>{employeeList?.length}</div>
                    </div>
                    <div className='footer'>
                        <div className="first" >Đang làm {employeeList?.filter((item:any)=>item.status)?.length}</div>
                        <div className="second" >Đã nghỉ {employeeList?.filter((item:any)=>!item.status)?.length}</div>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default EmployeeCard