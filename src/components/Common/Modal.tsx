import { Modal, ModalProps } from "antd";

interface CommonModalProps extends ModalProps {

}

const CommonModal = (props:CommonModalProps) => {

    return <Modal
        {...props}
        className={`avic-modal ${props?.className || ''}`}
    >
        {props?.children}
    </Modal>
}

export default CommonModal;