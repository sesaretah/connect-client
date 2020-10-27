import React from "react";
import { List, ListItem, Card, CardHeader, CardContent, CardFooter, Row, Col } from 'framework7-react';
import { dict } from '../../Dict';
import crypto from 'crypto-js';
import { Chart } from 'react-charts'
import { color } from "d3";

import { defaults, Bar, Pie, Bubble } from 'react-chartjs-2';

defaults.global.defaultFontFamily = 'iransans';

const FacultyShow = (props) => {

  function keys() {
    var result = []
    Object.keys(props.assets).map((key) => {
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
        case "10":
          result.push('glossary')
          break;
        case "11":
          result.push('imscp')
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
          Object.keys(props.assets).map((key => {
            var value = props.assets[key]
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

  function bar(set) {
    var datasets = []
    var labels = []
    if (set && set.length > 0) {
      var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
      var data = []
      set.map((v) => {
        data.push(v.count)
        labels.push(v.serial)
      })
      datasets.push({
        label: dict.count,
        backgroundColor: colors[Math.floor(Math.random() * 10)],
        borderColor: 'blue',
        data: data
      })

    }

    return [datasets, labels]

  }




  if (props.courses) {
    console.log(props)
    return (
      <React.Fragment>
        <List className='fs-12'>
          <ListItem
            key={'faculty-show' + props.id}
            title={dict.id + ': ' + props.id}
            after=''>
          </ListItem>

          <ListItem
            key={'faculty-show' + props.id}
            title={dict.title + ': ' + props.name}
            after=''>
          </ListItem>

          <ListItem
            key={'faculty-show' + props.id}
            title={dict.total_assets + ': ' + props.total_assets}
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
          <CardHeader>{dict.courses_most_quiz}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.quiz)[0], labels: bar(props.quiz)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,

                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_resource}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.resource)[0], labels: bar(props.resource)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_assignment}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.assignment)[0], labels: bar(props.assignment)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_activity}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.activity)[0], labels: bar(props.activity)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_occ}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.onlineCourseCount)[0], labels: bar(props.onlineCourseCount)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_ocd}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.onlineCourseDuration)[0], labels: bar(props.onlineCourseDuration)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>{dict.courses_most_bocc}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.bbOnlineCourseCount)[0], labels: bar(props.bbOnlineCourseCount)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                    bounds: 'ticks',
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero:true,  
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
          <CardHeader>{dict.courses_most_bocd}</CardHeader>
          <CardContent className='h-200'>
            <Bar
              data={{ datasets: bar(props.bbOnlineCourseDuration)[0], labels: bar(props.bbOnlineCourseDuration)[1] }}
              options={{
                maintainAspectRatio: false,
                showTooltips: false,
                responsive: true,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    barThickness: 5,
                  }]
                }
              }
              }
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>


        



      </React.Fragment>
    )
  } else {
    return (null)
  }
}
export default FacultyShow;
