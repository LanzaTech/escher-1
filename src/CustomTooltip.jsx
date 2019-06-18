/* global window */
/** @jsx h */

/**
 * Define a Tooltip component and interface with Preact.
 */
import { h, Component } from 'preact'
import './DefaultTooltip.css'
import './CustomTooltip.css'

const utils = require('./utils')

class CustomTooltip extends Component {
  constructor () {
    super()
    this.state = {
      lowerbound: null,
      upperbound: null
    }
  }

  decompartmentalizeCheck (id, type) {
    // ID without compartment, if metabolite.
    return type === 'metabolite'
      ? utils.decompartmentalize(id)[0]
      : id
  }

  openBigg () {
    const type = this.props.type
    const biggId = this.props.biggId
    const pref = 'http://bigg.ucsd.edu/'
    const url = type === 'gene'
      ? `${pref}search?query=${biggId}`
      : `${pref}universal/${type}s/${this.decompartmentalizeCheck(biggId, type)}`
    window.open(url)
  }

  capitalizeFirstLetter (s) {
    return typeof s === 'string'
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : console.warn('capitalizeFirstLetter was passed something other than a string')
  }

  handleChangeLower (event) {
    this.setState({
      lowerbound: event.target.value
    })
  }

  handleChangeUpper (event) {
    this.setState({
      upperbound: event.target.value
    })
  }

  changeBounds () {
    this.props.tooltip_callbacks.changeBounds(this.props.biggId,
      this.state.lowerbound || this.props.reaction_state(this.props.biggId).bounds.lowerbound,
      this.state.upperbound || this.props.reaction_state(this.props.biggId).bounds.upperbound)
    this.resetState()
  }

  resetState () {
    this.setState({
      lowerbound: null,
      upperbound: null
    })
  }

  render () {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    if (this.props.type === 'metabolite') {
      return (
        <div className='tooltip'>
        <span className='id'>
          {this.props.biggId}
        </span>
          <div className='name'>
            name: {this.props.name}
          </div>
          <div className='data'>
            data: {(this.props.data && this.props.data !== '(nd)'
            ? this.props.data
            : 'no data')}
          </div>
          <button
            className='biggIdButton'
            onClick={() => this.openBigg()}
          >
            {biggButtonText}
          </button>
          <div
            className='typeLabel'
          >
            {this.capitalizeFirstLetter(this.props.type)}
          </div>
        </div>
      )
    } else if (this.props.type === 'gene') {
      return (
        <div className='tooltip'>
        <span className='id'>
          {this.props.biggId}
        </span>
          <div className='name'>
            name: {this.props.name}
          </div>
          <div className='data'>
            data: {(this.props.data && this.props.data !== '(nd)'
            ? this.props.data
            : 'no data')}
          </div>
          <button
            className='biggIdButton'
            onClick={() => this.openBigg()}
          >
            {biggButtonText}
          </button>
          <button
            className={!this.props.reaction_state(this.props.biggId, 'gene').includedInModel ? 'hidden' : '' + 'buttonCustom knockoutgenes'}
            onClick={() => this.props.tooltip_callbacks.knockoutGenes(this.props.biggId)}
            data={this.props.data}
            id='knockoutbutton'
          >
            {this.props.reaction_state(this.props.biggId).knockoutGenes ? 'Undo knockout' : 'Knockout'}
          </button>
          <div
            className='typeLabel'
          >
            {this.capitalizeFirstLetter(this.props.type)}
          </div>
        </div>
      )
    } else {
      return (
        <div className='tooltip'>
        <span className='id'>
          {this.props.biggId}
        </span>
          <div className='name'>
            name: {this.props.name}
          </div>
          <div className='data'>
            data: {(this.props.data && this.props.data !== '(nd)'
            ? this.props.data
            : 'no data')}
          </div>
          <button
            className='biggIdButton'
            onClick={() => this.openBigg()}
          >
            {biggButtonText}
          </button>
          <br/>
          <div className={!this.props.reaction_state(this.props.biggId).includedInModel ? 'hidden' : ''}>
            <button
              className='buttonCustom'
              onClick={() => this.props.tooltip_callbacks.knockout(this.props.biggId)}
              data={this.props.data}
              id='knockoutbutton'
            >
              {this.props.reaction_state(this.props.biggId).knockout ? 'Undo knockout' : 'Knockout'}
            </button>
            <button
              className='buttonCustom'
              onClick={() => this.props.tooltip_callbacks.setAsObjective(this.props.biggId)}
              data={this.props.data}
              id='objectivebutton'
            >
              {this.props.reaction_state(this.props.biggId).objective &&
              this.props.reaction_state(this.props.biggId).objective.reactionId === this.props.biggId ?
                'Undo set as objective' : 'Set as objective'}
            </button>
            <div class={'bounds'} className={!this.props.reaction_state(this.props.biggId).objective
            || this.props.reaction_state(this.props.biggId).objective.reactionId !== this.props.biggId
              ? 'hidden' : 'bounds'}>
              <span className='span-margin-right'>
                Min
              </span>
              <label class='switch'>
                <input
                  type='checkbox'
                  checked={this.props.reaction_state(this.props.biggId).objective && this.props.reaction_state(this.props.biggId).objective.direction === 'max'}
                  onClick={() => this.props.tooltip_callbacks.objectiveDirection(this.props.biggId)}/>
                <span class='slider'></span>
              </label>
              <span>
                Max
              </span>
            </div>
            <br/>
            <span>
              Lower bound
            </span>
            <input type='number'
                   className='input'
                   name='lowerbound'
                   onChange={event => this.handleChangeLower(event)}
                   value={this.state.lowerbound || this.props.reaction_state(this.props.biggId).bounds.lowerbound}/>
            <span>
              Upper bound
            </span>
            <input type='number'
                   className='input'
                   name='upperbound'
                   onChange={event => this.handleChangeUpper(event)}
                   value={this.state.upperbound || this.props.reaction_state(this.props.biggId).bounds.upperbound}/>
            <br/>
            <button
              className='buttonCustom'
              onClick={() => this.changeBounds()}
              data={this.props.data}>
              Change bounds
            </button>
            <button
              className='buttonCustom marginButton'
              onClick={() => this.props.tooltip_callbacks.resetBounds(this.props.biggId)}
              data={this.props.data}>
              Reset bounds
            </button>
          </div>
          <div
            className='typeLabel'>
            {this.capitalizeFirstLetter(this.props.type)}
          </div>
        </div>
      )
    }
  }
}

export default CustomTooltip
