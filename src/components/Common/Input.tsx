import { Input, InputProps } from "antd";

interface CommonInputProps extends InputProps {
    isView?: boolean
}

const CommonInput = (props:CommonInputProps) => {
    if (props?.isView) return <div className="avic-input-view">{props?.value || '--'}</div>
    const childProps = { ...props };
    delete childProps?.isView;
    return <Input
        {...childProps}
        maxLength={childProps?.maxLength || 150}
        className={`avic-input ${childProps?.className || ''}`}
    />
}

export default CommonInput;