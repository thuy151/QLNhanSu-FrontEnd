import { CloudDownloadOutlined } from '@ant-design/icons';
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
import { DATE_TIME_FORMAT_SECOND, DEFAULT_PAGE_SIZE } from "../../utils/constants";
import CommonButton from "../../components/Common/Button";
import EmployeeRewardCreateDrawer from './EmployeeRewardCreateDrawer';
import EmployeeRewardSearchBox from "./EmployeeRewardSearchBox";
import CommonConfirmModal from '../../components/Common/ConfirmModal';

import employeeRewardServices from "../../services/employeeRewards.service";
import CommonTag from '../../components/Common/Tag';
import { useSelector } from 'react-redux';

function EmployeeReward() {
    const componentPath = '/discipline-reward-employee'
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
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEmployeeReward, setCurrentEmployeeReward] = useState<any>(undefined);
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
        const resp = await employeeRewardServices.getPageEmployeeReward(paramsSearch);
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
                return (profile?.scope === "ADMIN" || profile?.scope === "MANAGER")  ? 
                        <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentEmployeeReward(row); }} />
                        : <>--</>
            }
        },
        {
            title: t("Tên nhân viên"),
            dataIndex: 'employee',
            key: 'employee',
            sorter: true,
            render: (value: any, row: any) => value?.name
        },
        {
            title: t("Phòng ban"),
            dataIndex: 'employee',
            key: 'department',
            sorter: true,
            render: (value: any, row: any) => value?.department?.name
        },
        {
            title: t("Chức vụ"),
            dataIndex: 'employee',
            key: 'position',
            sorter: true,
            render: (value: any, row: any) => value?.position?.name
        },
        {
            title: t("Nội dung khen thưởng-kỷ luật"),
            dataIndex: 'disciplineReward',
            key: 'name',
            sorter: true,
            render: (value: any, row: any) => value.name
        },
        {
            title: t("Loại"),
            dataIndex: 'disciplineReward',
            key: 'isReward',
            sorter: true,
            
            render: (cell: any, row: any) => {
                return <CommonTag tagType={cell.isReward===true ? "success" : "danger"}>{cell.isReward===true ? "Khen thưởng" : "Kỷ luật"}</CommonTag>
            }
        },
        {
            title: t("Mô tả"),
            dataIndex: 'disciplineReward',
            key: 'description',
            sorter: true,
            render: (value: any, row: any) => value.description
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
        setCurrentEmployeeReward(undefined);
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
        setCurrentEmployeeReward(undefined);
    }

    const onOk = async () => {
        const resp = await employeeRewardServices.deleteEmployeeReward(currentEmployeeReward.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa khen thưởng-kỷ luật nhân viên thành công'),
            });
            setModalVisible(false);
            setCurrentEmployeeReward(undefined);
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
        const resp = await employeeRewardServices.exportEmployeeReward(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_khen_thưởng_kỷ_luật_nhân_viên_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return <div>
        <EmployeeRewardSearchBox getData={getData} componentPath={componentPath} />

        <div className="avic-table-top">
            <div className="avic-table-top-title">
                {t("Danh sách khen thưởng-kỷ luật nhân viên")}
            </div>
            <Space className="avic-table-top-right">
                <CommonButton type="default" size={'small'} onClick={()=>{exportData()}} loading={isLoadingExport}>
                    <CloudDownloadOutlined /> {t("common.button.exportExcel")}
                </CommonButton>
                {(profile?.scope === "ADMIN" || profile?.scope === "MANAGER")  &&<CommonButton btnType='primary' size={'small'} className="btn-icon-left" onClick={() => { setVisible(true) }}>
                    <IconAdd />{t("common.button.addNew")}
                </CommonButton>}
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
            <EmployeeRewardCreateDrawer
                visible={visible}
                onAddSuccessful={onAddSuccessful}
                resetState={resetState}
                currentEmployeeReward={currentEmployeeReward}
            />
            : <></>
        }

        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => { setCurrentEmployeeReward(undefined); setModalVisible(false); }}
                visible={modalVisible}
                content={`Bạn có chắc chắn muốn xóa khen thưởng-kỷ luật "${currentEmployeeReward?.disciplineReward?.name}" của nhân viên "${currentEmployeeReward?.employee?.name}" không?`}
            /> : <></>
        }
    </div>
}

export default EmployeeReward;