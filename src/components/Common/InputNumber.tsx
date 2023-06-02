import { InputNumber, InputNumberProps } from "antd";

interface CommonInputNumberProps extends InputNumberProps {
    isView?: boolean
}

const CommonInputNumber = (props: CommonInputNumberProps) => {
    if (props?.isView) return <div className="avic-input-view">{props?.value || '--'}</div>
    const childProps = { ...props };
    delete childProps?.isView;
    return <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        {...childProps}
        className={`avic-input ${childProps?.className || ''}`}
    />
}

export default CommonInputNumber;