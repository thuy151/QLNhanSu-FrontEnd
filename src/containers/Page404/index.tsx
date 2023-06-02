import React from 'react'
import { Result } from 'antd';

import CommonButton from './../../components/Common/Button';

function Page404() {
    return (
        <div className="App">
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={
                    <CommonButton
                        btnType="primary"
                        onClick={() => {
                            window.location.href = '/'
                        }}
                    >
                        Về trang chủ
                    </CommonButton>
                }
            />
        </div>
    );
}

export default Page404;

