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
import RestCreateDrawer from './RestCreateDrawer';
import RestSearchBox from "./RestSearchBox";
import CommonConfirmModal from '../../components/Common/ConfirmModal';
import { CloudDownloadOutlined } from '@ant-design/icons';

import restServices from "../../services/rests.service";
import CommonTag from '../../components/Common/Tag';
import { useSelector } from 'react-redux';

function Rest() {
    const componentPath = '/rest'
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

    const { profile } = useSelector((state: any) => state?.profileReducer);
    const [data, setData] = useState<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentRest, setCurrentRest] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);

    const getData = async (reload?: boolean) => {
        setIsLoading(true);
        const paramsSearch = {
            currentPageNumber: reload ? 0 : page - 1,
            pageSize: pageSize,
            sortColumn: sortColumnQuery,
            sortDirection: sortDirectionQuery,
            searchText: searchTextQuery,
        }
        const resp = await restServices.getPageRest(paramsSearch);
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
                return (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") ? 
                            <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentRest(row); }} />
                            : <>--</>
            }
        },
        {
            title: t("Tên nhân viên"),
            dataIndex: 'employee',
            key: 'employee',
            sorter: true,
            render: (value: any, row: any) => {
                return <div className="link" onClick={() => { setCurrentRest(row); setVisible(true); }}>{value.name || '--'}</div>;
            }
        },
        {
            title: t("Lý do"),
            dataIndex: 'reason',
            key: 'reason',
            sorter: true,
        },
        {
            title: t("Ngày bắt đầu nghỉ"),
            dataIndex: 'fromDate',
            key: 'fromDate',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Ngày kết thúc nghỉ"),
            dataIndex: 'toDate',
            key: 'toDate',
            sorter: true,
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Trạng thái"),
            dataIndex: 'haveSalary',
            key: 'haveSalary',
            sorter: true,
            render: (cell: any, row: any) => {
                return <CommonTag tagType={cell ? "success" : "danger"}>{cell ? "Có lương" : "Không lương"}</CommonTag>
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
        setCurrentRest(undefined);
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
        setCurrentRest(undefined);
    }

    const onOk = async () => {
        const resp = await restServices.deleteRest(currentRest.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa nghỉ phép thành công'),
            });
            setModalVisible(false);
            setCurrentRest(undefined);
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
        const resp = await restServices.exportRest(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_nghi_phép_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return <div>
        <RestSearchBox getData={getData} componentPath={componentPath} />

        <div className="avic-table-top">
            <div className="avic-table-top-title">
                {t("Danh sách nghỉ phép")}
            </div>
            <Space className="avic-table-top-right">
                <CommonButton type="default" size={'small'} onClick={()=>{exportData()}} loading={isLoadingExport}>
                    <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                </CommonButton>
                { (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") && <CommonButton btnType='primary' size={'small'} className="btn-icon-left" onClick={() => { setVisible(true) }}>
                        <IconAdd />{t("common.button.addNew")}
                    </CommonButton>
                }
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
            <RestCreateDrawer
                visible={visible}
                onAddSuccessful={onAddSuccessful}
                resetState={resetState}
                currentRest={currentRest}
            />
            : <></>
        }

        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => { setCurrentRest(undefined); setModalVisible(false); }}
                visible={modalVisible}
                content={`Bạn có chắc chắn muốn xóa nghỉ phép "${currentRest?.name} không?"`}
            /> : <></>
        }
    </div>
}

export default Rest;