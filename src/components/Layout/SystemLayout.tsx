import { Breadcrumb, Layout, Space } from 'antd';
import React, { useMemo, ReactNode } from 'react';

import Sidebar from "./Sidebar";
import { ReactComponent as Logo } from "../../resources/images/logo.svg";
import { ReactComponent as HomeIcon } from "../../resources/images/home.svg";
import { ReactComponent as ProfileIcon } from "../../resources/images/user_settings.svg";
import { ReactComponent as AccountManagementIcon } from "../../resources/images/user.svg";
import { ReactComponent as StaffIcon } from "../../resources/images/staff.svg";
import { ReactComponent as RestIcon } from "../../resources/images/rest.svg";
import { ReactComponent as ContractIcon } from "../../resources/images/contract.svg";
import { ReactComponent as CategoryIcon } from "../../resources/images/category.svg";
import { ReactComponent as DotIcon } from "../../resources/images/dot.svg";
import { ReactComponent as RewardEmployeeIcon } from "../../resources/images/reward-employee.svg";
import { ReactComponent as SalaryIcon } from "../../resources/images/salary.svg";
import { ReactComponent as ReportIcon } from "../../resources/images/report_icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderProfile from "./HeaderProfile";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
const { Header, Content } = Layout;

interface LayoutProps {
    children: ReactNode
}

function SystemLayout(props: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const {
        profile
    } = useSelector((state: any) => state?.profileReducer);

    const items: any = useMemo(() => [
        {
            label: t('layout.sidebar.menu.home'),
            key: 'home',
            icon: <div className="sidebar-icon">
                <HomeIcon />
            </div>,
            onClick: () => {
                navigate('/')
            }
        },
        {
            label: t('layout.sidebar.menu.personalInfo'),
            key: 'profile',
            icon: <div className="sidebar-icon">
                <ProfileIcon />
            </div>,
            onClick: () => {
                navigate(`/profile`)
            }
        },
        {
            label: t('layout.sidebar.menu.accountManagement'),
            key: 'account',
            icon: <div className="sidebar-icon">
                <AccountManagementIcon />
            </div>,
            onClick: () => {
                navigate(`/account`)
            },
            hidden: profile?.scope === "ADMIN" ? false : true
        },
        {
            label: t('Quản lý nhân viên'),
            key: 'employee',
            icon: <div className="sidebar-icon">
                <StaffIcon />
            </div>,
            onClick: () => {
                navigate(`/employee`)
            },
            hidden: (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") ? false : true,
        },
        {
            label: t('Quản lý nghỉ phép'),
            key: 'rest',
            icon: <div className="sidebar-icon">
                <RestIcon />
            </div>,
            onClick: () => {
                navigate(`/rest`)
            }
        },
        {
            label: t('Quản lý hợp đồng'),
            key: 'contract',
            icon: <div className="sidebar-icon">
                <ContractIcon />
            </div>,
            onClick: () => {
                navigate(`/contract`)
            },
            hidden: (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") ? false : true,
        },
        {
            label: t('Khen thưởng- kỷ luật nhân viên'),
            key: 'discipline-reward-employee',
            icon: <div className="sidebar-icon">
                <RewardEmployeeIcon />
            </div>,
            onClick: () => {
                navigate(`/discipline-reward-employee`)
            }
        },
        {
            label: t('Quản lý danh mục'),
            key: 'manage-category',
            icon: <div className="sidebar-icon">
                <CategoryIcon />
            </div>,
            hidden: (profile?.scope === "ADMIN" || profile?.scope === "MANAGER") ? false : true,
            children: [
                {
                    label: t('Danh mục chức vụ'),
                    key: 'position',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/position`)
                    }
                },
                {
                    label: t('Danh mục phòng ban'),
                    key: 'department',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/department`)
                    }
                },
                {
                    label: t('Danh mục chứng chỉ'),
                    key: 'certificate',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/certificate`)
                    }
                },
                {
                    label: t('Danh mục khen thưởng - kỷ luật'),
                    key: 'discipline-reward',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/discipline-reward`)
                    }
                },
            ]
        },
        {
            label: t(' Quản lý bảng lương'),
            key: 'manage-salary',
            icon: <div className="sidebar-icon">
                <SalaryIcon />
            </div>,
            hidden: profile?.scope !== "EMPLOYEE" ? false : true,
            children: [
                {
                    label: t('Tính lương'),
                    key: 'calculate-salary',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/calculate-salary`)
                    }
                },
                {
                    label: t('Danh sách bảng lương'),
                    key: 'salary',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    onClick: () => {
                        navigate(`/salary`)
                    }
                },
                {
                    label: t('Thống kê lương'),
                    key: 'report-salary',
                    icon: <div className="sidebar-icon">
                        <DotIcon />
                    </div>,
                    hidden: profile?.scope !== "EMPLOYEE" ? false : true,
                    onClick: () => {
                        navigate(`/report-salary`)
                    },
                }
            ]
        },

    ], [navigate, profile?.scope, t]);

    const config = useMemo(() => {
        const pathname = location?.pathname;
        const splitPathname = pathname.split('/')[1]
        const actionName = pathname.split('/')[2]
        const selectedKeys = pathname === "/" ? "home" : splitPathname
        let openKeys = "";
        let arrMenus = []
        let breadcrumb = [<Link to="/">{t("layout.sidebar.menu.home") as string}</Link>];


        for (let i = 0; i < items.length; i++) {
            if (Array.isArray(items[i]?.children)) {
                let newChild: any = []
                items[i]?.children.map((child: any) => {
                    // if (isHavePermissionScene(child.key, profile) && !child.hidden) {
                    if (!child.hidden) {
                        newChild.push(child)
                    }
                    return true;
                })
                if (newChild.length > 0) {
                    arrMenus.push({
                        ...items[i],
                        children: newChild
                    })
                }
            } else {
                if (!items[i].hidden) {
                    // if (isHavePermissionScene(items[i].key, profile) && !items[i].hidden) {
                    arrMenus.push({
                        ...items[i],
                    })
                }
            }
            if (items[i].key === selectedKeys) {
                breadcrumb.push(items[i].label)

                // add action like: create, edit, detail to breadcrumb
                const action = actionName && Array.isArray(items[i].actions) ? items[i].actions.find((x: any) => x.key === actionName) : null
                if (action) {
                    breadcrumb.push(action?.label)
                }
            } else {
                if (Array.isArray(items[i]?.children)) {
                    const child = items[i].children.find((x: any) => x.key === selectedKeys)
                    if (child) {
                        openKeys = items[i].key
                        breadcrumb.push(items[i].label)
                        breadcrumb.push(child.label)

                        // add action like: create, edit, detail to breadcrumb
                        const action = actionName && Array.isArray(child.actions) ? child.actions.find((x: any) => x.key === actionName) : null
                        if (action) {
                            breadcrumb.push(action?.label)
                        }
                    }
                }
            }
        }

        return {
            selectedKeys,
            openKeys,
            arrMenus,
            breadcrumb
        }
    }, [items, location?.pathname, t]);


    return (
        <Layout className={'fixed-sidebar full-height-layout'} style={{ minHeight: '100vh' }}>
            <Sidebar config={config} />
            <Layout className="main-layout fixed-header">
                <Header>
                    <div className="main-header">
                        <div className="main-header-left">
                            <div className="page-logo"><Logo /></div>
                            <div className="page-title">
                                {t('layout.header.title')}
                            </div>
                        </div>
                        <Space
                            size={20}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                height: "100%"
                            }}
                        >
                            <div className="main-header-user">
                                <div className="main-header-user-name">{profile?.employee?.name}</div>
                                <div className="main-header-user-position">{profile?.employee?.position?.name}</div>
                            </div>

                            <HeaderProfile />
                        </Space>
                    </div>
                </Header>
                <Breadcrumb className="avic-breadcrumb">
                    {
                        Array.isArray(config?.breadcrumb) && config?.breadcrumb.map((x, y) => {
                            return <Breadcrumb.Item key={y}>{x}</Breadcrumb.Item>
                        })
                    }
                </Breadcrumb>
                <Content>
                    <div className="main-layout-background">
                        {props.children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default SystemLayout;

