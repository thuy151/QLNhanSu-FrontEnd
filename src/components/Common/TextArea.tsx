import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";

interface CommonTextAreaProps extends TextAreaProps {
    isView?: boolean
}

const { TextArea } = Input;

const CommonTextArea = (props: CommonTextAreaProps) => {
    if (props?.isView) return <div className="avic-input-view">{props?.value || '--'}</div>
    const childProps = { ...props };
    delete childProps?.isView;
    return <TextArea
        style={{ resize: 'none' }}
        {...childProps}
        maxLength={childProps?.maxLength || 1500}
        // autoSize={{ minRows: 1, maxRows: 2 }}
        className={`avic-input avic-text-area ${childProps?.className || ''}`}
    />
}

export default CommonTextArea;