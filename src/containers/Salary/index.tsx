import React, { useEffect, useState } from 'react'
import { notification, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { CloudDownloadOutlined } from '@ant-design/icons';

import { ReactComponent as IconRemove } from '../../resources/images/trash.svg';

import { buildQueryString } from '../../utils/utilFunctions'
import { useQuery } from '../../utils/customHooks'
import CommonTable from '../../components/Common/Table'
import { DATE_FORMAT, DEFAULT_PAGE_SIZE } from "../../utils/constants";
import CommonButton from "../../components/Common/Button";
import CommonConfirmModal from '../../components/Common/ConfirmModal';

import salaryServices from "../../services/salaries.service";
import SalarySearchBox from './components/SalarySearchBox';
import { useSelector } from 'react-redux';

function Salary() {
    const componentPath = '/salary'
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryObj: any = useQuery();
    const { params = {}, search } = queryObj
    const {
        currentPageNumber: currentPageNumberQuery,
        pageSize: pageSizeQuery,
        sortColumn: sortColumnQuery,
        sortDirection: sortDirectionQuery,
        searchText: searchTextQuery,
    } = params
    const { profile } = useSelector((state: any) => state?.profileReducer);

    const page = currentPageNumberQuery ? parseFloat(currentPageNumberQuery) : 1;
    const pageSize = pageSizeQuery ? parseFloat(pageSizeQuery) : DEFAULT_PAGE_SIZE;

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [currentSalary, setCurrentSalary] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const getData = async (reload?: boolean) => {
        setIsLoading(true);
        const paramsSearch = {
            currentPageNumber: reload ? 0 : page - 1,
            pageSize: pageSize,
            sortColumn: sortColumnQuery,
            sortDirection: sortDirectionQuery,
            searchText: searchTextQuery,
        }
        const resp = await salaryServices.getPageSalary(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setData(data)
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoading(false);
    }

    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const onPageChange = (pagination: any, filters: any, sorter: any) => {
        let queryString = buildQueryString({
            ...params,
            currentPageNumber: pageSize === pagination?.pageSize ? pagination?.current : 1,
            pageSize: pagination?.pageSize,
            sortColumn: sorter?.order ? sorter?.field : '',
            sortDirection: sorter?.order ? sorter?.order === 'ascend' ? 'asc' : 'desc' : ''
        })
        navigate(`${componentPath}${queryString || ''}`);
    }


    const columns = [
        {
            title: t("STT"),
            dataIndex: 'index',
            key: 'index',
            align: "center",
            width: "5%",
            render: (cell: any, record: any, index: number) => (page - 1) * pageSize + index + 1,
        },
        {
            title: t("Xử lý"),
            key: 'action',
            dataIndex: 'action',
            align: "center",
            render: (value: any, row: any) => {
                return (profile?.scope !== "EMPLOYEE")  ? 
                        <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentSalary(row); }} />
                        : <>--</>
            }
        },
        {
            title: t("Tên nhân viên"),
            dataIndex: 'employee',
            key: 'name',
            sorter: true,
            render: (cell: any, record: any, index: number) =>  cell?.name
        },
        {
            title: t("Phòng ban"),
            dataIndex: 'employee',
            key: 'department',
            sorter: true,
            render: (cell: any, record: any, index: number) =>  cell?.department?.name
        },
        {
            title: t("Chức vụ"),
            dataIndex: 'employee',
            key: 'position',
            sorter: true,
            render: (cell: any, record: any, index: number) =>  cell?.position?.name
        },
        {
            title: t("Phụ cấp"),
            dataIndex: 'employee',
            key: 'allowance',
            align: "center",
            sorter: true,
            render: (cell: any, record: any, index: number) =>  `${cell?.position?.allowance}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        },
        {
            title: t("Hệ số lương"),
            dataIndex: 'employee',
            key: 'hsl',
            align: "center",
            render: (cell: any, record: any, index: number) =>  cell?.hsl
        },
        {
            title: t("Tháng"),
            dataIndex: 'month',
            key: 'month',
            sorter: true,
            align: "center",
        },
        {
            title: t("Năm"),
            dataIndex: 'year',
            key: 'year',
            sorter: true,
            align: "center",
        },
        {
            title: t("Ngày công"),
            dataIndex: 'workdayCount',
            key: 'workdayCount',
            align: "center",
            sorter: true,
        },
        {
            title: t("Thời gian OT (Giờ)"),
            dataIndex: 'overtime',
            align: "center",
            key: 'overtime',
            sorter: true,
        },
        {
            title: t("Thực lãnh"),
            dataIndex: 'salary',
            key: 'salary',
            sorter: true,
            render: (value: any, row: any, index: number) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        },
        {
            title: t("Ngày chấm"),
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Mô tả"),
            dataIndex: 'description',
            key: 'description',
            sorter: true,
            // render: (cell: any, record: any, index: number) => {
            //     let temp = document.createElement('div');
            //     temp.innerHTML = cell;
            //     let htmlObject = temp.firstChild;
            //     console.log ("htmlObject",htmlObject)
            //     return htmlObject;
            // }
        },
    ]; 

    const onOk = async () => {
        const resp = await salaryServices.deleteSalary(currentSalary?.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa bảng lương thành công'),
            });
            setModalVisible(false);
            setCurrentSalary(undefined);
            getData(true);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            })
        };
    }

    // xuất excel
    const exportData = async () => {
        setIsLoadingExport(true);
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            sortColumn: sortColumnQuery,
            sortDirection: sortDirectionQuery,
            searchText: "",
        }
        const resp = await salaryServices.exportSalary(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_bảng_lương_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return (
        <div>
            <SalarySearchBox getData={getData} componentPath={componentPath} />

            <div className="avic-table-top">
                <div className="avic-table-top-title">
                    {t("Danh sách bảng lương")}
                </div>
                <Space className="avic-table-top-right">
                    <CommonButton type="default" size={'small'} onClick={()=>{exportData()}} loading={isLoadingExport}>
                        <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                    </CommonButton>
                    {/* <CommonButton btnType='primary' size={'small'} className="btn-icon-left" onClick={() => { setVisible(true) }}>
                        <IconAdd />{t("common.button.addNew")}
                    </CommonButton> */}
                </Space>
            </div>

            <CommonTable
                rowKey={"id"}
                dataSource={data?.content || []}
                columns={columns}
                data={data}
                // scroll={{ x: 2000 }}
                onChange={onPageChange}
                loading={isLoading}
                defaultSorter={{
                    order: sortDirectionQuery,
                    field: sortColumnQuery,
                }}
            />

            {modalVisible ?
                <CommonConfirmModal
                    onOk={onOk}
                    onCancel={() => { setCurrentSalary(undefined); setModalVisible(false); }}
                    visible={modalVisible}
                    content={`Bạn có chắc chắn muốn xóa bảng lương này không?"`}
                /> : <></>
            } 
        </div>
    )
}

export default Salary;