import { Checkbox, CheckboxProps } from "antd";

interface CommonCheckboxProps extends CheckboxProps {

}

const CommonCheckbox = (props:CommonCheckboxProps) => {
    const childProps = { ...props };

    return <Checkbox
        {...childProps}
        className={`avic-checkbox ${props?.className || ''}`}
    >
        {props?.children}
    </Checkbox>
}

export default CommonCheckbox;