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

  //determine the WHO data year currently displayed on map
  currentYear(node) {
    return select(node)
      .select('g')
      .select('path')
      .data()[0].year
  }

  //filter the WHO data by by year
  filterData(data, node) {
    let currentYear
    if (node) {  //a node exists if the data is updating via a click on the map
      currentYear = this.currentYear(node)
    }
    let nextYear
    if (currentYear === "2000") nextYear = "2015"
    else if (currentYear === "1990") nextYear = "2000"
    else nextYear = "1990"
    if (data) {
      return data.filter(dataPoint => {
        return dataPoint.dims.YEAR === nextYear  //year data stored in dims object on the data object for each country
      })
    }
  }

  //uses topojson-client library method 'feature' to transform topo-json map data into geo-json map data
  //function is in container becaues it will not be required for map data already in geo-json format
  transformGeoData(geoData) {  
    if (geoData && geoData.objects) return feature(geoData, geoData.objects.countries).features
    else return []
  }

  //join geographic and WHO orgnaization data into single structure to append to DOM 
  joinData(props, node) {
    //1.  Determine data source and filter/transform data as required
    const whoData = props ? props.whoData : this.props.whoData//ternary operator: function called first time from componentWillRecieveProps 
    const whoDataFiltered = this.filterData(whoData, node)    
    const geoData = props ? props.geoData : this.props.geoData//ternary operator: function called first time from componentWillRecieveProps     
    const geoDataTransformed = this.transformGeoData(geoData)
    
    //2.  Combine data
    const mapData = geoDataTransformed.map(geoCountry => {
      //a.  Find the country's WHO data
      const whoDataIndex = whoDataFiltered.findIndex(displayDataCountry => {
        return geoCountry.id === displayDataCountry.id
      })
      //add display data value and year to the geo data object 
      if (whoDataIndex !== -1) {
        geoCountry.displayDataValue = whoDataFiltered[whoDataIndex].value
        geoCountry.year = whoDataFiltered[whoDataIndex].dims.YEAR
      } else {
        geoCountry.displayDataValue = undefined
        geoCountry.year = undefined
      }
      //return the geo data object to the mapData array
      return geoCountry
    })
    //set the local state with the map data so we can render the map year
    this.setState({
      mapData: mapData
    })
  }

  //runs the function when the store has updated with the data from various data sources
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
    geoData: state.worldMapData,
    whoData: state.maternalDeathData
  }
}

export default connect(mapStateToProps)(MapContainer)