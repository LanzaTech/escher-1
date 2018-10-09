/* global window */
/** @jsx h */

/**
 * Define a Tooltip component and interface with Preact.
 */
import { h, Component } from 'preact'
import './DefaultTooltip.css'
import './CustomTooltip.css'
import MoleculeDrawing from './MoleculeDrawing';

const utils = require('./utils')

class CustomTooltip extends Component {
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

  render () {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    if (this.props.type !== 'reaction') {
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
          <div>
            <MoleculeDrawing  />
          {/* <MoleculeDrawing structure={this.props.biggId}/> */}
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
    } else {
      {
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
            <button
              className='buttonCustom'
              onClick={() => this.props.tooltip_callbacks.knockout(this.props.biggId)}
              data={this.props.data}
              id='knockoutbutton'
            >
              Knockout
            </button>
            <button
              className='buttonCustom'
              onClick={() => this.props.tooltip_callbacks.setAsObjective(this.props.biggId)}
              data={this.props.data}
              id='objectivebutton'
            >
              Set as objective
            </button>
            <span className='span-margin-right'>
              Min
            </span>
            <label class='switch'>
              <input
                type='checkbox'
                onClick={() => this.props.tooltip_callbacks.objectiveDirection(this.props.biggId)}/>
              <span class='slider'></span>
            </label>
            <span>
              Max
            </span>
            <br/>
            <span>
              Lower bound
            </span>
            <input type='number' id='lowerbound' className='input'/>
            <span>
              Upper bound
            </span>
            <input type='number' id='upperbound' className='input'/>
            <br/>
            <button
              className='buttonCustom'
              onClick={() => this.props.tooltip_callbacks.changeBounds(this.props.biggId)}
              data={this.props.data}>
              Change bounds
            </button>
            <button
              className='buttonCustom marginButton'
              onClick={() => this.props.tooltip_callbacks.resetBounds(this.props.biggId)}
              data={this.props.data}>
              Reset bounds
            </button>
            <div
              className='typeLabel'>
              {this.capitalizeFirstLetter(this.props.type)}
            </div>
          </div>
        )
      }
    }
  }
}

export default CustomTooltip
