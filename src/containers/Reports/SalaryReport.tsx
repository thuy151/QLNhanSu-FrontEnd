import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Space, Table } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import moment from "moment"
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

import CommonTable from '../../components/Common/Table'
import CommonButton from '../../components/Common/Button'
import { useQuery } from '../../utils/customHooks'
import CommonDatePicker from './../../components/Common/DatePicker';
import { buildQueryString } from '../../utils/utilFunctions'

import salaryServices from "../../services/salaries.service";

const convertData = (data: any, currentYear: any) => { // hàm convert data thống kê lương
    let newData:any = [];
    Array.from({length: 2}, (_, item) => { // có 2 loại nhân viên nên length =2
        let newItemData:any = {};
        newItemData["id"] = item;
        newItemData["employee"] = item?"Chính thức":"Thử việc";
        Array.from({length: 12}, (_, i) => { // có 12 tháng nên length =12
            const a = data[item]?.find((itemFind:any)=> itemFind.thoi_gian === (moment(currentYear).format("YYYY")+"-"+(i+1)))
            newItemData["thang_"+(i+1)] = a?.luong || 0;
            return i+1;
        })
        newData.push(newItemData)
        return item;
    })
    return newData;
}

const calculateTotal = (data:any[])=>{
    let newData:number[] = [];
    Array.from({length: 12}, (_, i) => {
        const newTotalItem = data.reduce((accumulator:number, object:any) => { return accumulator + (object[`thang_${i+1}`]);  }, 0);
        newData.push(newTotalItem)
        return i+1;
    })
    return newData;
}

function SalaryReport() {
    const {t}=useTranslation();
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number[]>([]);
    const navigate = useNavigate();
    const queryObj:any = useQuery();
    const {params = {}, search} = queryObj;
    const {
        search: searchQuery,
    } = params;
    const searchQueryData = useMemo(()=>{
        return searchQuery ? JSON.parse(searchQuery) : {};
    },[searchQuery])
    const [currentYear, setCurrentYear] = useState<any>(moment(searchQueryData?.from));
    const getData = useCallback(async ()=>{
        const resp = await salaryServices.thongKeLuong({
            from: moment(form.getFieldValue("date")).startOf("year").valueOf(),
            to: moment(form.getFieldValue("date")).endOf("year").valueOf(),
            ...searchQueryData
        });
        const data = resp?.data;
        if(resp.status === 200){
            if(data?.data?.length>0){
                const dataTable = convertData(_.groupBy(data?.data, function (item:any){
                    return item.loai_nhan_vien
                }),currentYear);
                setDataSource(dataTable);
                console.log("dataTable",dataTable)
                setTotal(calculateTotal(dataTable));
            }else{
                setDataSource([]);
                setTotal([]);
            }
        }else{
            setDataSource([]);
            setTotal([]);
        }
        
        
    },[form, searchQueryData, currentYear])

    useEffect(()=>{
        getData();
    },[getData])

    const columns = [
        {
            title: t("STT"),
            dataIndex: 'index',
            key: 'index',
            width: '4%',
            align: "center",
            fixed: "left",
            render: (cell: any, record: any, index: number) => index + 1,
        },
        {
            title: t("Phân loại nhân viên"),
            dataIndex: 'employee',
            key: 'employee',
            fixed: "left",
            width: '10%',
            align: "center",
        },
        {
            title: t("Tháng 1"),
            dataIndex: 'thang_1',
            
            align: "center",
            key: 'thang_1',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 2"),
            dataIndex: 'thang_2',
            
            align: "center",
            key: 'thang_2',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 3"),
            dataIndex: 'thang_3',
            
            align: "center",
            key: 'thang_3',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 4"),
            dataIndex: 'thang_4',
            
            align: "center",
            key: 'thang_4',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 5"),
            dataIndex: 'thang_5',
            
            align: "center",
            key: 'thang_5',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 6"),
            dataIndex: 'thang_6',
            
            align: "center",
            key: 'thang_6',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 7"),
            dataIndex: 'thang_7',
            
            align: "center",
            key: 'thang_7',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 8"),
            dataIndex: 'thang_8',
            
            align: "center",
            key: 'thang_8',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 9"),
            dataIndex: 'thang_9',
            
            align: "center",
            key: 'thang_9',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 10"),
            dataIndex: 'thang_10',
            
            align: "center",
            key: 'thang_10',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 11"),
            dataIndex: 'thang_11',
            
            align: "center",
            key: 'thang_11',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
        {
            title: t("Tháng 12"),
            dataIndex: 'thang_12',
            
            align: "center",
            key: 'thang_12',
            render: (cell: any, record: any, index: number) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        },
    ];

    const onChangeYear= (values:any)=>{
        setCurrentYear(values);
        const dataSearch = {
            from: moment(values).startOf("year").valueOf(),
            to: moment(values).endOf("year").valueOf(),
        };
        let queryString ={ 
            search: JSON.stringify(dataSearch||{}),
        }
        if (queryString !== search) {
            navigate(`${buildQueryString(queryString) || ''}`)
        } else {
            getData();
        }
    }

    return (
        <div>
            <div className="avic-table-top">
                <div className="avic-table-top-title">
                    {t("Báo cáo chi phí lương")}
                </div>
                <Space className="avic-table-top-right">
                    <CommonDatePicker 
                        placeholder="Chọn thời gian"
                        picker="year"
                        format="YYYY"
                        onChange={onChangeYear}
                        value={currentYear}
                        allowClear={false}
                    />
                    <CommonButton type="default" size={'small'}>
                        <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                    </CommonButton>
                </Space>
            </div>
    
            <CommonTable
                rowKey={"employee"}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{x: 1500}}
                summary={() => (
                    total?.find((item:any) => item>0) ? <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="center">Tổng tiền lương</Table.Summary.Cell>
                            {
                                total?.map((item:any, index: number)=>(
                                    <Table.Summary.Cell index={index+2} align="center">{item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Table.Summary.Cell>
                                ))
                            }
                        </Table.Summary.Row>
                    </Table.Summary> : <></>
                )}
            />
        </div>
    )
}

export default SalaryReport