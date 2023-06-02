import { ReactNode } from "react";
import { Button, Modal } from "antd";

import { ReactComponent as WarningIcon } from "../../resources/images/warning.svg";
import { useTranslation } from "react-i18next";

export interface ConfirmModalProps {
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  showOk?: boolean;
  showCancel?: boolean;
  okText?: string;
  cancelText?: string;
  content?: ReactNode;
  title?: string;
  danger?: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
  loadingBtnOk?: boolean;
}

const CommonConfirmModal = ({
  visible,
  onOk,
  onCancel,
  cancelText,
  okText,
  showCancel = true,
  showOk = true,
  content,
  title,
  danger = false,
  onClose,
  loadingBtnOk=false,
  isUpdate = false,
}: ConfirmModalProps) => {
  const {t}=useTranslation();
  return (
    <Modal
      className="confirm-modal"
      onCancel={isUpdate ? onClose : onCancel}
      open={visible}
      footer={[
        ...(showCancel
          ? [
            <Button key="back" onClick={onCancel} className='confirm-modal-btn-close'>
              {cancelText || t('common.button.cancel')}
            </Button>,
          ]
          : []),
        ...(showOk
          ? [
            <Button
              key="accept"
              className='confirm-modal-btn-ok'
              onClick={onOk}
              type="primary"
              danger={danger}
              loading={loadingBtnOk}
            >
              {okText || t('common.button.accept')}
            </Button>,
          ]
          : []),
      ]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <WarningIcon/>

        {/* {title && (
          <span style={{ fontSize: 20, fontWeight: 500, marginTop: 16 }}>
            {title}
          </span>
        )} */}
        <span className="confirm-modal-title">
          {title || t('common.button.confirm')}
        </span>

        {content && <div className="confirm-modal-content">{content}</div>}
      </div>
    </Modal>
  );
};

export default CommonConfirmModal;
