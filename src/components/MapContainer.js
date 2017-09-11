import React, { Component } from 'react'
import WorldMap from './WorldMap'
import { connect } from 'react-redux'


class MapContainer extends Component  {

  
  // handleClick(whoData) {    
  //   console.log("dom click")
  //   let nextYear;
  //   console.log(this.state)
  //   if(this.state.currentYear==="1990") {
  //     nextYear = "2000"
  //     // this.setState({currentYear: "2000"})
  //   }
  //   else if (this.state.currentYear==="2000") {
  //     nextYear = "2015"
  //     // this.setState({currentYear: "2015"})
  //   }
  //   else {
  //     nextYear = "1990"
  //     // this.setState({currnetYear: "1990"})
  //   }
  filterData(whoData){    
    if(this.props.mapDisplayData.length) {
      return whoData.filter(dataPoint=>{
        return dataPoint.dims.YEAR === "2015"
      }
    )}
  }
  
  render (){
    return (
      <WorldMap 
        mapRenderData={this.props.mapRenderData} 
        mapDisplayData={
          this.filterData(this.props.mapDisplayData)|| []
        } 
        width={1000} 
        height={500} 
        valueDetails = "Value"
        onClick = {this.handleClick}/>
    )
  }
}


const mapStateToProps = state => {
  return {
    mapRenderData: state.worldMapData,
    mapDisplayData: state.maternalDeathData
  }
}

export default connect(mapStateToProps)(MapContainer)