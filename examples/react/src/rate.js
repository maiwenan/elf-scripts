import { Component } from 'react'

class Rate extends Component {
  constructor() {
    super()
    this.state = {
      msg: 'hi'
    }
  }

  render () {
    return (
      <div className="rate">{this.state.msg}</div>
    )
  }
}

export default Rate
