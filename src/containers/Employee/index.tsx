import React, { useEffect, useState } from 'react'
import { notification, Space, Image } from 'antd';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { ReactComponent as IconAdd } from '../../resources/images/plus.svg';
import { ReactComponent as IconRemove } from '../../resources/images/trash.svg';

import { buildQueryString } from '../../utils/utilFunctions'
import { useQuery } from '../../utils/customHooks'
import CommonTable from '../../components/Common/Table'
import { DATE_TIME_FORMAT, DATE_FORMAT, DEFAULT_PAGE_SIZE } from "../../utils/constants";
import CommonButton from "../../components/Common/Button";
import EmployeeCreateDrawer from './EmployeeCreateDrawer';
import EmployeeSearchBox from "./EmployeeSearchBox";
import CommonConfirmModal from '../../components/Common/ConfirmModal';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CommonTag from '../../components/Common/Tag';

import employeeServices from "../../services/employees.service";

function Employee() {
    const componentPath = '/employee'
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

    const page = currentPageNumberQuery ? parseFloat(currentPageNumberQuery) : 1;
    const pageSize = pageSizeQuery ? parseFloat(pageSizeQuery) : DEFAULT_PAGE_SIZE;

    const [data, setData] = useState<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<any>(undefined);
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
        const resp = await employeeServices.getPageEmployee(paramsSearch);
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
            render: (cell: any, record: any, index: number) => (page - 1) * pageSize + index + 1,
        },
        {
            title: t("Xử lý"),
            key: 'action',
            dataIndex: 'action',
            align: "center",
            render: (value: any, row: any) => {
                return <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentEmployee(row); }} />
            }
        },
        {
            title: t("Hình ảnh"),
            dataIndex: 'avatar',
            key: 'avatar',
            align: "center",
            render: (value: any, row: any) => {
                return (
                    <Image
                        width={120}
                        src={value?.fileDownloadUri}
                        alt="avatar"
                    />
                )
            }
        },
        {
            title: t("Họ và tên"),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (value: any, row: any) => {
                return <div className="link" onClick={() => { setCurrentEmployee(row); setVisible(true); }}>{value || '--'}</div>;
            }
        },
        {
            title: t("Phòng ban"),
            dataIndex: 'department',
            key: 'department',
            render: (cell: any, record: any, index: number) => cell?.name,
        },
        {
            title: t("Chức vụ"),
            dataIndex: 'position',
            key: 'position',
            render: (cell: any, record: any, index: number) => cell?.name,
        },
        {
            title: t("Hệ số lương"),
            dataIndex: 'hsl',
            key: 'hsl',
            sorter: true,
            align: "center",
            
        },
        {
            title: t("Số CCCD"),
            dataIndex: 'cccd',
            key: 'cccd',
            sorter: true,
        },
        {
            title: t("Email"),
            dataIndex: 'email',
            key: 'email',
            sorter: true,
        },
        {
            title: t("Số điện thoại"),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: true,
        },
        {
            title: t("Giới tính"),
            dataIndex: 'gender',
            key: 'gender',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? "Nữ" : "Nam",
        },
        {
            title: t("Ngày sinh"),
            dataIndex: 'dob',
            key: 'dob',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Địa chỉ thường trú"),
            dataIndex: 'permanentAddress',
            key: 'permanentAddress',
            sorter: true,
        },
        {
            title: t("Chuyên ngành"),
            dataIndex: 'specialize',
            key: 'specialize',
            sorter: true,
        },
        {
            title: t("Học vấn"),
            dataIndex: 'education',
            key: 'education',
            sorter: true,
        },
        {
            title: t("Trạng thái"),
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (value: any, cell: any) => {
                return <CommonTag tagType={value ? "success" : "danger"}>{value ? "Đang làm" : "Đã nghỉ"}</CommonTag>
            }
        },
        {
            title: t("Ngày cập nhật"),
            dataIndex: 'updateTime',
            key: 'updateTime',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_TIME_FORMAT) : "",
        },
        {
            title: t("Người cập nhật"),
            dataIndex: 'updateBy',
            key: 'updateBy',
            sorter: true,
        },
    ]; 
    const onAddSuccessful = () => {
        setVisible(false);
        setCurrentEmployee(undefined);
        let queryString = buildQueryString({
            ...params,
            currentPageNumber: 1,
        });
        if (queryString !== search) {
            navigate(`${queryString || ''}`)
        } else {
            getData(true);
        }
    }

    const resetState = () => {
        setVisible(false);
        setCurrentEmployee(undefined);
    }

    const onOk = async () => {
        const resp = await employeeServices.deleteEmployee(currentEmployee.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa nhân viên thành công'),
            });
            setModalVisible(false);
            setCurrentEmployee(undefined);
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
        const resp = await employeeServices.exportEmployee(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_nhân_viên_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
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
            <EmployeeSearchBox getData={getData} componentPath={componentPath} />

            <div className="avic-table-top">
                <div className="avic-table-top-title">
                    {t("Danh sách nhân viên")}
                </div>
                <Space className="avic-table-top-right">
                    <CommonButton type="default" size={'small'} onClick={()=>{exportData()}} loading={isLoadingExport}>
                        <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                    </CommonButton>
                    <CommonButton btnType='primary' size={'small'} className="btn-icon-left" onClick={() => { setVisible(true) }}>
                        <IconAdd />{t("common.button.addNew")}
                    </CommonButton>
                </Space>
            </div>

            <CommonTable
                rowKey={"id"}
                dataSource={data?.content || []}
                columns={columns}
                data={data}
                scroll={{ x: 2400 }}
                onChange={onPageChange}
                loading={isLoading}
                defaultSorter={{
                    order: sortDirectionQuery,
                    field: sortColumnQuery,
                }}
            />
            
            {visible ?
                <EmployeeCreateDrawer
                    visible={visible}
                    onAddSuccessful={onAddSuccessful}
                    resetState={resetState}
                    currentEmployee={currentEmployee}
                />
                : <></>
            }

            {modalVisible ?
                <CommonConfirmModal
                    onOk={onOk}
                    onCancel={() => { setCurrentEmployee(undefined); setModalVisible(false); }}
                    visible={modalVisible}
                    content={`Bạn có chắc chắn muốn xóa nhân viên "${currentEmployee?.name} không?"`}
                /> : <></>
            }
        </div>
    )
}

export default Employee;