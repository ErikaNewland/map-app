import React, { Component } from 'react'
import WorldMap from './WorldMap'
import { connect } from 'react-redux'
import { select } from 'd3-selection'
import { feature } from 'topojson-client'



class MapContainer extends Component {

  constructor(props) {
    super(props)
    this.filterData = this.filterData.bind(this)
    this.joinData = this.joinData.bind(this)
    this.state = {
      mapData: []
    }
  }

  filterData(data, node) {
    let currentYear 
    console.log('currentYear', currentYear)
    if (node) {
     currentYear = select(node)
        .select('g')
        .select('path')
        .data()[0].year
    } 
    let nextYear
    if(currentYear === "1990") nextYear = "2000"
    else if (currentYear === "2015") nextYear = "1990"
    else nextYear  = "2015" 
    console.log('nextYear', nextYear)    
    if (data) {
      return data.filter(dataPoint => {
        return dataPoint.dims.YEAR === nextYear
      })
    }
  }

  //trt to get rid of this function
  transformMapRenderData(mapRenderData) {
    if (mapRenderData && mapRenderData.objects) return feature(mapRenderData, mapRenderData.objects.countries).features
    else return []
  }

  //change these variable names
  joinData(props, node) {
    const mapDisplayData = this.filterData(props.mapDisplayData, node)
    const mapRenderData = props.mapRenderData

    const mapRenderDataTransformed = this.transformMapRenderData(mapRenderData)
    const mapData = mapRenderDataTransformed.map(renderDataCountry => {
      const displayDataIndex = mapDisplayData.findIndex(displayDataCountry => {
        return renderDataCountry.id === displayDataCountry.id
      })
      if (displayDataIndex !== -1) {
        renderDataCountry.displayDataValue = mapDisplayData[displayDataIndex].value
        renderDataCountry.year = mapDisplayData[displayDataIndex].dims.YEAR
      } else {
        renderDataCountry.displayDataValue = undefined
        renderDataCountry.year = undefined
      }
      return renderDataCountry
    })
    this.setState({
      mapData: mapData
    }) 
  }

  componentWillReceiveProps(nextProps) {
    this.joinData(nextProps)
 }


  render() {
    return (
      <WorldMap
        mapData={this.state.mapData}
        width={1000}
        height={500}
        valueDetails="Value"
        onClick={this.joinData} 
        />
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