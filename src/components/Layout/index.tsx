import React from 'react';
import { useLocation } from 'react-router-dom';

import SystemLayout from './SystemLayout';

function Layout(props:any) {

    return <SystemLayout>
        {props.children}
    </SystemLayout>;
}

export default Layout;

