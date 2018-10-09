import { h, Component } from 'preact'
import { Kekule } from 'kekule'

class MoleculeDrawing extends Component {
    constructor() {
        super()
        this.state = {
            isDrawing: false
        }
    }    
    //code below is not tested but it might be useful when chemical structure service is created

    // drawMolecule(props) {
    //   const structure = props.structure
  
    //   fetch(`http://localhost:5000/`)
    //    .then(molData => molData.text())
    //    .then(molData => {
    //        let chemViewer = new Kekule.ChemWidget.Viewer(document)
    //        let mol = Kekule.IO.loadFormatData(molData, 'mol')
    //        chemViewer.appendToElem(document.getElementById('chemViewer')).setChemObj(mol)
    //        this.setState({isDrawing: !this.state.isDrawing})
    //    })
    // }
        

    drawMolecule() {
        fetch(`http://localhost:5000/`) //link to API
        .then(molData => molData.text())
        .then(molData => {
            let chemViewer = new Kekule.ChemWidget.Viewer(document)
            let molecule = Kekule.IO.loadFormatData(molData, 'mol')
            chemViewer.appendToElem(document.getElementById('chemViewer')).setChemObj(molecule)
            this.setState({isDrawing: !this.state.isDrawing})
        })
    }

    componentWillMount() {
        this.drawMolecule()
    }
    //componentDidUpdate() or componentWillReceiveProps or shouldComponentUpdate might be useful when real service will be implemented
    //sa far, it does not do anything
    
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isDrawing === false) {
          this.drawMolecule()
        }
      }
    
    render () {  
        return (
            <div id="chemViewer"> 
            </div>
        )        
    }
}

export default MoleculeDrawing