import { Dropdown, DropdownProps } from "antd";

interface CommonDropdownProps extends DropdownProps {
}

const CommonDropdown = (props:CommonDropdownProps) => {

    return <Dropdown
        {...props}
        className={`avic-dropdown ${props?.className || ''}`}
    >
        {props?.children}
    </Dropdown>
}

export default CommonDropdown;