import {Modal, notification, Divider, Tag} from "antd";
import React, {useState, useImperativeHandle, useEffect} from "react";
import {SettingOutlined, CloseOutlined} from "@ant-design/icons";

import CommonSelect from "../Common/Select";
import CommonInput from "../Common/Input";
import {useQuery} from "../../utils/customHooks";

const DynamicSearchModal = React.forwardRef((props:any, ref) => {
    const {data = [], formRef} = props

    // const navigate = useNavigate();
    const queryObj:any = useQuery();
    const {params = {}, search} = queryObj
    // const {
    //     keyword: keywordQuery,
    //     advance: advanceQuery,
    //     requestCode: requestCodeQuery,
    // } = params;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todoList, setTodoList] = useState<any>([
        {id: 1, label: '', prop: '', type: '', value: '', selectOptions: []}
    ]);

    useEffect(() => {
        let arr = []
        let id = 1
        for(let p in params) {
            //detect if data has own prop
            const curData = data.find((x:any) => x.value === p)
            if (p && curData) {
                arr.push({
                    id: id, label: curData.label, prop: p, type: curData.type, value: params[p], selectOptions: curData?.selectOptions || []
                })
                id++
            }
        }
        arr.push({id: id, label: '', prop: '', type: '', value: '', selectOptions: []})
        setTodoList(arr)
    }, [search])

    useImperativeHandle(ref, () => {
        return {
            todoList
        }
    }, [todoList])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // submit form
        if (formRef?.submit) { formRef?.submit() }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOnChange = (item:any, value:any) => {
        let newTodoList = [...todoList]
        let curItemIndex = newTodoList.findIndex((x:any) => x.id === item.id)
        let curItem = newTodoList[curItemIndex]
        curItem.value = value
        newTodoList[curItemIndex] = curItem
        setTodoList(newTodoList)
    }

    const handleChangeProp = (item:any, value:any) => {
        if (todoList.find((x:any) => x.prop === value)) {
            notification.warning({
                message: 'Giá trị đã được chọn.',
            })
            return
        }
        let newTodoList = [...todoList]
        const curDataItem = data.find((x:any) => x.value === value)
        if (!item.prop) { // if empty item => add new empty item
            newTodoList.push({id: item.id+1, label: '', prop: '', type: '', value: ''})
        }
        let curItemIndex = newTodoList.findIndex((x:any) => x.id === item.id)
        let curItem = newTodoList[curItemIndex]
        curItem.label = curDataItem?.label
        curItem.prop = curDataItem?.value
        curItem.type = curDataItem?.type
        curItem.selectOptions = curDataItem?.selectOptions || []
        newTodoList[curItemIndex] = curItem

        setTodoList(newTodoList)
    }

    const onRemoveItem = (item:any) => {
        if (!item.prop) {
            return
        }
        let newTodoList = [...todoList]
        newTodoList = newTodoList.filter((x:any) => x.id !== item.id)
        setTodoList(newTodoList)
        if (formRef?.submit) { formRef?.submit() }
    }

    const getElementByType = (item:any) => {
        switch (item?.type) {
            case 'select':
                return <CommonSelect
                    className="width-100-percent"
                    placeholder={"Chọn giá trị"}
                    value={item.value || []}
                    options={item?.selectOptions || []}
                    onChange={(value) => handleOnChange(item, value)}
                />
            default:
                return <CommonInput
                    placeholder={"Nhập giá trị"}
                    className="width-100-percent"
                    value={item.value}
                    onChange={(e) => handleOnChange(item, e.target.value)}
                />
        }
    }

    const renderItem = (item:any, index:any) => {
        return <div key={index} className="dpl-flex align-items-center justify-content-space-between pdbt-15">
            <div className="pdr-15">
                <CommonSelect
                    className="width-150"
                    placeholder={"Chọn filter"}
                    options={data || []}
                    value={item.prop || []}
                    onChange={(value) => handleChangeProp(item, value)}
                />
            </div>

            {getElementByType(item)}

            <CloseOutlined className="cursor-pointer pdl-10" onClick={() => onRemoveItem(item)}/>
        </div>
    }

    const renderItemCur = (item:any, index:any) => {
        if (item?.prop && item?.value !== '') {
            return <div key={index}>
                <Tag
                    color="purple"
                    closable
                    onClose={() => onRemoveItem(item)}
                >
                    <span className="bold pdr-5">{item?.label}:</span>
                    <span>{item?.type === 'select' ? item?.selectOptions.find((x:any) => x.value === item?.value)?.label : item?.value}</span>
                </Tag>
            </div>
        }
        return null
    }

    return <div className="pdbt-10">
        <div className="dpl-flex align-items-center">
            <div className="flex-none">
                <SettingOutlined
                    className="cursor-pointer txt-blue"
                    onClick={() => {
                        showModal()
                    }}
                />
                <Divider type="vertical" />
            </div>
            <div className="dpl-flex align-items-center">
                {
                    todoList.map((item:any, index:any) => renderItemCur(item, index))
                }
            </div>
        </div>

        <Modal title="Tìm kiếm nâng cao" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {
                todoList.map((item:any, index:any) => renderItem(item, index))
            }
        </Modal>
    </div>
})

export default DynamicSearchModal;