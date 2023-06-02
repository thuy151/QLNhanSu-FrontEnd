import {Dropdown, Space, Avatar} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';

import {LANGUAGE_LIST} from "../../utils/constants";
import LocalStorage from "../../utils/localStorage";

function Language() {
    const [language, setLanguage] = useState<any>()

    useEffect(() => {
        const localLanguage = LocalStorage.getInstance().read('language');
        const curLang = LANGUAGE_LIST.find((x:any) => x.value === localLanguage) || LANGUAGE_LIST[0]
        setLanguage(curLang)
    }, [])

    const handleOnChange = (lang:any) => {
        setLanguage(lang)
        LocalStorage.getInstance().save('language', lang?.value);
        window.location.reload()
    }

    const itemsDropdownProfile = useMemo(() => {
        return LANGUAGE_LIST.map((x:any) => ({
            key: x.value,
            label: (<a onClick={() => handleOnChange(x)}>
                <Avatar className="header-language-dropdown-item" src={x?.icon} /> {x.label}
            </a>),
        }))
    }, [])

    return <Dropdown menu={{ items: itemsDropdownProfile }} trigger={["click"]}>
        <Space className="cursor-pointer">
            <Avatar className="header-language" src={language?.icon} />
        </Space>
    </Dropdown>;
}

export default Language;

