import { Form, FormProps } from "antd";

import CommonSpin from "./Spin";

interface CommonFormProps extends FormProps {
    children: any,
    isLoading?: boolean,
}

const CommonForm = (props:CommonFormProps) => {
    const formProps = {...props};
    delete formProps.isLoading;

    return <CommonSpin isLoading={props?.isLoading}>
        <Form
            {...formProps}
            className={`avic-form ${formProps?.className || ''}`}
        >
            {formProps?.children}
        </Form>
    </CommonSpin>
}

export default CommonForm;