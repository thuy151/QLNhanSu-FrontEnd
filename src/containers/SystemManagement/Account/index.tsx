import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import { notification, Space} from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

import { ReactComponent as IconAdd } from '../../../resources/images/plus.svg';
import { ReactComponent as IconRemove } from '../../../resources/images/trash.svg';

import {buildQueryString} from '../../../utils/utilFunctions'
import {useQuery} from '../../../utils/customHooks'
import CommonTable from '../../../components/Common/Table'
import { DATE_TIME_FORMAT_SECOND, DEFAULT_PAGE_SIZE, ACCOUNT_PAGE_STATUS} from "../../../utils/constants";
import SearchBox from "./SearchBox";
import CommonButton from "../../../components/Common/Button";
import CommonTag from "../../../components/Common/Tag";
import AccountDrawer from './AccountDrawer';
import { PERMISSION_LIST } from '../../../utils/constants';
import CommonConfirmModal from '../../../components/Common/ConfirmModal';

import accountsServices from "../../../services/users.service";

function Account () {
    const componentPath = "/account"
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryObj:any = useQuery();
    const {params = {}, search} = queryObj
    const {
        currentPageNumber: currentPageNumberQuery,
        pageSize: pageSizeQuery,
        sortColumn: sortColumnQuery,
        sortDirection: sortDirectionQuery,
        searchText: searchTextQuery,
    } = params
    const page = currentPageNumberQuery ? parseFloat(currentPageNumberQuery) : 1;
    const pageSize = pageSizeQuery ? parseFloat(pageSizeQuery) : DEFAULT_PAGE_SIZE;

    const [data, setData] = useState<any>({});
    const [currentAccount, setCurrentAccount] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);

    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const getData = async (reload?: boolean) => {
        setIsLoading(true)
        const paramsSearch = {
            currentPageNumber: reload ? 0 : page - 1,
            pageSize: pageSize,
            sortColumn: sortColumnQuery,
            sortDirection: sortDirectionQuery,
            searchText: searchTextQuery,
        }
        const resp = await accountsServices.getPageAccount(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            setData(data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
    }

    const onOk = async () => {
        const resp = await accountsServices.deleteAccount(currentAccount.id);
        if (resp?.status === 200) {
            notification.success({
                message: t('Xóa tài khoản thành công'),
            });
            setModalVisible(false);
            setCurrentAccount(undefined);
            getData(true);
        }else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            })
        };
    }

    const onPageChange = (pagination:any, filters:any, sorter:any) => {
        let queryString = buildQueryString({
            ...params,
            page: pageSize === pagination?.pageSize ? pagination?.current : 1,
            pageSize: pagination?.pageSize,
            sortBy: sorter?.order ? sorter?.field : '',
            sortType: sorter?.order ? sorter?.order === 'ascend' ? 'asc' : 'desc' : ''
        })
        navigate(`${componentPath}${queryString || ''}`)
    }

    const columns = [
        {
            title: t('accountPage.list.columns.STT'),
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (cell:any, record:any, index:number) => (page - 1) * pageSize + index + 1,
        },
        {
            title: t("Xử lý"),
            key: 'action',
            dataIndex: 'action',
            align: "center",
            render: (value: any, row: any) => {
                return <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentAccount(row); }} />
            }
        },
        {
            title: t('accountPage.list.columns.username'),
            dataIndex: 'username',
            key: 'username',
            sorter: true,
            render: (value:any, cell:any) => {
                return <div 
                    className="link" 
                    onClick={()=>{
                        setCurrentAccount(cell);
                        setVisible(true);
                    }}
                >{value || '--'}</div>;
            }
        },
        {
            title: t('accountPage.list.columns.name'),
            dataIndex: 'employee',
            key: 'name',
            sorter: true,
            render: (value:any, cell:any) => value.name
        },
        {
            title: t('Email'),
            dataIndex: 'employee',
            key: 'email',
            sorter: true,
            render: (value:any, cell:any) => value?.email
        },
        {
            title: t('Số điện thoại'),
            dataIndex: 'employee',
            key: 'phoneNumber',
            sorter: true,
            render: (value:any, cell:any) => value?.phoneNumber
        },
        {
            title: t('accountPage.list.columns.groups'),
            dataIndex: 'permission',
            key: 'permission',
            render: (value: any, cell: any, index: number) => {
                return PERMISSION_LIST[value].label;
            }
        },
        {
            title: t('accountPage.list.columns.modifiedDate'),
            dataIndex: 'updateTime',
            key: 'updateTime',
            sorter: true,
            render: (value:any, cell:any) => {
                return  value ? moment(value).format(DATE_TIME_FORMAT_SECOND):"";
            }
        },
        {
            title: t('accountPage.list.columns.modifiedBy'),
            dataIndex: 'updateBy',
            key: 'updateBy',
            sorter: true
        },
        {
            title: t('accountPage.list.columns.status'),
            dataIndex: 'status',
            key: 'status',
            render: (value:any, cell:any) => {
                const curStatus:any = ACCOUNT_PAGE_STATUS.find((x:any) => x.value === value) || {}
                return <CommonTag tagType={curStatus?.type}>{t(curStatus?.label)}</CommonTag>
            }
        },
    ];

    const onAddSuccessful =()=>{
        setVisible(false);
        setCurrentAccount(undefined);
        let queryString = buildQueryString({
            ...params,
            currentPageNumber: 1,
        }); 
        if (queryString !== search) {    
            navigate(`${queryString || ''}`)
        }else{
            getData(true);
        }
    }

    const resetState = ()=>{
        setVisible(false);
        setCurrentAccount(undefined);
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
        const resp = await accountsServices.exportAccount(paramsSearch);
        const data = resp?.data;
        if (resp?.status === 200) {
            const fileName = `Danh_sách_tài_khoản_${moment().format('YYYYMMDD')}_${moment().unix()}.xlsx`
            saveAs(data, fileName);
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        
        setIsLoadingExport(false);
    }

    return <div className='content-wrapper'>
        <SearchBox getData={getData} componentPath={componentPath}/>

        <div className="avic-table-top">
            <div className="avic-table-top-title">
                {t('accountPage.list.title')}
            </div>
            <Space className="avic-table-top-right">
                <CommonButton
                    size={'small'}
                    icon={<CloudDownloadOutlined />}
                    onClick={()=>{exportData()}} 
                    loading={isLoadingExport}
                >
                    {t('common.button.exportExcel')}
                </CommonButton>
                <CommonButton btnType="primary" size={'small'} className="btn-icon-left" onClick={()=>setVisible(true)}>
                    <IconAdd />{t('common.button.addNew')}
                </CommonButton>
                
            </Space>
        </div>

        <CommonTable
            isLoading={isLoading}
            rowKey={'id'}
            dataSource={data?.content || []}
            columns={columns}
            data={data}
            onChange={onPageChange}
            defaultSorter={{
                order: sortDirectionQuery,
                field: sortColumnQuery,
            }}
        />

        { visible ? 
            <AccountDrawer
                visible={visible}
                onAddSuccessful={onAddSuccessful}
                resetState={resetState}
                currentAccount={currentAccount}
            />
            : <></>
        }
        {modalVisible ?
            <CommonConfirmModal
                onOk={onOk}
                onCancel={() => { setCurrentAccount(undefined); setModalVisible(false); }}
                visible={modalVisible}
                content={`Bạn có chắc chắn muốn xóa tài khoản "${currentAccount?.name} không?"`}
            /> : <></>
        }
    </div>
}

export default Account;

