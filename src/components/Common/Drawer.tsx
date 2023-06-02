import { Drawer, DrawerProps } from "antd";

interface CommonDrawerProps extends DrawerProps {
}

const CommonDrawer = (props:CommonDrawerProps) => {

    return <Drawer
        {...props}
        className={`avic-drawer ${props?.className || ''}`}
    >
        {props?.children}
    </Drawer>
}

export default CommonDrawer;