import { useSelector } from 'react-redux';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LocalStore from "./utils/localStorage";
import Layout from "./components/Layout";
import Profile from './containers/SystemManagement/Profile';
import Page404 from './containers/Page404';
import Login from './containers/Login';
import Account from './containers/SystemManagement/Account';
import Dashboard from './containers/Dashboard';
import Position from './containers/Categories/Position';
import Department from './containers/Categories/Department';
import Certificate from './containers/Categories/Certificate';
import DisciplineReward from './containers/Categories/DisciplineReward';
import Employee from './containers/Employee';
import Rest from './containers/Rest';
import Contract from './containers/Contract';
import EmployeeReward from './containers/EmployeeReward';
import CalculateSalary from './containers/Salary/components/CalculateSalary';
import Salary from './containers/Salary';
import SalaryReport from './containers/Reports/SalaryReport';
import EmployeeReport from './containers/Reports/EmployeeReport';

const MyRoutes = () => {
    const accessToken = LocalStore.getInstance().read('accessToken')
    const { profile } = useSelector((state: any) => state?.profileReducer);
    return (
        <Router>
            {
                accessToken
                ?
            <Routes>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                { profile?.scope === "ADMIN" && <Route path="/account" element={<Layout><Account /></Layout>} />}
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/employee" element={<Layout><Employee /></Layout>} />}
                <Route path="/rest" element={<Layout><Rest /></Layout>} />
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/contract" element={<Layout><Contract /></Layout>} />}
                <Route path="/discipline-reward-employee" element={<Layout><EmployeeReward/></Layout>} />
                { profile?.scope !== "EMPLOYEE" && <Route path="/calculate-salary" element={<Layout><CalculateSalary/></Layout>} /> }
                { profile?.scope !== "EMPLOYEE" && <Route path="/salary" element={<Layout><Salary/></Layout>} /> }
                { profile?.scope !== "EMPLOYEE" && <Route path="/report-salary" element={<Layout><SalaryReport/></Layout>} />} 
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/position" element={<Layout><Position /></Layout>} />}
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/department" element={<Layout><Department /></Layout>} />}
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/certificate" element={<Layout><Certificate /></Layout>} />}
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <Route path="/discipline-reward" element={<Layout><DisciplineReward /></Layout>} />}

                <Route path='*' element={<Page404 />} />
            </Routes>
            :
                <Routes>
                    <Route path="/" element={<Login />}/>
                    <Route path='*' element={<Page404/>} />
                </Routes>
            }
        </Router>
    );
}
export default MyRoutes
