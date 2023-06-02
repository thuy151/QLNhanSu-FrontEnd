import React, { useEffect, useState } from 'react'
import { notification, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { ReactComponent as IconAdd } from '../../../resources/images/plus.svg';
import { ReactComponent as IconRemove } from '../../../resources/images/trash.svg';

import { buildQueryString } from '../../../utils/utilFunctions'
import { useQuery } from '../../../utils/customHooks'
import CommonTable from '../../../components/Common/Table'
import { DATE_TIME_FORMAT_SECOND, DEFAULT_PAGE_SIZE } from "../../../utils/constants";
import CommonButton from "../../../components/Common/Button";
import CertificateCreateDrawer from './CertificateCreateDrawer';
import CertificateSearchBox from "./CertificateSearchBox";
import CommonConfirmModal from '../../../components/Common/ConfirmModal';
import { CloudDownloadOutlined } from '@ant-design/icons';

import certificateServices from "../../../services/certificates.service";

function Certificate() {
    const componentPath = '/certificate'
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
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState<any>(undefined);
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
        const resp = await certificateServices.getPageCertificate(paramsSearch);
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
                return <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentCertificate(row); }} />
            }
        },
        {
            title: t("Tên chứng chỉ"),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (value: any, row: any) => {
                return <div className="link" onClick={() => { setCurrentCertificate(row); setVisible(true); }}>{value || '--'}</div>;
            }
        },
        {
            title: t("Thời hạn"),
            dataIndex: 'expiry',
            key: 'expiry',
            sorter: true,
        },
        {
            title: t("Mô tả"),
            dataIndex: 'description',
            key: 'description',
            sorter: true,
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
        setCurrentCertificate(undefined);
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
        setCurrentCertificate(undefined);
    }

    const onOk = async () => {
        const resp = await certificateServices.deleteCertificate(currentCertificate.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa chứng chỉ thành công'),
            });
            setModalVisible(false);
            setCurrentCertificate(undefined);
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
        const resp = await certificateServices.exportEmployee(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_chứng_chỉ_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return <div>
        <CertificateSearchBox getData={getData} componentPath={componentPath} />

        <div className="avic-table-top">
            <div className="avic-table-top-title">
                {t("Danh sách chứng chỉ")}
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
            <CertificateCreateDrawer
                visible={visible}
                onAddSuccessful={onAddSuccessful}
                resetState={resetState}
                currentCertificate={currentCertificate}
            />
            : <></>
        }

        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => { setCurrentCertificate(undefined); setModalVisible(false); }}
                visible={modalVisible}
                content={`Bạn có chắc chắn muốn xóa chứng chỉ "${currentCertificate?.name} không?"`}
            /> : <></>
        }
    </div>
}

export default Certificate;