import _ from 'lodash';
import {DATE_FORMAT, DEFAULT_PAGE_SIZE, ROUTER_ROLE, TIME_FORMAT} from "./constants";
import moment from "moment";

/**
 * clear các props ko thuộc DOM cho bớt warning
 * @param props
 * @returns {*}
 */
export function getDOMProps(props) {
    let newProps = {...props}

    delete newProps.isView
    delete newProps.isLoading
    delete newProps.data
    delete newProps.pagination

    return newProps
}

/**
 * thêm mới hoặc sửa lại param của query string
 * @param uri
 * @param key
 * @param value
 * @returns {*}
 */
export function updateQueryStringParameter(uri, key, value) {
    if (uri === undefined || uri === null) return '';
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (value === null) {
        return uri.replace(re, '$1' + '$2');
    }
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + encodeURIComponent(value) + '$2');
    }
    else {
        return uri + separator + key + "=" + encodeURIComponent(value);
    }
}

/**
 * xây dựng query string theo các giá trị trong data
 * @returns {string}
 */
export const buildQueryString = (data = {}) => {
    let queryString = '';
    for (let p in data) {
        if (p && data[p] !== "" && data[p] !== undefined && data[p] !== null) {
            if (!Array.isArray(data[p])) {
                queryString = updateQueryStringParameter(queryString, p, data[p])
            } else if (data[p].length > 0) {
                queryString = updateQueryStringParameter(queryString, p, data[p])
            }
        }
    }

    return queryString
};

export function changeThemeCss(data) {

    //sidebar, header color, scroll
    //--colorHeader: #5C4E8E;
    //--sidebarContentBg: linear-gradient(180deg, #5B4D8C 0%, #413A6C 98.42%);
    //--sidebarContentTextColor1: #fff;
    //--sidebarContentTextColor2: #1D1F3E;
    //--sidebarContentTextColor3: #bab6cb;

    //button
    //--btnPrimaryColor: #fff;
    //--btnBgPrimary: #092C4C;
    //--btnBgPrimaryHover: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), #092C4C;
    //--btnBgPrimaryActive: linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), #092C4C;
    //--btnBgPrimaryDisable: #E0E0E0;

    //input
    //--commonInputColor: #262626;
    //--commonInputBg: #F9FAFB;
    //--commonInputPlaceholder: #98999B;
    //--commonInputDisable: #E2E8EC;

    document.documentElement.setAttribute("style", `
        --colorHeader: ${data.background};
        --sidebarContentBg: ${data.background};
    `);
}

export function isHavePermission(permission, cLoggedUser) {
    const currentLoggedUser = cLoggedUser

    if (currentLoggedUser) {
        if (Array.isArray(currentLoggedUser.roles)) {
            if (currentLoggedUser.roles.includes(permission)) {
                return true
            }
        }
    }

    return false
}

export function isHavePermissionScene(scene, cLoggedUser) {
    const currentLoggedUser = cLoggedUser
    if (currentLoggedUser) {
        const curScene = ROUTER_ROLE.find(x => x.scene === scene) || {}
        if (!curScene.roles) {
            return true
        }
        if (Array.isArray(curScene.roles) && Array.isArray(currentLoggedUser.roles)) {
            for (let i = 0; i < curScene.roles.length; i++) {
                if (currentLoggedUser.roles.includes(curScene.roles[i])) {
                    return true
                }
            }
        }
    }

    return false
}

export function modifyArrTreeSelect(arr, level, arrayOrigin) {
    let lvl = level || 1
    let arrOrigin = arrayOrigin || arr
    if (!Array.isArray(arr) || arr.length < 1) {
        return []
    }

    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (lvl > 1) {
            if (!arrOrigin.find(x => x.userName === arr[i].userName)) {
                newArr.push({
                    title: `${arr[i].fullName} (${arr[i].userName})`,
                    value: arr[i].userName,
                    key: arr[i].userName,
                })
            }
        } else {
            newArr.push({
                title: `Team Sale ${i+1} (${arr[i].userName})`,
                value: `team_sale_${i+1}`,
                key: `team_sale_${i+1}`,
                children: [
                    {
                        title: `${arr[i].fullName} (${arr[i].userName})`,
                        value: arr[i].userName,
                        key: arr[i].userName,
                    },
                    ...modifyArrTreeSelect(arr[i].saleManList, lvl+1, arrOrigin)
                ],
            })
        }
    }

    return newArr
}

export function modifyArrTreePermission(arr, itemParent) {
    let level = itemParent ? itemParent?.level + 1 : 1
    if (!Array.isArray(arr) || arr.length < 1) {
        return []
    }

    let newArr = []
    let arrByLevel = arr.filter(x => x.level === level)
    if (itemParent) {
        arrByLevel = arrByLevel.filter(x => x.parentId === itemParent?.permissionId)
    }
    for (let i = 0; i < arrByLevel.length; i++) {
        const item = arrByLevel[i]
        if (item) {
            newArr.push({
                title: item?.name,
                key: item?.permissionId,
                children: [
                    ...modifyArrTreePermission(arr, item)
                ],
            })
        }
    }

    return _.orderBy(newArr, 'key')
}

export const modifyResultActions = (arrObj = []) => {
    let resultArr = []
    let newArr = []
    if (Array.isArray(arrObj)) {
        arrObj.map((item) => {
            const itemDate = moment(item?.createdDate).format(DATE_FORMAT)
            const itemTime = moment(item?.createdDate).format(TIME_FORMAT)
            const existObj = newArr.find((x) => x.title === itemDate)
            const existObjIndex = newArr.findIndex((x) => x.title === itemDate)
            const descriptionObj = {
                time: itemTime,
                content: item.message
            }
            if (existObj) {
                newArr[existObjIndex] = {
                    title: itemDate,
                    descriptionArr: [
                        ...existObj.descriptionArr,
                        descriptionObj
                    ]
                }
            } else {
                newArr.push({
                    title: itemDate,
                    descriptionArr: [descriptionObj]
                })
            }
        })
    }

    newArr.map((item, index) => {
        const descriptionElements = <div key={index}>{item.descriptionArr.map((x, y) => <div key={y}>{x.time}: {x.content}</div>)}</div>
        resultArr.push({
            title: item.title,
            description: descriptionElements,
        })
    })
    return resultArr
}

export function modifyArrTreeDepartmentGrid(arr, itemParent) {
    if (!Array.isArray(arr) || arr.length < 1) {
        return []
    }

    let newArr = []
    let arrByLevel = arr.filter(x => x.parentId === null || x.parentId === undefined)
    if (itemParent) {
        arrByLevel = arr.filter(x => x.parentId === itemParent?.deptId)
    }
    for (let i = 0; i < arrByLevel.length; i++) {
        const item = arrByLevel[i]
        if (item) {
            newArr.push({
                name: `${item?.deptName} (${item?.deptCode})`,
                attributes: {
                    id: item?.deptId,
                    active: item?.status,
                },
                children: [
                    ...modifyArrTreeDepartmentGrid(arr, item)
                ],
            })
        }
    }

    return _.orderBy(newArr, 'key')
}

export function modifyArrTreeDepartment(arr ,itemParent, secondArr) {
    console.log("itemParent",itemParent?.deptName)
    if (!Array.isArray(arr) || arr.length < 1) {
        return []
    }

    let newArr = [];
    let arrByLevel = arr.filter(x => x.parentId === null || x.parentId === undefined || !arr.some(item => item.deptId === x.parentId));
    if (itemParent) {
        arrByLevel = arr.filter(x => x.parentId === itemParent?.deptId)
    }
    console.log("arrByLevel",arrByLevel)
    for (let i = 0; i < arrByLevel.length; i++) {
        const item = arrByLevel[i]
        if (item) {
            if(arr.some(x => x.parentId === item?.deptId )){
                newArr.push({
                    ...item,
                    children: [
                        ...modifyArrTreeDepartment(arr, item)
                    ],
                });
            }else{
                newArr.push(item)
            }
        }
    }

    return _.orderBy(newArr, 'key')
}

