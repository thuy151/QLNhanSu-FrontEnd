import { Switch, SwitchProps } from "antd";

interface CommonSwitchProps extends SwitchProps {

}

const CommonSwitch = (props:CommonSwitchProps) => {
    return <Switch
        {...props}
        className={`avic-switch ${props?.className || ''}`}
    />
}

export default CommonSwitch;