import { Tree, TreeProps } from "antd";
import React from "react";

interface CommonTreeProps extends TreeProps {

}

const CommonTree = (props:CommonTreeProps) => {

    return <Tree
        {...props}
        className={`avic-tree ${props?.className || ''}`}
    />
}

export default CommonTree;