import React from 'react';
import { groupArray } from './utils'

function MonthPanel (props) {
  const data = props.data.monthTable ? groupArray(props.data.monthTable, 3) : []
  const current = props.data.month ? props.data.month.split('/') : ''

  return(
    <table className="month-wrapper">
      <tbody>
      {
        current.length > 0  && data.map((item, index) => {
          {   
            return (
              <tr key={index}>
                {
                  item.map((val, i) => {
                    return (
                      <td key={i}>
                        <a className={parseInt(current[0]) === val.year && parseInt(current[1]) === val.month ? 'active' : ''} onClick={() => {props.selectMonth(val)}}>{val.month}月</a>
                      </td>
                    )
                  })
                }
              </tr>
            )
          }
        })
      }
      </tbody>
    </table>
  )
}

export default MonthPanel