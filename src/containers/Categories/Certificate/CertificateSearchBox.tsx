import React, { useEffect, useState } from 'react'
import { buildQueryString } from '../../../utils/utilFunctions'
import { useQuery } from '../../../utils/customHooks'
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Space } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

import { ReactComponent as Search } from "../../../resources/images/search-1.svg";

import CommonButton from "../../../components/Common/Button";
import CommonForm from "../../../components/Common/Form";
import CommonFormItem from '../../../components/Common/FormItem';
import CommonInput from "../../../components/Common/Input";

function CertificateSearchBox(props: any) {
    const componentPath = props?.componentPath
    const navigate = useNavigate();
    const queryObj: any = useQuery();
    const { params = {}, search } = queryObj
    const {
        searchText: searchTextQuery,
        advance: advanceQuery,
        // name: nameQuery,
        // email: emailQuery,
        // phoneNumber: phoneNumberQuery,
        // status: statusQuery,
        // modifiedBy: modifiedByQuery,
        // modifiedDateFrom: modifiedDateFromQuery,
        // modifiedDateTo: modifiedDateToQuery,
    } = params;

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const [advance, setAdvance] = useState(advanceQuery === 'true' || false)
    useEffect(() => {
        setAdvance(advanceQuery === 'true')
    }, [advanceQuery])

    const onFinish = (values: any) => {
        onSearch(values)
    }

    const onClear = (clearParams = {}) => {
        onSearch({ ...clearParams }, true)
        setTimeout(() => {
            form.resetFields();
        }, 100)
    }

    const onSearch = (data: any = {}, isClear?: boolean) => {
        // const dataSearch = { ...data };
        // if (data?.modifiedDate?.length) {
        //     dataSearch["modifiedDateFrom"] = data?.modifiedDate[0].toISOString();
        //     dataSearch["modifiedDateTo"] = data?.modifiedDate[1].toISOString();
        // }
        // delete dataSearch.advance;
        // delete dataSearch?.modifiedDate;
        let queryString = {
            advance,
            currentPageNumber: 1,
            // search: JSON.stringify(dataSearch),
            searchText: data?.searchText
        }
        if (isClear) {
            queryString.advance = data.advance;
        }
        // detect if query not change => call api
        if (queryString !== search) {
            navigate(`${componentPath}${buildQueryString(queryString) || ''}`)
        } else {
            if (props?.getData) props?.getData()
        }
    }

    return <div className="avic-search-box">
        {
            !advance ?
                <div className="normal-search-box">
                    <CommonForm
                        form={form}
                        onFinish={onFinish}
                        layout="horizontal"
                        initialValues={{
                            searchText: searchTextQuery,
                        }}
                    >
                        <CommonFormItem name="searchText">
                            <CommonInput
                                placeholder={t('accountPage.searchBox.placeholder.advancedSearch') as string}
                                prefix={
                                    <div
                                        onClick={() => {
                                            onClear({ advance: true })
                                            // setAdvance(true)
                                        }}
                                        className="open-advance-search-btn"
                                    >
                                        {t('Tìm kiếm nâng cao')}
                                        <CaretDownOutlined />
                                    </div>
                                }
                                addonAfter={
                                    <div onClick={() => form.submit()} className="btn-normal-search">
                                        <Search />
                                    </div>
                                }
                            />
                        </CommonFormItem>
                    </CommonForm>
                </div>
                :
                <div className="advance-search-box">
                    <div
                        className="close-advance-search-btn cursor-pointer"
                        onClick={() => {
                            // onClear()
                            // setAdvance(false)
                            onClear({ advance: false })
                        }}
                    >
                        <div>
                            {t('accountPage.searchBox.title')}
                        </div>
                        <CaretUpOutlined
                            className="cursor-pointer"
                        />
                    </div>

                    <CommonForm
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{
                            // name: nameQuery,
                            // email: emailQuery,
                            // phoneNumber: phoneNumberQuery,
                            // status: statusQuery,
                            // modifiedBy: modifiedByQuery,
                            // modifiedDate: (modifiedDateFromQuery && modifiedDateToQuery) ? [moment(modifiedDateFromQuery), moment(modifiedDateToQuery)] : [],
                            // modifiedDate: modifiedDateQuery ? modifiedDateQuery.split(',').map((x:any) => moment(x)) : undefined, //[M, M]
                        }}
                    >
                        <Row gutter={30}>
                            <Col span={12}>
                                <CommonFormItem
                                    name="name"
                                    label={t('Tên chứng chỉ')}
                                    placeholder={t('Nhập tên chứng chỉ') as string}
                                />
                            </Col>
                            <Col span={12}>
                                <CommonFormItem
                                    name="expiry"
                                    label={t('Thời hạn')}
                                    placeholder={t('Nhập thời hạn') as string}

                                />
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={12}>
                                <CommonFormItem
                                    name="modifiedBy"
                                    label={t('accountPage.searchBox.label.modifiedBy')}
                                    placeholder={t('accountPage.searchBox.placeholder.modifiedBy') as string}
                                />
                            </Col>
                            <Col span={12}>
                                <CommonFormItem
                                    name="modifiedDate"
                                    type="rangePicker"
                                    label={t('accountPage.searchBox.label.modifiedDate')}
                                    placeholder={[t('common.fromDate'), t('common.toDate')]}
                                />
                            </Col>
                        </Row>
                        <Space className="form-btn-container">
                            <CommonButton btnType="default" size={'small'} onClick={() => onClear({ advance: true })}>
                                {t('common.button.deleteCondition')}
                            </CommonButton>
                            <CommonButton btnType="primary" size={'small'} htmlType="submit">
                                {t('common.button.search')}
                            </CommonButton>
                        </Space>

                    </CommonForm>
                </div>
        }
    </div>
}

export default CertificateSearchBox;

