import { Select, SelectProps } from "antd";

interface CommonSelectProps extends SelectProps {
    isView?: boolean,
    options?: any,
}

const CommonSelect = (props:CommonSelectProps) => {
    const {options = [], isView} = props;
    if (isView) {
        const curItem:any = Array.isArray(options) ? options.find(x => x.value === props?.value) : {}
        return <div className="avic-select-view">{curItem?.label || '--'}</div>
    }
    
    const childProps = { ...props };
    delete childProps?.isView;
    return <Select
        {...childProps}
        optionFilterProp="label"
        filterOption={(input, option) =>
            (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
        }
        className={`avic-select ${childProps?.className || ''}`}
    />
}

export default CommonSelect;