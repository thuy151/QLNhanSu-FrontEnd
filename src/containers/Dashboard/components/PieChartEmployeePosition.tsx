import React, { SetStateAction, useCallback, useEffect, useState } from 'react'
import { Payload } from "recharts/types/component/DefaultLegendContent";
import _ from 'lodash';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { Col, Row } from "antd";

import { LIST_COLOR } from '../../../utils/constants';
import CommonEmpty from "../../../components/Common/Empty";

import positionServices from "../../../services/positions.service";

export interface DataChartTypeProps {
    name?: string;
    value?: number;
}
// convert piechart
export const formatPieChart = (data:any) => {
    const total = Object.values(data).reduce((partialSum:any, a:any) => partialSum + a, 0);
    let dataChartisDelete = {
        ...data,
        total
    }
    return dataChartisDelete
}

function PieChartEmployeePosition(props: any) {
    const {employeeList}= props;
    const [data, setData] = useState<any>();
    const [dataPosition, setDataPosition] = useState<any[]>([]);
    const [colorChart, setColorChart] = useState<Payload[]>([]);

    const [isTotalPieChart, setIsTotalPieChart] = useState(0);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(0);
    const [dataChartPie, setDataChartPie] = useState<DataChartTypeProps[]>([]);

    useEffect(()=>{
        if (employeeList) {
            setData(_.groupBy(employeeList, function (item:any){
                return item?.position?.id;
            }))
        } else {
            setData([])
        }
    },[employeeList])

    const getDataPosition = useCallback(async () => {
        const paramsSearch = {
            currentPageNumber: 0,
            pageSize: 9999,
            searchText: "",
        }
        const resp = await positionServices.getPagePosition(paramsSearch);
        const data = resp?.data;

        if (resp?.status === 200) {
            setDataPosition(data?.content)
            const color:any =[];
            data?.content?.map((item:any,index:number)=>{
                color.push({
                    value: item.name,
                    type: "square",
                    color: LIST_COLOR[index]
                })
                return item
            })
            setColorChart(color)
        } else {
            setDataPosition([])
        }
    },[])

    useEffect(()=>{
        getDataPosition();
    },[getDataPosition])

    const formatDataNotication = useCallback((obj: any, key: string) => {
        const dataFormated = [];
        for (const property in obj) {
            let a = {
                [key]: `${property}`,
                "value": parseInt(`${obj[property]}`)
            }
    
            if (a[key] === 'total') {
                a[key] = 'Tổng số'
            }else{
                a[key] = data?.[property]?.[0]?.position?.name 
            }
            dataFormated.push(a);
        }
        return dataFormated;
    },[data])

    useEffect(() => {
        let dataTest:any = {}
        dataPosition?.map((item:any)=> {
            dataTest[item.id] =data?.[item.id]?.length||0
            return item;
        })

        let dataChartisDelete = formatPieChart(dataTest);

        const dataFormat = formatDataNotication(dataChartisDelete, 'name');
        const new_arr = dataFormat.filter(item => item.name !== 'Tổng số' && item.name);
        let findTotal = dataFormat.filter(item => item.name === 'Tổng số');
        setIsTotalPieChart(findTotal[0].value)
        
        setDataChartPie(new_arr)
    }, [data, dataPosition, formatDataNotication]);

    
    
    const renderActiveShape = (props: any) => {
        // const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            percent,
            value
        } = props;

        return (
            <g>
                <text x={cx} y={cy - 15} fontSize={17} textAnchor="middle" fill={fill}>
                    {payload.name}: {`${value}`}
                </text>
                <text
                    x={cx}
                    fontSize={15}
                    y={cy + 20}
                    textAnchor="middle"
                    fill="#999"
                >
                    {`${(percent * 100).toFixed(2)}%`}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
            </g>
        );
    };

    const onPieEnter = useCallback(
        (_: any, index: SetStateAction<number | undefined>) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    const renderLegend = (e: any[]) => {
        // let chartHaveData = e.filter(item => item.value > 0)
        let COLOR_CHART_FORMAT = colorChart.map(item => {
                const cur = e.find(item2 => (item.value === item2.name));
                if(cur){
                    return {
                        ...item,
                        count: cur.value
                    }
                }
                return {
                    ...item,
                    count: 0
                }
            }
        ).filter((item:any)=> item.count>0)
        return (
            <div className="bodyLengndChart" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'normal' }}>
                {
                    COLOR_CHART_FORMAT.map((entry, index: number) => (
                        <div key={`item-${index}`} style={{ display: 'flex', width: '33%', marginBottom: 10 }}>
                            <span style={{ width: '20px', display: 'inline-flex', height: '20px', backgroundColor: entry.color }}></span>
                            <div style={{ width: 180, marginLeft: 10, textAlign: 'left', color: entry.color }}>
                                <span style={{ float: "left" }}>{entry.value}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }

    return (
        <Col span={12} xs={24} sm={24} lg={24} xl={12} xxl={12}>
            <Row style={{ paddingBottom: 8, backgroundColor: "white"}} className='dashboard-container'>
                <Row style={{ width: '100%' }} className='content-title'>
                    Thống kê Nhân viên - Chức vụ
                </Row>
                <div style={{ width: '100%', marginTop: 16 }}>

                    {(isTotalPieChart === 0)
                        ? <Col className="customEmpty">
                            <CommonEmpty style={{ height: '50vh', flexDirection: 'column', display: 'flex', justifyContent: 'center', fontSize: '15px' }} />
                        </Col>
                        :
                        <Col>
                            <h2 style={{ textAlign: 'center', margin: 0, color:"#262626" }}>Tổng số: {isTotalPieChart}</h2>
                            <ResponsiveContainer width="100%" height={400} className='pie-chart'>
                                <PieChart>
                                    <Pie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={dataChartPie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={110}
                                        outerRadius={180}
                                        fill="#8884d8"
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        paddingAngle={0.7}
                                    >
                                        {dataChartPie.map((entry, index) => {
                                            const color = colorChart.find(item2 => item2.value===entry.name)
                                            return <Cell key={`cell-${index}`} fill={color?.color} />
                                        })}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                    }
                </div>
                {(isTotalPieChart === 0)
                    ? <></>
                    : <Legend content={renderLegend(dataChartPie)} />
                }
            </Row>
        </Col>
    )
}

export default PieChartEmployeePosition