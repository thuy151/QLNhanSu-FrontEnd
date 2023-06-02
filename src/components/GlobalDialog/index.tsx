import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { Modal } from 'antd';
import {closeGlobalDialog} from "../../redux/actions/global.actions";

function GlobalDialog() {
    const dispatch = useDispatch();

    const {
        globalDialogStatus,
        globalDialogContent,
        globalDialogHandleOk,
        globalDialogTitle
    } = useSelector((state:any) => state?.globalReducer);

    const handleOk = () => {
        //handle ok
        if (globalDialogHandleOk) globalDialogHandleOk()
        dispatch(closeGlobalDialog())
    };

    const handleCancel = () => {
        dispatch(closeGlobalDialog())
    };

    return <Modal
        title={globalDialogTitle || ""}
        open={globalDialogStatus}
        onOk={handleOk}
        onCancel={handleCancel}
        centered={true}
    >
        {globalDialogContent}
    </Modal>
}

export default GlobalDialog;

