import type { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import generatePicker from 'antd/es/date-picker/generatePicker';
import moment from "moment";

import {DATE_FORMAT} from "../../utils/constants";

const DatePicker = generatePicker<Moment>(momentGenerateConfig);

const CommonDatePicker = (props:any) => {
    const {isView, format} = props;
    if (isView) {
        return <div className="avic-select-view">{props?.value ? moment(props?.value).format(format || DATE_FORMAT) : '--'}</div>
    }
    return <DatePicker
        format={DATE_FORMAT}
        {...props}
        className={`avic-datepicker ${props?.className || ''}`}
    />
}

export default CommonDatePicker;