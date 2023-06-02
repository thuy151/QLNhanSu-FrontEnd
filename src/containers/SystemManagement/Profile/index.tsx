import {Row, Col} from "antd";
import React from 'react';

import ProfileSidebar from "./ProfileSidebar";
import ProfileTabs from "./ProfileTabs";

function Profile () {

    return <Row className="profile-page">
        <Col span={6}>
            <ProfileSidebar/>
        </Col>
        <Col span={18}>
            <ProfileTabs />
        </Col>
    </Row>
}

export default Profile;

