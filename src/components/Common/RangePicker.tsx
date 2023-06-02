import type { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

import {DATE_FORMAT} from "../../utils/constants";
import generatePicker from 'antd/es/date-picker/generatePicker';

const DatePicker = generatePicker<Moment>(momentGenerateConfig);
const { RangePicker } = DatePicker;

const CommonRangePicker = (props:any) => {
    const childProps = { ...props };
    delete childProps?.isView;
    return <RangePicker
        separator={'-'}
        format={DATE_FORMAT}
        {...childProps}
        className={`avic-range-picker ${childProps?.className || ''}`}
    />
}

export default CommonRangePicker;