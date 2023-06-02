import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Table } from "antd";

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_LIST } from "../../utils/constants";
import CommonSpin from "./Spin";
import CommonEmpty from "./Empty";

const CommonTable = (props: any) => {
    const { t } = useTranslation();
    const {
        isLoading,
        data = {},
        pagination = {},
        defaultSorter = {},
        columns
    } = props;

    const [columnsModified, setColumnsModified] = useState()

    useEffect(() => {
        if (defaultSorter && defaultSorter?.order && defaultSorter?.field) {
            const newColumns: any = []
            columns.map((item: any) => {
                if (item?.dataIndex === defaultSorter?.field) {
                    newColumns.push({
                        ...item,
                        defaultSortOrder: defaultSorter?.order === 'asc' ? 'ascend' : 'descend'
                    })
                } else {
                    newColumns.push(item)
                }
                return item;
            })
            setColumnsModified(newColumns)
        } else {
            setColumnsModified(columns)
        }
    }, [columns, defaultSorter])

    const showTotalTxt = data?.numberOfElements === 0 ? '0-0' : `${(data?.number * data?.size + 1)}-${(data?.number + 1) * data?.size <= data?.totalElements ? (data?.number + 1) * data?.size : data?.totalElements}`

    return <CommonSpin isLoading={isLoading}>
        {
            columnsModified && <Table
                rowKey={(record: any, index) => `${index}`}
                pagination={{
                    // hideOnSinglePage: false,
                    size: "small",
                    showSizeChanger: true,
                    current: (data?.number || 0) + 1,
                    total: data?.totalElements,
                    pageSize: data?.size,
                    defaultPageSize: DEFAULT_PAGE_SIZE,
                    pageSizeOptions: PAGE_SIZE_LIST,
                    showTotal: total => <div>{showTotalTxt} {t('common.pagination')} {total.toLocaleString()}</div>,
                    ...pagination,
                }}
                {...props}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                columns={columnsModified}
                locale={{
                    triggerDesc: 'Click để sắp xếp giảm dần',
                    triggerAsc: 'Click để sắp xếp tăng dần',
                    cancelSort: 'Click để hủy sắp xếp',
                    emptyText: <CommonEmpty />
                }}
                className={`avic-table ${props?.className || ''}`}
            />
        }
    </CommonSpin>
}

export default CommonTable;