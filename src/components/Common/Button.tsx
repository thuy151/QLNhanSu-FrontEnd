import { Button, ButtonProps } from "antd";

interface CommonButtonProps extends ButtonProps {
    trueWidth?: boolean,
    btnType?: 'primary' | 'info' | 'success' | 'danger' | 'warning' | 'default'
}

const CommonButton = (props:CommonButtonProps) => {
    const {btnType = "default"} = props

    const childProps = { ...props };
    delete childProps?.btnType;

    return <Button
        type="primary"
        {...childProps}
        className={`avic-btn ${props?.className || ''} ${props?.trueWidth ? 'true-width' : ''} ${btnType}`}
    >
        {props?.children}
    </Button>
}

export default CommonButton;