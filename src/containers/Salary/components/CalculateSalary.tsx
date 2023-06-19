import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Form, Space, notification } from "antd";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useWatch } from 'antd/es/form/Form';

import CommonButton from "../../../components/Common/Button";
import CommonForm from "../../../components/Common/Form";
import CommonFormItem from '../../../components/Common/FormItem';
import CommonFormEditor from '../../../components/Common/FormEditor';

import employeeServices from "../../../services/employees.service";
import salaryServices from "../../../services/salaries.service";
import contractServices from "../../../services/contracts.service";

function CalculateSalary(props: any) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [dataList, setDateList] = useState<any[]>([]);
    const [checkContract, setCheckContract] = useState<number[]>([]);
    const empIdWatch = useWatch('empId', form);

    const getData = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeServices.getPageEmployee(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            const newData:any[] = data?.content?.filter((item:any)=>item.status===true && checkContract.includes(item?.id));
            setDateList(newData)
            setEmployeeList(newData?.map((item:any)=>({value: item.id, label: item.name})))
        } else {
            setEmployeeList([]);
            setDateList([])
        }
    },[checkContract])

    const getDataContract = async()=>{
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await contractServices.getPageContract(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setCheckContract(data?.content?.map((item:any)=>item?.employee?.id))
        } else {
            setCheckContract([])
        }
    }
    useEffect(()=>{
        getDataContract()
    },[])

    useEffect(()=>{
        getData();
    },[getData])

    useEffect(()=>{
        const currentEmp = dataList?.find((item:any)=>item?.id === empIdWatch)
        form.setFieldValue("hsl",currentEmp?.hsl)
    },[dataList, empIdWatch,form])

    const onFinish = (values: any) => {
        checkSalaryEmpl(values);
        handleCalculate(values);
    }

    const checkSalaryEmpl = async (values:any) =>{
        const currentSalary = await salaryServices.getPageSalary({
            currentPageNumber:0,
            pageSize:100
        });
        const data = currentSalary?.data?.content;
        if(data){
            const currentEmp = data?.find((item:any) => item?.employee?.id === values?.empId
                                                            && item?.month === moment(values?.calculateDate).month()+1
                                                            && item?.year === moment(values?.calculateDate).year())
            console.log("currentEmp",currentEmp)   
            if(currentEmp){
                return true
            }                                           
        }
        return false;
    }

    const handleCalculate = async (values:any)=>{

        // check xem nhân viên được tính lương ở tháng hiện tại chưa
        const currentSalary = await salaryServices.getPageSalary({
            currentPageNumber:0,
            pageSize:100
        });
        const dataCheck = currentSalary?.data?.content;
        if(dataCheck){
            const currentEmp = dataCheck?.find((item:any) => item?.employee?.id === values?.empId
                                                            && item?.month === moment(values?.calculateDate).month()+1
                                                            && item?.year === moment(values?.calculateDate).year())
            console.log("currentEmp",currentEmp)   
            if(currentEmp){
                notification.error({
                    message: `Nhân viên '${currentEmp?.employee?.name}' đã được tính lương của tháng ${moment(values?.calculateDate).month()+1} năm ${moment(values?.calculateDate).year()}!`
                })
                return;
            }                                           
        }

        const body = {
            ...values,
            month: moment(values?.calculateDate).month()+1, // vì moment tính month từ 0 (0,1,...11)<=>(tháng 1,....,tháng 12)
            year: moment(values?.calculateDate).year(), 
        }
        delete body?.calculateDate;
        delete body?.hsl;
        console.log(body)
        const resp = await salaryServices.createSalary(body);
        const data = resp.data;
        if(resp.status === 200){
            notification.success({
                message: "Tính lương thành công!"
            })
            form.resetFields()
            navigate("/salary")
        }else{
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
    }

    return <div className="avic-search-box">
        <div className="advance-search-box">
                    <div
                        className="close-advance-search-btn cursor-pointer"
                        onClick={() => {
                        }}
                    >
                        <div>
                            {t('Tính lương nhân viên')}
                        </div>
                    </div>

                    <CommonForm
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Row gutter={30}>
                            <Col span={24}>
                                <CommonFormItem
                                    name="empId"
                                    label="Nhân viên"
                                    placeholder={"Chọn nhân viên"}
                                    rules={[{ required: true,  message: "Vui lòng chọn nhân viên"}]}
                                    showRequiredIcon
                                    type="select"
                                    options={employeeList}
                                />
                            </Col>
                            <Col span={24}>
                                <CommonFormItem
                                    name="hsl"
                                    label="Hệ số lương"
                                    placeholder={"Hệ số lương tự động fill"}
                                    type="inputNumber"
                                    disabled={true}
                                />
                            </Col>
                            <Col span={24} style={{zIndex: 100}}>
                                <CommonFormItem
                                    name="workdayCount"
                                    label={t('Số ngày công')}
                                    placeholder={t('Nhập số ngày công') as string}
                                    rules={[{ required: true,  message: "Vui lòng nhập Số ngày công"}]}
                                    showRequiredIcon
                                    type="inputNumber"
                                    min={0}
                                />
                            </Col>
                            <Col span={24} style={{zIndex: 100}}>
                                <CommonFormItem
                                    name="overtime"
                                    label={t('Số giờ OT')}
                                    placeholder={t('Nhập số giờ OT') as string}
                                    rules={[{ required: true,  message: "Vui lòng nhập Số giờ OT"}]}
                                    showRequiredIcon
                                    type="inputNumber"
                                    min={0}
                                />
                            </Col>
                            <Col span={24} style={{zIndex: 100}}>
                                <CommonFormItem
                                    name="calculateDate"
                                    label={t('Ngày tính lương')}
                                    placeholder={t('Nhập ngày tính lương') as string}
                                    rules={[
                                        { required: true, message: t('Vui lòng chọn Ngày tính lương') as string }
                                    ]}
                                    type='datePicker'
                                    showRequiredIcon={true}
                                    format={"MM/YYYY"}
                                    picker="month"
                                    disabledDate={(current:any) => current >= moment().endOf('month')}
                                />
                            </Col>
                            <Col span={24} className={"form-editor-salary"}>
                                <CommonFormItem
                                    name="description"
                                    label={t('Mô tả')}
                                >
                                    <CommonFormEditor  placeholder={t('Nhập mô tả') as string}/>
                                </CommonFormItem>
                            </Col>
                        </Row>
                        
                        <Space className="form-btn-container">
                            <CommonButton btnType="primary" size={'small'} htmlType="submit">
                                {t('Tính lương')}
                            </CommonButton>
                        </Space>

                    </CommonForm>
                </div>
    </div>
}

export default CalculateSalary;

