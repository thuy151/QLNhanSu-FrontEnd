import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import { DATE_FORMAT } from '../../../utils/constants';
import CommonTable from '../../../components/Common/Table'

import employeeServices from '../../../services/employees.service';

interface DataType {
    key: string;
    name: string;
    // email: string;
}

type DataIndex = keyof DataType;

function DepartmentHistory(props:any) {
    const {employeeId} = props;
    const [data, setData] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getData = async (reload?: boolean) => {
        const resp = await employeeServices.getDepartmentByEmployee(employeeId);
        const data = resp?.data;

        if (resp?.status === 200) {
            setData(_.reverse(data))
        } else {
            setData([])
        }
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Tìm kiếm
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Đặt lại
                </Button>
            </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
            ) : (
            text
            ),
    });
    const columns = [
        {
            title: "STT",
            dataIndex: 'index',
            key: 'index',
            align: "center",
            width: "8%",
            render: (cell: any, record: any, index: number) => index + 1,
        },
        {
            title: "Tên phòng ban",
            dataIndex: 'department',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (value: any, row: any) => {
                return value?.name
            }
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: "Ngày kết thúc",
            dataIndex: 'toDate',
            key: 'toDate',
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : (record?.employee?.status ? "Hiện tại" : "Đã nghỉ"),
        },
    ]; 
    return (
        <div className="detail-page-box">
            {/* <div className="box-title">
                {`Danh sách nhân viên trực thuộc phòng ban (${data?.length})`}
            </div> */}
            <CommonTable
                rowKey={"id"}
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{ y:1000 }}
            />
        </div>
    )
}

export default DepartmentHistory