import React, { useCallback, useEffect, useState } from 'react'
import CommonTable from '../../components/Common/Table'
import { Col, Form, Row, Space } from 'antd'
import CommonButton from '../../components/Common/Button'
import { CloudDownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import CommonForm from '../../components/Common/Form'
import CommonFormItem from '../../components/Common/FormItem'
import moment from "moment"

import positionServices from "../../services/positions.service";
import departmentServices from "../../services/departments.service";
function EmployeeReport() {
    const {t}=useTranslation();
    const [form] = Form.useForm();
    const [dataPosition, setDataPosition] = useState<any[]>([]);
    const [dataDepartment, setDataDepartment] = useState<any[]>([]);
    const dataSource:any[]=[
        {
            id:1,
            month: "Tháng 1",
            chinh_thuc_nam: "10",
            chinh_thuc_nu: "20",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:2,
            month: "Tháng 2",
            chinh_thuc_nam: "14",
            chinh_thuc_nu: "15",
            thu_viec_nam: "7",
            thu_viec_nu: "5",
            da_nghi_nam: "0",
            da_nghi_nu: "1",
        },
        {
            id:3,
            month: "Tháng 3",
            chinh_thuc_nam: "14",
            chinh_thuc_nu: "15",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:4,
            month: "Tháng 4",
            chinh_thuc_nam: "18",
            chinh_thuc_nu: "17",
            thu_viec_nam: "0",
            thu_viec_nu: "0",
            da_nghi_nam: "0",
            da_nghi_nu: "0",
        },
        {
            id:5,
            month: "Tháng 5",
            chinh_thuc_nam: "23",
            chinh_thuc_nu: "17",
            thu_viec_nam: "7",
            thu_viec_nu: "3",
            da_nghi_nam: "4",
            da_nghi_nu: "0",
        },
        {
            id:6,
            month: "Tháng 6",
            chinh_thuc_nam: "34",
            chinh_thuc_nu: "23",
            thu_viec_nam: "5",
            thu_viec_nu: "7",
            da_nghi_nam: "2",
            da_nghi_nu: "1",
        },
        {
            id:7,
            month: "Tháng 7",
            chinh_thuc_nam: "34",
            chinh_thuc_nu: "23",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:8,
            month: "Tháng 8",
            chinh_thuc_nam: "36",
            chinh_thuc_nu: "27",
            thu_viec_nam: "0",
            thu_viec_nu: "0",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:9,
            month: "Tháng 9",
            chinh_thuc_nam: "36",
            chinh_thuc_nu: "27",
            thu_viec_nam: "4",
            thu_viec_nu: "12",
            da_nghi_nam: "2",
            da_nghi_nu: "4",
        },
        {
            id:10,
            month: "Tháng 10",
            chinh_thuc_nam: "36",
            chinh_thuc_nu: "27",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:11,
            month: "Tháng 11",
            chinh_thuc_nam: "36",
            chinh_thuc_nu: "27",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
        {
            id:12,
            month: "Tháng 12",
            chinh_thuc_nam: "40",
            chinh_thuc_nu: "32",
            thu_viec_nam: "4",
            thu_viec_nu: "3",
            da_nghi_nam: "2",
            da_nghi_nu: "0",
        },
    ];

    const getDataPosition = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await positionServices.getPagePosition(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setDataPosition(data?.content?.map((x:any) => ({value: x.id, label: x.name })))
        } else {
            setDataPosition([])
        }
    },[])

    const getDataDepartment = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await departmentServices.getPageDepartment(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setDataDepartment(data?.content?.map((x:any) => ({value: x.id, label: x.name })))
        } else {
            setDataDepartment([])
        }
    },[])

    useEffect(()=>{
        getDataPosition();
        getDataDepartment();
    },[getDataPosition, getDataDepartment])

    const columns = [
        {
            title: t("STT"),
            dataIndex: 'index',
            key: 'index',
            width: '3%',
            align: "center",
            render: (cell: any, record: any, index: number) => index + 1,
        },
        {
            title: t("Tháng"),
            dataIndex: 'month',
            key: 'month',
            width: '16%',
            align: "center",
        },
        {
            title: t("Nhân viên chính thức"),
            align: "center",
            key: 'chinh_thuc',
            width: '27%',
            children: [
                {
                    title: t("Nam"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'chinh_thuc_nam',
                    key: 'chinh_thuc_nam',
                },
                {
                    title: t("Nữ"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'chinh_thuc_nu',
                    key: 'chinh_thuc_nu',
                }
            ]
        },
        {
            title: t("Nhân viên thử việc"),
            align: "center",
            key: 'thu_viec',
            width: '27%',
            children: [
                {
                    title: t("Nam"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'thu_viec_nam',
                    key: 'thu_viec_nam',
                },
                {
                    title: t("Nữ"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'thu_viec_nu',
                    key: 'thu_viec_nu',
                }
            ]
        },
        {
            title: t("Nhân viên nghỉ việc"),
            align: "center",
            key: 'da_nghi',
            width: '27%',
            children: [
                {
                    title: t("Nam"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'da_nghi_nam',
                    key: 'da_nghi_nam',
                },
                {
                    title: t("Nữ"),
                    width: '13.5%',
                    align: "center",
                    dataIndex: 'da_nghi_nu',
                    key: 'da_nghi_nu',
                }
            ]
        },
    ];

    return (
        <div>

    <div className="avic-search-box">
        <div className="advance-search-box">
            <CommonForm
                form={form}
                layout="vertical"
                initialValues={{
                    date: [moment().startOf("year"), moment().endOf("year")],
                }}
            >
                <Row gutter={30}>
                <Col span={12}>
                        <CommonFormItem
                            name="department"
                            label={t('Phòng ban')}
                            placeholder={t('Chọn phòng ban') as string}
                            options={dataDepartment}
                            type='select'
                        />
                    </Col>
                    <Col span={12}>
                        <CommonFormItem
                            name="position"
                            label={t('Chức vụ')}
                            placeholder={t('Chọn chức vụ') as string}
                            options={dataPosition}
                            type='select'
                        />
                    </Col>
                    <Col span={12}>
                        <CommonFormItem
                            name="date"
                            type="rangePicker"
                            label={t('Thời gian')}
                            placeholder={[t('common.fromDate'), t('common.toDate')]}
                        />
                    </Col>
                </Row>
                <Space className="form-btn-container">
                    <CommonButton btnType="default" size={'small'} onClick={() => form.resetFields()}>
                        {t('common.button.deleteCondition')}
                    </CommonButton>
                    <CommonButton btnType="primary" size={'small'} htmlType="submit">
                        {t('common.button.search')}
                    </CommonButton>
                </Space>

            </CommonForm>
        </div>
    </div>

            <div className="avic-table-top">
                <div className="avic-table-top-title">
                    {t("Báo cáo thống kê biến động nhân sự")}
                </div>
                <Space className="avic-table-top-right">
                    <CommonButton type="default" size={'small'}>
                        <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                    </CommonButton>
                </Space>
            </div>
    
            <CommonTable
                className="employee-report-table"
                rowKey={"id"}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        </div>
    )
}

export default EmployeeReport