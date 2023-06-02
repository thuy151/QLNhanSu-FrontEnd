import React from "react";
import { Form, FormItemProps } from "antd";

import CommonInput from "./Input";
import CommonSelect from "./Select";
import CommonDatePicker from "./DatePicker";
import CommonRangePicker from "./RangePicker";
import CommonSwitch from "./Switch";
import CommonTextArea from './TextArea';
import CommonInputNumber from "./InputNumber";
import CommonAutoComplete from "./AutoComplete";
import { DATE_FORMAT } from "../../utils/constants";

interface CommonFormProps extends FormItemProps {
    children?: any,
    type?: 'input' | 'select' | 'datePicker' | 'rangePicker' | 'switch' | 'textArea' | 'inputNumber' | "autoComplete",
    isView?: boolean,
    disabled?: boolean,
    placeholder?: string | string[],
    options?: any[],
    rules?: any,
    label?: any,
    maxLength?: number,
    rows?: number,
    showRequiredIcon?: boolean,
    mode?: "multiple" | "tags" | undefined,
    tagRender?: any,
    allowClear?: boolean,
    min?: number,
    max?: number,
    disabledDate?: any,
    showCount?: boolean,
    onChange?: any,
    showTime?: any,
    format?: string,
    picker?: any,
    maxTagCount?: number | 'responsive'
}

const CommonFormItem = (props: CommonFormProps) => {
    const {
        children,
        className,
        placeholder = '',
        type = 'input',
        options = [],
        isView,
        disabled,
        maxLength,
        rows,
        mode,
        tagRender,
        allowClear = true,
        min,
        max,
        disabledDate,
        showCount = false,
        onChange,
        showTime,
        format,
        maxTagCount,
        picker
        // showRequiredIcon = false
    } = props;

    const showRequiredIcon = props?.showRequiredIcon || false;

    const getElementByType = (typeParam: string) => {
        switch (typeParam) {
            case 'select':
                return <CommonSelect
                    allowClear={allowClear}
                    showSearch
                    placeholder={placeholder}
                    disabled={disabled}
                    isView={isView}
                    options={options} //{value: a, label: string}
                    mode={mode}
                    onChange={onChange}
                    tagRender={tagRender}
                    maxTagCount={maxTagCount}
                />
            case 'autoComplete':
                return <CommonAutoComplete
                    allowClear={allowClear}
                    showSearch
                    placeholder={placeholder}
                    disabled={disabled}
                    isView={isView}
                    options={options} //{value: a}
                />
            case 'datePicker':
                return <CommonDatePicker
                    disabled={disabled}
                    isView={isView}
                    placeholder={placeholder}
                    disabledDate={disabledDate}
                    showTime={showTime}
                    format={format||DATE_FORMAT}
                    picker={picker}
                />
            case 'rangePicker':
                return <CommonRangePicker
                    disabled={disabled}
                    isView={isView}
                    placeholder={placeholder}
                    showTime={showTime}
                    format={format||DATE_FORMAT}
                />
            case 'switch':
                return <CommonSwitch
                    disabled={disabled || isView}
                />
            case 'textArea':
                return <CommonTextArea
                    disabled={disabled || isView}
                    placeholder={placeholder as string}
                    rows={rows as number}
                    maxLength={maxLength}
                    showCount={showCount}
                />
            case 'inputNumber':
                return <CommonInputNumber
                    disabled={disabled}
                    isView={isView}
                    placeholder={placeholder as string}
                    min={min}
                    max={max}
                />
            default:
                return <CommonInput
                    disabled={disabled}
                    isView={isView}
                    placeholder={placeholder as string}
                    maxLength={maxLength}
                // allowClear
                />
        }
    }

    const childProps = { ...props };
    delete childProps?.showRequiredIcon;
    delete childProps?.isView;
    delete childProps?.tagRender;
    delete childProps?.rows;
    delete childProps?.mode;
    delete childProps?.maxLength;
    delete childProps?.showCount;
    delete childProps?.onChange;
    delete childProps?.showTime;
    delete childProps?.format;
    delete childProps?.allowClear;
    delete childProps?.maxTagCount;
    delete childProps?.disabledDate;
    delete childProps?.picker;

    return <Form.Item
        validateTrigger={"onBlur"}
        {...childProps}
        label={
            childProps.label ?
                <span>
                    {childProps.label}
                    {showRequiredIcon && <span className="required-mark">*</span>}
                </span>
                : null
        }
        className={`avic-form-item ${isView ? 'is-view' : ''} ${className || ''}`}
    >
        {children || getElementByType(type)}
    </Form.Item>
}

export default CommonFormItem;