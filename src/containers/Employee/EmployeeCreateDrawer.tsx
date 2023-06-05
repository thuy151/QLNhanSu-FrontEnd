import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Row, Space, notification, TabsProps, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment"

import { ReactComponent as Close } from "../../resources/images/close-contained.svg";

import CommonDrawer from "../../components/Common/Drawer";
import CommonButton from "../../components/Common/Button";

import employeeServices, { EmployeeAddParams } from "../../services/employees.service";
import { useSelector } from "react-redux";
import EmployeeInfoTab from "./Tabs/EmployeeInfoTab";
import DepartmentHistory from "./Tabs/DepartmentHistory";
import PositionHistory from "./Tabs/PositionHistory";

export interface EmployeeCreateDrawerProps {
    visible: boolean,
    onAddSuccessful: () => void,
    resetState: () => void,
    currentEmployee: any,
}

const EmployeeCreateDrawer = ({ visible, onAddSuccessful, currentEmployee, resetState }: EmployeeCreateDrawerProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string>("employee-info");
    const [fileAvatar, setFileAvatar] = useState<any>();
    const [fileAvatarData, setFileAvatarData] = useState<any>(undefined);
    const {
        profile
    } = useSelector((state:any) => state?.profileReducer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onFinish = (values: any) => {
        onSubmit(values)
    }

    console.log("currentEmployee",currentEmployee)

    const getData = useCallback(async () => {
        if (currentEmployee) {
            setFileAvatar(currentEmployee?.avatar?.fileDownloadUri);
        }
    }, [currentEmployee])

    useEffect(() => {
        getData();
    }, [getData])

    const onSubmit = async (values: any) => {
        let resp;
        setIsSubmitLoading(true);
        const body: EmployeeAddParams = {
            cccd: values?.cccd,
            gender: values?.gender,
            permanentAddress: values?.permanentAddress,
            insuranceCode: values?.insuranceCode,
            education: values?.education,
            hsl: values?.hsl,
            name: values?.name,
            status: values?.status,
            address: values?.address,
            dob: moment(values?.dob).format('YYYY-MM-DD HH:mm:ss'),
            phoneNumber: values?.phoneNumber,
            email: values?.email,
            avatar: fileAvatarData,
            specialize: values?.specialize,
            certificateIds: values?.certificateIds,
            positionId: values?.positionId,
            departmentId: values?.departmentId,
            disciplineRewardIds: []
        }
        console.log("body",body)
        if (currentEmployee) {
            body.dob = moment(values?.dob).format('YYYY-MM-DD');
            delete body.avatar;
            resp = await employeeServices.updateEmployee(currentEmployee.id, body);
        } else {
            if(!fileAvatarData){
                notification.error({
                    message: t('Avatar không được để trống'),
                });
                setIsSubmitLoading(false)
                return;
            }
            resp = await employeeServices.createEmployee(body);
        }
        const data = resp?.data;
        if (resp?.status === 200) {
            if (!currentEmployee) {
                notification.success({
                    message: t('Thêm mới nhân viên thành công'),
                });
            } else {
                notification.success({
                    message: t('Chỉnh sửa nhân viên thành công'),
                });
                if(profile?.employee?.id === currentEmployee?.id){
                    window.location.reload();
                }
            }
            onAddSuccessful();
        } else {
            notification.error({
                message: data?.message || t('commonError.oopsSystem'),
            });
        }
        setIsSubmitLoading(false)
    }

    const onUploadFile = useCallback(async (options: any) => {
        if (!options?.file) {
            setFileAvatar(undefined);
            setFileAvatarData(undefined);
            return
        }
        
        console.log("options?.file", options?.file)
        const reader = new FileReader()
        reader.readAsDataURL(options?.file)
        reader.onload = () => {
            console.log('called: ', reader)
            setFileAvatar(reader.result);
        }
        if(currentEmployee){
            const resp = await employeeServices.updateAvatarEmployee({
                id: currentEmployee.id, 
                avatar: options?.file
            });
            setIsChangeAvatar(true)
            if (resp?.status === 200) {
                notification.success({
                    message: t('Cập nhật ảnh đại diện thành công'),
                });
            }else{
                notification.error({
                    message: t('Cập nhật ảnh đại diện thất bại. Vui lòng tải lại ảnh!'),
                });
            }
        }else{
            setFileAvatarData(options?.file);
        }
    },[currentEmployee, t])

    const onClose = () => {
        if(isChangeAvatar){
            onAddSuccessful()
        }else{
            resetState();
        }
    }

    const items: TabsProps['items'] = useMemo(()=>{
        const newItems:any[] = [
            {
                key: 'employee-info',
                label: "Thông tin nhân viên",
                children: <EmployeeInfoTab
                    form={form}
                    currentEmployee={currentEmployee} 
                    onFinish={onFinish}
                    fileAvatar={fileAvatar}
                    onUploadFile={onUploadFile}
                />,
            },
        ]
        if(currentEmployee){
            newItems.push({
                key: 'department-history',
                label: "Lịch sử phòng ban",
                children: <DepartmentHistory employeeId={currentEmployee?.id}/>,
            })

            newItems.push({
                key: 'position-history',
                label: "Lịch sử chức vụ",
                children: <PositionHistory employeeId={currentEmployee?.id}/>,
            })
        }
        return newItems;
    },[currentEmployee, fileAvatar, form, onFinish, onUploadFile])

    const onChange = (key: string) => {
        setActiveKey(key)
    };
    return (
        <CommonDrawer
            closable={false}
            mask={true}
            maskClosable={false}
            width={'60%'}
            title={currentEmployee ?
                <div className="drawer-title">
                    <span>{t('Chỉnh sửa nhân viên')}</span>
                    <Close onClick={onClose} />
                </div>
                : <div className="drawer-title">
                    <span>{t('Thêm mới nhân viên')}</span>
                    <Close onClick={onClose} />
                </div>}
            placement="right"
            open={visible}
            onClose={onClose}
            footer={[
                <Row className='row-drawer' key='footer'>
                    <Space>
                        <CommonButton
                            key="close"
                            btnType='default'
                            size="large"
                            onClick={onClose}
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
                            {currentEmployee ? t('common.button.save') : t('common.button.addNew')}
                        </CommonButton>
                    </Space>
                </Row>
            ]}
        >
            <div className="detail-page-box"> 
                <Tabs activeKey={activeKey} items={items} onChange={onChange}/>
            </div>
        </CommonDrawer>
    )
}

export default EmployeeCreateDrawer;