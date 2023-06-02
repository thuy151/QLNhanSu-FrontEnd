import { AutoComplete, AutoCompleteProps } from "antd";

interface CommonAutoCompleteProps extends AutoCompleteProps {
    isView?: boolean,
    options?: any,
}

const CommonAutoComplete = (props:CommonAutoCompleteProps) => {
    const {options = [], isView} = props;
    if (isView) {
        const curItem:any = Array.isArray(options) ? options.find(x => x.value === props?.value) : {}
        return <div className="avic-select-view">{curItem?.label || '--'}</div>
    }
    
    const childProps = { ...props };
    delete childProps?.isView;
    return <AutoComplete
        {...childProps}
        // optionFilterProp="label"
        // filterOption={(input, option) =>
        //     (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
        // }
        filterOption={(inputValue:any, option:any) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        className={`avic-select ${childProps?.className || ''}`}
    />
}

export default CommonAutoComplete;