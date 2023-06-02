import ViIcon from "../resources/images/vietnamese.svg";
import UkIcon from "../resources/images/english.svg";

// ROLE_ADMIN
// ROLE_SALE_LEADER
// ROLE_SALE_MAN
// ROLE_SALE_MANAGER
// ROLE_SALE_ADMIN
// ROLE_ACCOUNTANT

export const ROUTER_ROLE = [
    {
        scene: 'dashboard',
        roles: null //['ROLE_ADMIN', 'ROLE_SALE_LEADER', 'ROLE_SALE_MAN', 'ROLE_SALE_MANAGER', 'ROLE_SALE_ADMIN', 'ROLE_ACCOUNTANT']
    },
    {
        scene: 'quote-status',
        roles: null
    },
    {
        scene: 'purchases-status',
        roles: null
    },
    {
        scene: 'manage-quote-request',
        roles: null
    },
    {
        scene: 'roles',
        roles: null
    },
]
export const ROLES_LIST = [
    {
        id: 'ROLE_ADMIN',
        name: 'Admin'
    },
    {
        id: 'ROLE_SALE_MANAGER',
        name: 'Sale Manager'
    },
    {
        id: 'ROLE_SALE_LEADER',
        name: 'Sale Leader'
    },
    {
        id: 'ROLE_SALE_MAN',
        name: 'Sale man'
    },
    {
        id: 'ROLE_SALE_ADMIN',
        name: 'Sale Admin'
    },
    {
        id: 'ROLE_ACCOUNTANT',
        name: 'Accountant'
    },
]
export const LANGUAGE_LIST = [
    {
        value: 'vi',
        label: 'Tiếng Việt',
        icon: ViIcon
    },
    {
        value: 'en',
        label: 'English',
        icon: UkIcon
    },
]
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY, HH:mm';
export const DATE_TIME_FORMAT_SECOND = 'DD/MM/YYYY, HH:mm:ss';
export const DOB_FORMAT = 'DD MMMM, YYYY';
export const PAGE_SIZE_LIST = [1, 10, 20, 50, 100]
export const DEFAULT_PAGE_SIZE = 10
// export const REGEX_PASSWORD = /(?=^.{8,}$)(?=.*[0-9])(?=.*[A-Za-z]).*/g
export const REGEX_USERNAME = /^([a-zA-Z0-9_]+)$/g
export const REGEX_CODE = /^([a-zA-Z0-9]+)$/g
export const REGEX_PHONE_NUMBER = /^[0-9]([0-9]+){9}$/g
export const REGEX_EMAIL= /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g
export const REGEX_ONLY_NUMBER = /^[0-9]+$/g
export const REGEX_NO_SPACE = /^\S*$/

export const AT_LEAST_8_CHARS = /^.{8,}$/;    // Ít nhất 8 kí tự
// export const AT_LEAST_1_UPPERCASE = /^(?=.*[A-Z]).*$/;    // Ít nhất 1 kí tự viết hoa
export const AT_LEAST_1_NUMBER = /^(?=.*\d).*$/;  // Ít nhất 1 số
export const REGEX_PASSWORD = /^(?=.*\d).{8,}$/;

export const VI_MOMENT_CONFIG = {
    week: {
        dow: 1 /// Date offset
    },
    months: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ],
    monthsShort: [
        'Thg 1',
        'Thg 2',
        'Thg 3',
        'Thg 4',
        'Thg 5',
        'Thg 6',
        'Thg 7',
        'Thg 8',
        'Thg 9',
        'Thg 10',
        'Thg 11',
        'Thg 12',
    ],
    weekdays: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    weekdaysShort: ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'],
    weekdaysMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    relativeTime: {
        future: 'trong %s',
        past: '%s trước',
        s: 'vài giây trước',
        ss: '%d giây',
        m: '1 phút',
        mm: '%d phút',
        h: '1 giờ',
        hh: '%d giờ',
        d: '1 ngày',
        dd: '%d ngày',
        w: '1 tuần',
        ww: '%d tuần',
        M: '1 tháng',
        MM: '%d tháng',
        y: '1 năm',
        yy: '%d năm',
    },
}

//rolePage
export const ROLE_PAGE_STATUS = [
    {
        value: 0,
        label: 'permissionsPage.status.active',
        type: 'success'
    },
    {
        value: 1,
        label: 'permissionsPage.status.inactive',
        type: 'default'
    },
]
//accountsPage 
export const ACCOUNTS_STATUS = [
    {
        value: 1,
        label: 'accountsPage.status.active',
        type: 'success',
        color: 'green'
    },
    {
        value: 2,
        label: 'accountsPage.status.inactive',
        type: 'default',
        color: 'red'
    },
]
export const ACCOUNT_PAGE_STATUS = [
    {
        value: 0,
        type: 'success',
        label: "Hoạt động",
    },
    {
        value: 1,
        type: 'default',
        label: "Không hoạt động",
    },
]


export const PERMISSION_LIST = [
    {
        value: 0,
        label: "Admin",
    },
    {
        value: 1,
        label: "Quản lý",
    },
    {
        value: 2,
        label: "Nhân viên",
    },
    {
        value: 3,
        label: "Kế toán",
    },
];

export const ROLE_LIST=[
    {
        value: 0,
        label: "ADMIN",
    },
    {
        value: 1,
        label: "MANAGER",
    },
    {
        value: 2,
        label: "EMPLOYEE",
    },
    {
        value: 3,
        label: "ACCOUNTANT",
    },
]

export const LIST_COLOR = [
    "#3B82F6",
    "#EF4444",
    "#A855F7",
    "#22C55E",
    "#FACC15",
    "#F97316",
    "#78716C",
    "#94A3B8",
    "#EB77A6",
    "#663300",
    "#333300",
    "#99FF00",
    "#ACD1E9",
    "#6D929B",
    "#006400",    
    "#3399CC",
    "#993300",
    "#CC3399",
    "#006600",
    "#8B4513",
    "#FF9966",
    "#363636",
    "#D3D3D3",
    "#CC3366",
    "#003300",
    "#003366",
    "#339900",
    "#33FFFF",
    "#FFFF00",
    "#AA0000",
    "#336666",
    "#FF3366",
    "#005500",
    "#663300",
    "#FF33CC",
    "#3366CC",
    "#996666",
    "#FFCC66",
    "#CCCC00",
    "#CCCCFF",
    "#FFCCFF",
    "#FFFFFF",
    "#222222",
    "#666666",
    "#FF3333",
];

