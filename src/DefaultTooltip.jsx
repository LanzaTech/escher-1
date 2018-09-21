/* global window */
/** @jsx h */

/**
 * Define a Tooltip component and interface with Preact.
 */
import { h, Component } from 'preact'
import './DefaultTooltip.css'
import { Kekule } from 'kekule'
//import { Raphael } from 'raphael'

const utils = require('./utils')

class DefaultTooltip extends Component {
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

  drawSmth() {
    console.log('draws')
    var molData = `glucose.mol
  ChemDraw10250510592D

 13 13  0  0  0  0  0  0  0  0999 V2000
   -0.3572    0.6188    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3572   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.3572   -0.6188    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0717   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0717    0.6188    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.3572    1.0312    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.7862    1.0312    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.7862   -0.6188    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0717   -0.6188    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3572    1.4437    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0717    1.0312    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7862    0.6188    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.3572   -1.4437    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0
  2  3  1  0  0  0
  3  4  1  0  0  0
  4  5  1  0  0  0
  5  6  1  0  0  0
  6  1  1  0  0  0
  5  7  1  6  0  0
  4  8  1  6  0  0
  2  9  1  6  0  0
  1 10  1  6  0  0
  1 11  1  0  0  0
 11 12  1  0  0  0
  3 13  1  1  0  0
M  END`;
		let chemViewer2 = new Kekule.ChemWidget.Viewer(document);
		// chemViewer2.setDimension('300px', '300px');
		var molecule2 = Kekule.IO.loadFormatData(molData, 'mol');
		console.log(molData);
		chemViewer2.appendToElem(document.getElementById('chemViewer2')).setChemObj(molecule2);
  }

  render () {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    return (
      <div className='tooltip'>
        <div className='id'>
          {this.props.biggId}
        </div>
        <div className='name'>
          name: {this.props.name}
        </div>
        <div className='data'>
          data: {(this.props.data && this.props.data !== '(nd)'
          ? this.props.data
          : 'no data')}
        </div>
        <div id="chemViewer2">
        </div>
        <button
          className='biggIdButton'
          //onClick={() => this.openBigg()}
          onClick={() => this.drawSmth()}
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
  }
}

export default DefaultTooltip
