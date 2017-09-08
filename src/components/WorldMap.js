import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection'
import {connect} from 'react-redux'
import { feature } from 'topojson-client'
import '../App.css';
import countryCodes from '../data/countryCodes'

import { geoMercator, geoPath } from 'd3-geo'

class WorldMap extends Component {
  constructor(props) {
    super(props)
    this.renderMap = this.renderMap.bind(this)
  }

  renderMap() {
    const node = this.node
    const mapData = feature(this.props.worldMapData, this.props.worldMapData.objects.countries).features
    console.log(mapData)

    //next up- how to attach the who data for a particular year to the DOM element
    ////1. add data from WHO to the data object getting passed using a for loop for a given year
        //run data through a year filter first

    ///then how do you get it to update as new data comes in (i.e. the year changes so you need to run data through the year filter again?  Or should react control the filter change?)

    //for the sake of my tech talk, I could have mouseover that shows the number of deaths and the range and work on updating later- lots of examples of mouseovers in maps available via d3 controlling DOM elements

    
    select(node)
      .append('g')
      .classed('countries', true)

    select('g')
      .selectAll('path')
      .data(mapData)
      .enter()
      .append('path')
      .classed('country', true)
      .attr("stroke", "black")
      .attr("fill", "white")
      .attr("strokeWidth", 0.5)


    selectAll('path')
      .each(function (d, i) {
        //where to put these first 3 funcitons so I it is better- also issues with "this" if I call the in here
        const projection = () => {
          return geoMercator()
            .scale(150)
            .translate([1000 / 1.75, 825 / 2])
        }
        const dAttr = () => {
          return geoPath().projection(projection())(d)
        }
       
        select(this)
          .attr("d", dAttr())
      
      })

  }

  filterMaternalDeathDataByYear(year) {
    const maternalDeathData = this.props.maternalDeathData.fact
    return maternalDeathData.filter(datapoint=>{
      return Number(datapoint.dims.YEAR) === year
    })
  }



  // componentWillReceiveProps() {
  //   console.log('new props?')
  //   console.log('this.props', this.props)
  //   if(this.props.worldMapData.objects) {
  //     console.log('we are in the if statement')
  //     this.renderMap()
  //   }
  // }

  componentDidMount() {
    setTimeout(()=>{
      this.renderMap()
    }, 500)
    // console.log('mounting')
    // if(this.props.worldMapData.objects) {
    //   console.log("first time")
    //   this.renderMap()
    // }
  }


  render() {
    return (
      <svg ref={node => this.node = node} width={1000} height={600}>
      </svg>
    );
  }
}

const mapStateToProps=state=>{
  return {
    worldMapData: state.worldMapData,
    maternalDeathData: state.maternalDeathData
  }
}

export default connect(mapStateToProps)(WorldMap)



