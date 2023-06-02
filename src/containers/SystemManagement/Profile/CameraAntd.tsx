import React from 'react'
import { useTranslation } from "react-i18next";
import { notification, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useDispatch, useSelector } from 'react-redux';
import moment  from 'moment';

import { ReactComponent as CameraIcon } from "../../../resources/images/camera-icon.svg";
import { saveProfile } from '../../../redux/actions/profile.actions';

import employeeServices from "../../../services/employees.service";

function CameraAntd() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {
        profile
    } = useSelector((state: any) => state?.profileReducer);

    const onUploadFile = async (options: any) => {
        if (!options?.file) {
            return
        }
        console.log("123",options.file)
        const resp = await employeeServices.updateAvatarEmployee({
            id: profile?.employee?.id, 
            avatar: options?.file
        });
        if (resp?.status === 200) {
            notification.success({
                message: t('Cập nhật ảnh đại diện thành công'),
            });
            const firstFile =  moment().format("YYYYMMDD_HHmmss_")
            dispatch(saveProfile({
                ...profile, // giải dữ liệu cũ
                employee: { // cập nhật dữ liệu mới 
                    ...profile?.employee,
                    avatar:{
                        fileName: `${firstFile}${options?.file?.name}`,
                        fileDownloadUri: `http://localhost:8080/api/hms/employee/download-avatar/${firstFile}${options?.file?.name}`
                    }
                }
            }))
        }else{
            notification.error({
                message: t('Cập nhật ảnh đại diện thất bại. Vui lòng tải lại ảnh!'),
            });
        }
    }


    return (
        <div className="avatar-change-icon">
            <ImgCrop showGrid rotationSlider aspectSlider showReset>
                <Upload
                    fileList={[]}
                    customRequest={onUploadFile}
                >
                    <CameraIcon />
                </Upload>
            </ImgCrop>
        </div>
    );
}

export default CameraAntd;

