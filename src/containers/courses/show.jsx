import React from "react";
import { List, ListItem, Card, CardHeader, CardContent, CardFooter, BlockTitle } from 'framework7-react';
import { dict } from '../../Dict';
import crypto from 'crypto-js';
import { Chart } from 'react-charts'
import { color } from "d3";

import { defaults, Bar, Pie } from 'react-chartjs-2';

defaults.global.defaultFontFamily = 'iransans';

const ProfileShow = (props) => {

  function keys() {
    var result = []
    Object.keys(props.course.modules).map((key) => {
      switch (key) {
        case "1":
          result.push('assign')
          break;
        case "2":
          result.push('assignment')
          break;
        case "3":
          result.push('book')
          break;
        case "4":
          result.push('chat')
          break;
        case "5":
          result.push('choice')
          break;
        case "6":
          result.push('data')
          break;
        case "7":
          result.push('feedback')
          break;
        case "8":
          result.push('folder')
          break;
        case "9":
          result.push('forum')
          break;
        case "10":
          result.push('glossary')
          break;
        case "11":
          result.push('imscp')
          break;
        case "12":
          result.push('label')
          break;
        case "13":
          result.push('lesson')
          break;
        case "14":
          result.push('lti')
          break;
        case "15":
          result.push('page')
          break;
        case "16":
          result.push('quiz')
          break;
        case "17":
          result.push('resource')
          break;
        case "18":
          result.push('scorm')
          break;
        case "19":
          result.push('survey')
          break;
        case "20":
          result.push('url')
          break;
        case "21":
          result.push('wiki')
          break;
        case "22":
          result.push('workhop')
          break;
        case "31":
          result.push('scheduler')
          break;
        case "32":
          result.push('hvp')
          break;
        case "33":
          result.push('offlinequiz')
          break;
        default:
          break;
      }
    })
    return result
  }


  function pie() {
    var data = {
      labels:
        keys()
      ,
      datasets: [{
        data:
          Object.keys(props.course.modules).map((key => {
            var value = props.course.modules[key]
            if (key == 9){
              value = props.course.modules[key] - 3
            }
            if (key == 12){
              value = props.course.modules[key] - 1
            }
            if (key == 4){
              value = props.course.modules[key] - 1
            }
            return value
          }))
        ,
        backgroundColor: [
          '#003f5c',
          '#2f4b7c',
          '#665191',
          '#a05195',
          '#d45087',
          '#f95d6a', '#ff7c43', '#ffa600', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c'
        ]
      }]
    };
    return data
  }

  function values() { }

  function series() {
    var result = []
    if (props.course.meetings && props.course.meetings.length > 0) {
      var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
      var d = []
      props.course.meetings.map((v) => {
        d.push({ x: new window.ODate(v.end_time), y: v.duration })
      })
      result.push({
        label: dict.duration,
        backgroundColor: colors[Math.floor(Math.random() * 10)],
        borderColor: 'blue',
        data: d
      })
    }

    return result

  }

  function bbseries() {
    var result = []
    if (props.course.bb_meetings && props.course.bb_meetings.length > 0) {
      var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
      var d = []
      props.course.bb_meetings.map((v) => {
        d.push({ x: new window.ODate(v.start_time), y: v.duration })
      })
      result.push({
        label: dict.duration,
        backgroundColor: colors[Math.floor(Math.random() * 10)],
        borderColor: 'blue',
        data: d
      })
    }

    return result

  }

  function attendance() {
    var body = []
    props.course.attendances.map((a) => {
      body.push(<tr key={crypto.lib.WordArray.random(32)}>
        <td key={crypto.lib.WordArray.random(32)}>{a.utid}</td>
        <td key={crypto.lib.WordArray.random(32)}>{a.fullname}</td>
        <td key={crypto.lib.WordArray.random(32)}>{a.percent}</td>
        <td key={crypto.lib.WordArray.random(32)}>{a.sum}</td>

      </tr>)
    })
    return body
  }

  if (props.course) {
    return (
      <React.Fragment>
        <List className='fs-12'>
          <ListItem
            key={'course-show' + props.course.id}
            title={dict.title + ': ' + props.course.title}
            after=''>
          </ListItem>

          <ListItem
            key={'course-teacher' + props.course.id}
            title={dict.teacher + ': ' + props.course.teacher}
            after=''>
          </ListItem>

          <ListItem
            key={'course-avarage' + props.course.id}
            title={dict.avarage + ': ' + props.course.avarage}
            after=''>
          </ListItem>

          <ListItem
            key={'course-avarage' + props.course.id}
            title={dict.avarage + ': ' + props.course.bb_avarage}
            after=''>
          </ListItem>

          <ListItem
            key={'course-meeting' + props.course.id}
            title={dict.number_of_meetings + ': ' + props.course.number_of_meetings}
            after=''>
          </ListItem>

          <ListItem
            key={'course-meeting' + props.course.id}
            title={dict.number_of_bb_meetings + ': ' + props.course.number_of_bb_meetings}
            after=''>
          </ListItem>

        </List>

        <Card>
          <CardHeader></CardHeader>
          <CardContent >
            <Pie data={pie()} />
          </CardContent>
        </Card>

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


        <BlockTitle>{dict.attendances}</BlockTitle>
        <div className="data-table card">
          <table>
            <thead>
              <tr>
                <td>{dict.utid}</td>
                <td>{dict.name}</td>
                <td>{dict.attendance_percentage}</td>
                <td>{dict.attendance_duration}</td>
              </tr>
            </thead>

            <tbody>
              {attendance()}
            </tbody>
          </table>
        </div>

      </React.Fragment>
    )
  } else {
    return (null)
  }
}
export default ProfileShow;
