import React, { Component } from 'react'
import WorldMap from './WorldMap'
import { connect } from 'react-redux'


class MapContainer extends Component  {
  
  filterWHOData(whoData) {
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
          this.filterWHOData(this.props.mapDisplayData) || []
        } 
        width={1000} height={500} />
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