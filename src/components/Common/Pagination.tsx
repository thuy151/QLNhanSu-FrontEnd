import { Pagination, PaginationProps } from "antd"

const CommonPagination = (props: PaginationProps)=>{
    return <Pagination 
                className={`avic-pagination`}
                {...props}
            />
}

export default CommonPagination;