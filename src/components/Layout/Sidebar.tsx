import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Menu } from 'antd';

import { ReactComponent as CollapseIcon } from '../../resources/images/sidebar-collapse-icon.svg';
import { ReactComponent as UnCollapseIcon } from '../../resources/images/sidebar-uncollapse-icon.svg';


const { Sider } = Layout;

function Sidebar(props: any) {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        let newTitle = "";
        if (props?.config?.arrMenus) {
            newTitle = t('layout.sidebar.tabs.systemManagementTitle');
        } else {

        }
        setTitle(newTitle);

    }, [props?.config?.arrMenus, t]);

    return <Sider
        className="sidebar-container"
        collapsible
        collapsed={collapsed}
        trigger={null}
    >
        <div className="sidebar-box">
            <div className="sidebar-content">
                {
                    collapsed &&
                    <div className="un-collapse-icon" onClick={() => setCollapsed(false)}>
                        <UnCollapseIcon />
                    </div>
                }
                {
                    !collapsed &&
                    <div className="collapse-icon" onClick={() => setCollapsed(true)}>
                        <CollapseIcon />
                    </div>
                }

                <div className="logo" >
                    {
                        !collapsed ? title : null
                    }
                </div>

                <div className="menu-wrapper">
                    <Menu
                        selectedKeys={[props?.config?.selectedKeys || "profile"]}
                        defaultOpenKeys={[props?.config?.openKeys]}
                        mode="inline"
                        items={props?.config?.arrMenus}
                    />
                </div>
            </div>
        </div>
    </Sider>;
}

export default Sidebar;