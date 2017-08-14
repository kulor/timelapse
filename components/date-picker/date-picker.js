import React, { Component } from 'react'
import moment from 'moment'
import Link from 'next/link'
import {
  URL_DATE_PATTERN,
  DISPLAY_DATE_PATTERN,
  SHORT_DAY_DATE_PATTERN
} from '../../config/constants'

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
            .date-range {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              height: 60px;
              justify-content: center;
              align-items: center;
            }

            .date-range li {
              list-style: none;
              margin: 0 5px;
              padding: 0;
              line-height: 1;
            }

            .date-range li a {
              color: #aaa;
              text-decoration: none;
              transition: 180ms ease-in-out color;
            }

            .date-range li a:hover {
              color: #555;
            }

            .date-range .active a {
              color: #111;
              font-weight: bold;
            }
          `}
        </style>
        <ol className="date-range">
          {this.getLast5Days().map(day =>
            <li key={day} className={this.isActiveDay(day) ? 'active' : ''}>
              <Link
                href={`/?date=${moment(day).format(URL_DATE_PATTERN)}`}
                as={`/${moment(day).format(URL_DATE_PATTERN)}`}
              >
                <a>
                  {this.isToday(day)
                    ? 'Today'
                    : moment(day).format(SHORT_DAY_DATE_PATTERN)}
                </a>
              </Link>
            </li>
          )}
        </ol>
      </div>
    )
  }
}
