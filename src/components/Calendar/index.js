import React, {Component} from 'react';
import './style.scss'
import CalendarCore from "./core";
import DateHeader from './dateHeader'
import YearPanel from './yearPanel'
import DatePanel from './datePanel.js'
import MonthPanel from './monthPanel'

const calendar = new CalendarCore()

class Calendar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: this.props.type || 'date',
      min: this.props.min || '1900/01/01',
      max: this.props.max,
      currentPanel: this.props.type || 'date'
    }
    this.init = this.init.bind(this)
    this.selectYearType = this.selectYearType.bind(this)
    this.selectMonthType = this.selectMonthType.bind(this)
    this.selectYear = this.selectYear.bind(this)
    this.selectMonth = this.selectMonth.bind(this)
    this.selectDate = this.selectDate.bind(this)
    this.prevYear = this.prevYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)

    this.changeValue = this.changeValue.bind(this)
  }
  componentDidMount () {
    this.init()
  }
  render () {
    const { currentPanel } = this.state
    return (
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <DateHeader 
            data = {this.state}
            selectYearType={this.selectYearType} 
            selectMonthType={this.selectMonthType} 
            prevYear={this.prevYear}
            nextYear={this.nextYear}
            prevMonth={this.prevMonth}
            nextMonth={this.nextMonth} />
        </div>
        <div className="calendar-body">
          {
            currentPanel && currentPanel === 'year' &&
              <YearPanel 
                data={this.state} 
                selectYear={this.selectYear}/> ||
            currentPanel === 'month' &&
              <MonthPanel 
                selectMonth={this.selectMonth}
                data={this.state} /> || 
            currentPanel === 'date' &&
              <DatePanel
                selectDate = {this.selectDate}
                data={this.state} />
          }
        </div>
      </div>
    )
  }
  // 初始化 获取 当前年月日
  init () {
    let yearTable = [],
        monthTable = [],
        dateTable = []
    calendar.init({
      min: this.state.min,
      max:  this.state.max
    }).createYear((info) => {
      yearTable = info
    }).createMonth((info) => {
      monthTable = info
    }).createMonthDate((info) => {
      dateTable = info
    })

    this.setState({
      headerValue: calendar.data.year + '/' + calendar.data.month,              // calendar title
      yearTable: yearTable,                                                         // calendar year table
      monthTable: monthTable,                                                       // calendar month table
      dateTable: dateTable,                                                         // calendar date table
      weeks_list: calendar.lang[calendar.data.lang].weeks,                      // calendar language week
      year: calendar.data.year,                
      month: calendar.data.year + '/' + calendar.data.month,                    
      date: calendar.data.year + '/' + calendar.data.month + '/' + calendar.data.date,
      datetime: calendar.data.year + '' + calendar.data.month + '' + calendar.data.date
    })
  }
  // title select year
  selectYearType () {
    this.setState({
      currentPanel: 'year'
    })
  }
  // title select month
  selectMonthType () {
    this.setState({
      currentPanel: 'month'
    })
  }

  // selectYear 
  selectYear (val) {
    // 根据 type 类型  如果只是year则直接返回结果
    if (this.state.type === 'year') {
      this.changeValue(val)
      this.setState({
        year: val.year,
        headerValue: val.year + '/'
      })
    } else {
      // 选择年份后更新月份table
      const monthTable = calendar.updateMonth(val.year)
      this.setState({
        year: val,
        monthTable: monthTable,
        headerValue: val.year + '/' + this.state.month.split('/')[1],
        currentPanel: 'month'
      })
    }
  }

  // selectMonth
  selectMonth (val) {
    if (this.state.type === 'month') {
      this.setState({
        month: val.year + '/' + val.month,
        headerValue: val.year + '/' + val.month
      })
      this.changeValue(val)
    } else {
      // 选择月份后更新日期table
      const dateTable = calendar.updateMonthDate(val)
      this.setState({
        month: val.year + '/' + val.month,
        headerValue: val.year + '/' + val.month,
        dateTable: dateTable,
        currentPanel: 'date'
      })
    }
  }

  // selectDate
  selectDate (val) {
    console.log(val)
  if (val.status !== 'current') {
    this.setState({
      date: val.year + '/' + val.month + '/' + val.date,
    })
  } else {
  }
  this.props.changeValue && this.changeValue(val)
  }

  // prev-double
  prevYear () {
    if (this.state.currentPanel === 'year') {
      const yearTable = calendar.updatePrevDouYear(this.state.yearTable)
      this.setState({
        yearTable: yearTable
      })
    } else {
      const yearTable = calendar.updatePreYear(this.state.yearTable)
      const monthTable = calendar.updateMonth(yearTable[0].year)
      const dateTable = calendar.updateMonthDate({
        year: yearTable[0].year,
        month: this.state.month.split('/')[1]
      })
      this.setState({
        yearTable: yearTable,
        monthTable: monthTable,
        dateTable: dateTable,
        headerValue: yearTable[0].year + '/' + this.state.month.split('/')[1],
      })
    }
  }

  // next-double
  nextYear () {
    if (this.state.currentPanel === 'year') {
      const yearTable = calendar.updateNextDouYear(this.state.yearTable)
      this.setState({
        yearTable: yearTable
      })
    } else {
      const yearTable = calendar.updateNextYear(this.state.yearTable)
      const monthTable = calendar.updateMonth(yearTable[0].year)
      const dateTable = calendar.updateMonthDate({
        year: yearTable[0].year,
        month: this.state.month.split('/')[1]
      })
      this.setState({
        yearTable: yearTable,
        monthTable: monthTable,
        dateTable: dateTable,
        headerValue: yearTable[0].year + '/' + this.state.month.split('/')[1],
      })
    }
  }
  
  // prev
  prevMonth () {
    const year = parseInt(this.state.headerValue.split('/')[0])
    const month = parseInt(this.state.headerValue.split('/')[1])
    if ((month - 1) <= 0) {
      const dateTable = calendar.updateMonthDate({
        year: year - 1,
        month: 12
      })
      this.setState({
        dateTable: dateTable,
        headerValue: year - 1 + '/' + 12
      })
    } else {
      const dateTable = calendar.updateMonthDate({
        year: year,
        month: month - 1
      })
      this.setState({
        dateTable: dateTable,
        headerValue: year + '/' + (month - 1)
      })
    }
  }

  // next
  nextMonth () {
    let year = parseInt(this.state.headerValue.split('/')[0])
    let month = parseInt(this.state.headerValue.split('/')[1])
    if ((month + 1) > 12) {
      const dateTable = calendar.updateMonthDate({
        year: year + 1,
        month: 1
      })
      this.setState({
        dateTable: dateTable,
        headerValue: year + 1 + '/' + 1
      })
    } else {
      const dateTable = calendar.updateMonthDate({
        year: year,
        month: month + 1
      })
      this.setState({
        dateTable: dateTable,
        headerValue: year + '/' + (month + 1)
      })
    }
  }

  // return component value
  changeValue (val) {
    this.props.changeValue(val)
  }
}

export default Calendar