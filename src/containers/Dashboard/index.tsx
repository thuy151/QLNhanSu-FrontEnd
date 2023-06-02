
import { useCallback, useEffect, useState } from "react";
import { Row } from "antd";
import EmployeeCard from './components/EmployeeCard';
import ContractCard from "./components/ContractCard";
import RewardCard from "./components/RewardCard";
import AccountCard from "./components/AccountCard";
import PieChartEmployeeDepartment from "./components/PieChartEmployeeDepartment";
import PieChartEmployeePosition from "./components/PieChartEmployeePosition";

import employeeServices from "../../services/employees.service";

function Dashboard(){
    const [employeeList, setEmployeeList] = useState<any[]>([]);

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeServices.getPageEmployee(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setEmployeeList(data?.content)
        } else {
            setEmployeeList([])
        }
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    return (
        <>
            <Row gutter={8}>
                <EmployeeCard employeeList={employeeList}/>
                <ContractCard/>
                <RewardCard/>
                <AccountCard/>
            </Row>

            <Row gutter={8}>
                <PieChartEmployeeDepartment employeeList={employeeList}/>
                <PieChartEmployeePosition employeeList={employeeList}/>
            </Row>
        </>
        
    )
}

export default Dashboard;
