import Link from 'next/link'
import { Component } from 'react'
import moment from 'moment'
import Head from 'next/head'
import DatePicker from '../components/date-picker/date-picker'
import { URL_DATE_PATTERN, DISPLAY_DATE_PATTERN } from '../config/constants'
import { getEntryForDate, setEntryForDate } from '../persistence/entries'

export default class extends Component {
  static propTypes() {}

  constructor(props) {
    super(props)
    this.state = {
      entry: '',
      dateKey: null,
      date: null
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.url.query.date === this.props.url.query.date) {
      return
    }

    return this.setupEntry(this.props.url.query.date)
  }

  componentDidMount() {
    const dateKey =
      this.props.url.query.date || moment().format(URL_DATE_PATTERN)

    this.setupEntry(dateKey)
  }

  setupEntry(dateKey) {
    this.setState({
      dateKey,
      date: moment(dateKey, URL_DATE_PATTERN)
    })

    getEntryForDate(dateKey)
      .then(doc => {
        this.setState({
          entry: doc.entryCopy
        })
      })
      .catch(err => {
        // No entry found
        this.setState({
          entry: ''
        })
      })
  }

  onChangeEntry = e => {
    const entry = e.target.value
    // Optimistically set UI
    this.setState({
      entry
    })

    setEntryForDate(this.state.dateKey, entry).catch(err => {
      console.log('Error saving entry', err)
    })
  }

  getPlaceholderText() {
    if (!this.state.date || this.state.date.isSame(new Date(), 'day')) {
      return 'What did you achieve today?'
    }
    return `What did you achieve on ${this.state.date.format(
      DISPLAY_DATE_PATTERN
    )}`
  }

  render() {
    return (
      <div>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
          />
          <title>Timelapse — The Story Of Your Life</title>
          <link rel="stylesheet" type="text/css" href="/static/css/base.css" />
        </Head>

        <DatePicker date={this.state.date} />

        <div
          style={{
            boxSizing: 'border-box',
            position: 'fixed',
            left: 0,
            right: 0,
            top: '60px',
            bottom: 0
          }}
        >
          <textarea
            autoFocus
            value={this.state.entry}
            onChange={this.onChangeEntry}
            placeholder={this.getPlaceholderText()}
          />
        </div>
        <style jsx>
          {`
            textarea {
              width: 100%;
              border: none;
              border-top: 1px solid #f1f1f1;
              padding: 10vw;
              font-size: 2rem;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              transition: 120ms ease-in-out border;
            }
            textarea:focus {
              outline: none;
              border-top: 1px solid #aaa;
            }
          `}
        </style>
      </div>
    )
  }
}
