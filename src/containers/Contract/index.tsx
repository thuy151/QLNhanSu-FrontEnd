import React, { useEffect, useState } from 'react'
import { notification, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { ReactComponent as IconAdd } from '../../resources/images/plus.svg';
import { ReactComponent as IconRemove } from '../../resources/images/trash.svg';

import { buildQueryString } from '../../utils/utilFunctions'
import { useQuery } from '../../utils/customHooks'
import CommonTable from '../../components/Common/Table'
import { DATE_FORMAT, DATE_TIME_FORMAT_SECOND, DEFAULT_PAGE_SIZE } from "../../utils/constants";
import CommonButton from "../../components/Common/Button";
import ContractCreateDrawer from './ContractCreateDrawer';
import ContractSearchBox from "./ContractSearchBox";
import CommonConfirmModal from '../../components/Common/ConfirmModal';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CommonTag from '../../components/Common/Tag';

import contractServices from "../../services/contracts.service";

function Contract() {
    const componentPath = '/contract'
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
    const [currentContract, setCurrentContract] = useState<any>(undefined);
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
        const resp = await contractServices.getPageContract(paramsSearch);
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
            width: '5%',
            align: "center",
            render: (cell: any, record: any, index: number) => (page - 1) * pageSize + index + 1,
        },
        {
            title: t("Xử lý"),
            key: 'action',
            dataIndex: 'action',
            align: "center",
            render: (value: any, row: any) => {
                return <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentContract(row); }} />
            }
        },
        {
            title: t("Tên hợp đồng"),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (value: any, row: any) => {
                return <div className="link" onClick={() => { setCurrentContract(row); setVisible(true); }}>{value || '--'}</div>;
            }
        },
        {
            title: t("Tên nhân viên"),
            dataIndex: 'employee',
            key: 'empName',
            sorter: true,
            render: (value: any, row: any) => value.name,
        },
        {
            title: t("Ngày ký"),
            dataIndex: 'signedDate',
            key: 'signedDate',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Ngày hết hạn"),
            dataIndex: 'expiry',
            key: 'expiry',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Lương cơ bản"),
            dataIndex: 'basicSalary',
            key: 'basicSalary',
            sorter: true,
        },
        {
            title: t("Mô tả"),
            dataIndex: 'description',
            key: 'description',
            sorter: true,
        },
        {
            title: t("Trạng thái"),
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (cell: any, row: any) => {
                return <CommonTag tagType={cell ? "success" : "info"}>{cell ? "Chính thức" : "Thử việc"}</CommonTag>
            }
        },
        {
            title: t("Ngày cập nhật"),
            dataIndex: 'updateTime',
            key: 'updateTime',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_TIME_FORMAT_SECOND) : "",
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
        setCurrentContract(undefined);
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
        setCurrentContract(undefined);
    }

    const onOk = async () => {
        const resp = await contractServices.deleteContract(currentContract.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa hợp đồng thành công'),
            });
            setModalVisible(false);
            setCurrentContract(undefined);
            getData(true);
        }else {
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
        const resp = await contractServices.exportContract(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_hợp_đồng_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return <div>
        <ContractSearchBox getData={getData} componentPath={componentPath} />

        <div className="avic-table-top">
            <div className="avic-table-top-title">
                {t("Danh sách hợp đồng")}
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
            onChange={onPageChange}
            loading={isLoading}
            defaultSorter={{
                order: sortDirectionQuery,
                field: sortColumnQuery,
            }}
        />

        {visible ?
            <ContractCreateDrawer
                visible={visible}
                onAddSuccessful={onAddSuccessful}
                resetState={resetState}
                currentContract={currentContract}
            />
            : <></>
        }

        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => { setCurrentContract(undefined); setModalVisible(false); }}
                visible={modalVisible}
                content={`Bạn có chắc chắn muốn xóa hợp đồng "${currentContract?.name} không?"`}
            /> : <></>
        }
    </div>
}

export default Contract;