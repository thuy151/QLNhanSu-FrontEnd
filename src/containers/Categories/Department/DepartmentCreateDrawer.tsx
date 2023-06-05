import { useEffect, useRef, useState } from "react";
import { Col, Form, Image, Row, Space, notification, Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

import { ReactComponent as Close } from "../../../resources/images/close-contained.svg";

import CommonDrawer from "../../../components/Common/Drawer";
import CommonButton from "../../../components/Common/Button";
import CommonFormItem from "../../../components/Common/FormItem";
import CommonForm from "../../../components/Common/Form";
import { DATE_FORMAT } from "../../../utils/constants";
import CommonTag from "../../../components/Common/Tag";
import CommonTable from "../../../components/Common/Table";

import departmentServices, { DepartmentAddParams } from "../../../services/departments.service";
import employeeServices from "../../../services/employees.service";

export interface DepartmentCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentDepartment: any,
}

interface DataType {
    key: string;
    name: string;
    // email: string;
}

type DataIndex = keyof DataType;

const DepartmentCreateDrawer = ({ visible, onAddSuccessful, currentDepartment, resetState }: DepartmentCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getData = async (reload?: boolean) => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await employeeServices.getPageEmployee(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setData(data?.content?.filter((item:any)=>item?.department?.id === currentDepartment?.id))
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values: any) => {
        onSubmit(values)
    }

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: DepartmentAddParams = {
            "description": values?.description,
            "name": values?.name,
        }
        if (currentDepartment) {
            resp = await departmentServices.updateDepartment(currentDepartment.id, body);
        } else {
            resp = await departmentServices.createDepartment(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentDepartment) {
                notification.success({
                    message: t('Thêm mới phòng ban thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa phòng ban thành công'),
                });
            }
            onAddSuccessful();
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        setIsSubmitLoading(false)
    }

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
            title: t("STT"),
            dataIndex: 'index',
            key: 'index',
            align: "center",
            width: "5%",
            render: (cell: any, record: any, index: number) => index + 1,
        },
        // {
        //     title: t("Xử lý"),
        //     key: 'action',
        //     dataIndex: 'action',
        //     align: "center",
        //     render: (value: any, row: any) => {
        //         return <IconRemove className="icon-remove" onClick={() => { setModalVisible(true); setCurrentEmployee(row); }} />
        //     }
        // },
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
            ...getColumnSearchProps('name'),
            // render: (value: any, row: any) => {
            //     return <div className="link" onClick={() => { setCurrentEmployee(row); setVisible(true); }}>{value || '--'}</div>;
            // }
        },
        {
            title: t("Chức vụ"),
            dataIndex: 'position',
            key: 'position',
            render: (cell: any, record: any, index: number) => cell?.name,
        },
        // {
        //     title: t("Số CCCD"),
        //     dataIndex: 'cccd',
        //     key: 'cccd',
        //     sorter: true,
        // },
        {
            title: t("Email"),
            dataIndex: 'email',
            key: 'email',
            // ...getColumnSearchProps('email'),
        },
        {
            title: t("Số điện thoại"),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: t("Giới tính"),
            dataIndex: 'gender',
            key: 'gender',
            render: (cell: any, record: any, index: number) => cell ? "Nữ" : "Nam",
        },
        {
            title: t("Ngày sinh"),
            dataIndex: 'dob',
            key: 'dob',
            render: (cell: any, record: any, index: number) => cell ? moment(cell).format(DATE_FORMAT) : "",
        },
        {
            title: t("Địa chỉ thường trú"),
            dataIndex: 'permanentAddress',
            key: 'permanentAddress',
        },
        // {
        //     title: t("Chuyên ngành"),
        //     dataIndex: 'specialize',
        //     key: 'specialize',
        //     sorter: true,
        // },
        // {
        //     title: t("Học vấn"),
        //     dataIndex: 'education',
        //     key: 'education',
        //     sorter: true,
        // },
        {
            title: t("Trạng thái"),
            dataIndex: 'status',
            key: 'status',
            render: (value: any, cell: any) => {
                return <CommonTag tagType={value ? "success" : "danger"}>{value ? "Đang làm" : "Đã nghỉ"}</CommonTag>
            }
        }
    ]; 

    return (
        <CommonDrawer
            closable={false}
            mask={true}
            maskClosable={false}
            width={'60%'}
            title={currentDepartment ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa phòng ban')}</span>
                    <Close onClick={() => resetState()} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới phòng ban')}</span>
                    <Close onClick={() => resetState()} />
                </div>}
            placement="right"
            open={visible}
            onClose={() => resetState()}
            footer={[
                <Row className='row-drawer' key='footer'>
                    <Space>
                        <CommonButton
                            key="close"
                            btnType='default'
                            size="large"
                            onClick={() => resetState()}
                        >
                            {t('common.button.close')}
                        </CommonButton>
                        <CommonButton
                            key="update"
                            btnType='primary'
                            size="large"
                            onClick={() => form.submit()}
                            loading={isSubmitLoading}
                        >
                            {currentDepartment ? t('common.button.save') : t('common.button.addNew')}
                        </CommonButton>
                    </Space>
                </Row>
            ]}
        >
            <CommonForm
                key="form"
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    name: currentDepartment?.name,
                    description: currentDepartment?.description,
                }}
            >
                <div className="detail-page-box">
                    <div className="box-title">
                        {t('permissionsPage.form.infoBoxTitle')}
                    </div>
                    <Row gutter={20}>
                        <Col span={24}>
                            <CommonFormItem
                                name="name"
                                label={t('Tên phòng ban')}
                                placeholder={t('Nhập tên phòng ban') as string}
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Tên phòng ban') as string }
                                ]}
                                showRequiredIcon={true}
                            />
                        </Col>
                        <Col span={24}>
                            <CommonFormItem
                                name="description"
                                label={t('Mô tả')}
                                placeholder={t('Nhập mô tả') as string}
                                type="textArea"
                                rows={4}
                                maxLength={200}
                                showRequiredIcon
                                rules={[
                                    { whitespace: true, required: true, message: t('Vui lòng nhập Mô tả') as string }
                                ]}
                            />
                        </Col>
                    </Row>
                </div>
                { currentDepartment ? 
                    <div className="detail-page-box" style={{marginTop: 60}}>
                        <div className="box-title">
                            {`Danh sách nhân viên trực thuộc phòng ban (${data?.length})`}
                        </div>
                        <CommonTable
                            rowKey={"id"}
                            dataSource={data}
                            columns={columns}
                            pagination={false}
                            scroll={{ x: 1600, y:500 }}
                        />
                    </div> : <></>
                }
            </CommonForm>
            
        </CommonDrawer>
    )
}

export default DepartmentCreateDrawer;