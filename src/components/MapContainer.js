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
      mapData: [],
      currentYear: ""
    }
  }

  currentYear(node) {
    return select(node)
      .select('g')
      .select('path')
      .data()[0].year
  }

  filterData(data, node) {
    let currentYear
    if (node) {
      currentYear = this.currentYear(node)
    }
    let nextYear
    if (currentYear === "2000") nextYear = "2015"
    else if (currentYear === "1990") nextYear = "2000"
    else nextYear = "1990"
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
    const dataToFilter = props ? props.mapDisplayData : this.props.mapDisplayData
    const mapDisplayData = this.filterData(dataToFilter, node)
    const mapRenderData = props ? props.mapRenderData : this.props.mapRenderData

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
    const year = this.state.mapData.length ? this.state.mapData[0].year : ""
    return (
      <div>
        <div>Maternal Mortality Rates: Relative Deaths per 100,000 Births</div>
        <div> Year: <span>{year}</span> </div>
        <WorldMap
          mapData={this.state.mapData}
          width={1000}
          height={500}
          valueDetails="Value"
          onClick={this.joinData}
        />
      </div>
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