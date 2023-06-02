import { Tag, TagProps } from "antd";

interface CommonTagProps extends TagProps {
    tagType?: 'primary' | 'info' | 'success' | 'danger' | 'warning' | 'default';
}

const CommonTag = (props:CommonTagProps) => {
    const {tagType = "default"} = props;

    const childProps = { ...props };
    delete childProps?.tagType;

    return <Tag
        {...childProps}
        className={`avic-tag ${props?.className || ''} ${tagType}`}
    >
        {props?.children}
    </Tag>
}

export default CommonTag;