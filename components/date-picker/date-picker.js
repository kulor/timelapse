import React, { Component } from 'react'
import moment from 'moment'
import Link from 'next/link'

export default class DatePicker extends Component {
  getLast5Days() {
    const days = []
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const day = new Date()
      day.setDate(today.getDate() - i)
      days.unshift(day)
    }
    return days
  }

  isToday(day) {
    return moment().isSame(day, 'day')
  }

  isActiveDay(day) {
    if (!this.props.date) {
      return false
    }
    return this.props.date.isSame(day, 'day')
  }

  render() {
    return (
      <div>
        <style jsx>
          {`
            ol {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .date-range {
              display: flex;
              justify-content: center;
            }
            .date-range li {
              list-style: none;
              margin: 0 2px;
              padding: 0;
            }
            .date-range li a {
              color: #333;
              text-decoration: none;
            }

            .date-range .active a {
              text-decoration: underline;
            }
          `}
        </style>
        <ol className="date-range">
          {this.getLast5Days().map(day =>
            <li key={day} className={this.isActiveDay(day) ? 'active' : ''}>
              <Link
                href={`/?date=${moment(day).format('D-M-YY')}`}
                as={`/${moment(day).format('D-M-YY')}`}
              >
                <a>
                  {this.isToday(day) ? 'Today' : moment(day).format('ddd')}
                </a>
              </Link>
            </li>
          )}
        </ol>
      </div>
    )
  }
}
