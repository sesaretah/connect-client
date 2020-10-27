import React from "react";
import { Page, Navbar, Row, CardFooter, Col, Fab, Icon, Card, Link, CardContent, CardHeader } from 'framework7-react';

import { defaults, Bar, Pie } from 'react-chartjs-2';

import { dict } from '../../Dict';

const HomeIndex = (props) => {

    function series() {
        var result = []
        console.log(props.meetingHistogram)
        if (props.meetingHistogram && props.meetingHistogram.length > 0) {
            var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
            var d = []
            props.meetingHistogram.map((v) => {
                console.log(v)
                d.push({ x: new window.ODate(v.day), y: v.count })
            })
            result.push({
                label: dict.person_session,
                backgroundColor: colors[Math.floor(Math.random() * 10)],
                borderColor: 'blue',
                data: d
            })
        }

        return result

    }


    function bbseries() {
        var result = []
        console.log(props.bbMeetingHistogram)
        if (props.bbMeetingHistogram && props.bbMeetingHistogram.length > 0) {
            var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
            var d = []
            props.bbMeetingHistogram.map((v) => {
                console.log(v)
                d.push({ x: new window.ODate(v.day), y: v.count })
            })
            result.push({
                label: dict.person_session,
                backgroundColor: colors[Math.floor(Math.random() * 10)],
                borderColor: 'blue',
                data: d
            })
        }

        return result

    }

    return (
        <Page >
            <Navbar title={dict.home} >
                <Link panelOpen="right">
                    <Icon f7="bars"></Icon>
                </Link>
            </Navbar>
            <Row>
                <Col width='100' tabletWidth='100'>
                    <Card>
                        <CardHeader>{dict.adobe_meetings}</CardHeader>
                        <CardContent className='h-200'>
                            <Bar
                                data={{ datasets: series() }}
                                options={{
                                    maintainAspectRatio: false,
                                    showTooltips: false,
                                    //responsive: true,
                                    scales: {
                                        xAxes: [{
                                            barThickness: 5,
                                            type: 'time',
                                            bounds: 'ticks',
                                            time: {
                                                unit: "day",
                                                unitStepSize: 1,
                                                displayFormats: {
                                                    day: 'MM/D'
                                                },
                                            },
                                            scaleLabel: {
                                                display: true,
                                                labelString: dict.date
                                            }
                                        }]
                                    }
                                }
                                }
                            />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </Col>

                <Col width='100' tabletWidth='100'>
                    <Card>
                        <CardHeader>{dict.bb_meetings}</CardHeader>
                        <CardContent className='h-200'>
                            <Bar
                                data={{ datasets: bbseries() }}
                                options={{
                                    maintainAspectRatio: false,
                                    showTooltips: false,
                                    //responsive: true,
                                    scales: {
                                        xAxes: [{
                                            barThickness: 5,
                                            type: 'time',
                                            bounds: 'ticks',
                                            time: {
                                                unit: "day",
                                                unitStepSize: 1,
                                                displayFormats: {
                                                    day: 'MM/D'
                                                },
                                            },
                                            scaleLabel: {
                                                display: true,
                                                labelString: dict.date
                                            }
                                        }]
                                    }
                                }
                                }
                            />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </Col>



            </Row>
        </Page>
    )
}
export default HomeIndex;
