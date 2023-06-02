import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

interface CommonSpinProps {
    children?: any,
    isLoading?: boolean
}

const CommonSpin = (props:CommonSpinProps) => {
    const {
        children,
        isLoading = false
    } = props

    if (!children) {
        return <div className="dpl-flex align-items-center justify-content-center pdt-30 pdbt-30">
            <LoadingOutlined style={{ fontSize: 24 }} spin />
        </div>
    }

    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={isLoading}>
        {children}
    </Spin>
}

export default CommonSpin;