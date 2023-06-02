import { Empty, EmptyProps } from "antd";
import { useTranslation } from "react-i18next";

import { ReactComponent as EmptyIcon} from '../../resources/images/empty-icon.svg';

interface CommonEmptyProps extends EmptyProps {
}

const CommonEmpty = (props:CommonEmptyProps) => {
    const { t } = useTranslation();

    return <Empty
        image={<EmptyIcon/>}
        description={
            <span>
                {t('common.dataNotFound')}
            </span>
        }
        {...props}
        className={`avic-empty ${props?.className || ''}`}
    >
        {props?.children}
    </Empty>
}

export default CommonEmpty;