import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {interpolateHclLong} from 'd3-interpolate'
import {max, min} from 'd3-array'
import { connect } from 'react-redux'
import countryCodes from '../data/countryCodes'
import {transition} from 'd3-transition'
import { geoMercator, geoPath } from 'd3-geo'

export default class WorldMap extends Component {
  constructor(props) {
    super(props)
    this.renderMap = this.renderMap.bind(this)
  }

  renderMap(props) {
    //setting constants
    const node = this.node
    const width = node.width.animVal.value
    const height = node.height.animVal.value
    const mapData = props.mapData
    
    //Creating constants for specific map functionality 
    const maxMapDisplayData = max(mapData, d=>{  //useful function for interplation scales- used once in a console log, remains as example
      return d.displayDataValue
    })
    const projection = () => {   //returns the projection constant for translating lat/long into x/y
      return geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5])
    }
    const colorScale = scaleLinear()  //returns the function that translates WHO data values into a corresponding color
      .domain([0, 2700])
      .range(["violet", "red"])
      .interpolate(interpolateHclLong)
       colorScale.clamp(true)

   //append g element to the SVG node
   select(node)  
      .append('g')
      .classed('countries', true)

    //Append the map data to the DOM
    const countries = select('g') 
      .selectAll('path')
      .data(mapData)
    
    //Begin enter pattern
    countries.enter()
      .append('path')  //append 'path' element for each data object
        .classed('country', true)  //set class
        .attr("stroke", "black") //set stroke color
        .attr("strokeWidth", 0.75) //set stroke width
        .each(function (d, i) { //for each path appended
          select(this) //select the path element
            .attr("d", geoPath().projection(projection())(d)) //set the "d" attribute (the line path) based on the projection and the data
            .attr("fill", colorScale(d.displayDataValue)) //set the fill color of each country according to the data value
          })
         //begin update pattern 
        .merge(countries) //merge in data from next year and perform same functionality
          .each(function (d, i) {
            select(this)
              .transition()
              .delay(100)
              .duration(1000)
              .attr("fill", colorScale(d.displayDataValue))
            })
      
      //remove countires for which data does not exist (if the data source changes)
      countries.exit()
        .remove()
            
  }

  //run renderMap each time new props come in-d3 will determine whether to use enter/update/exit
  componentWillReceiveProps(nextProps) {
    if (nextProps.mapData.length) {
      this.renderMap(nextProps)
    }
  }

  //prevents react from re-rendering the component when new props come in, allows the d3 to take control through the renderMap function, run via componentWillReceiveProps
  shouldComponentUpdate() {
    return false;
  }

  //rendering the empty svg container is the only aspect React is responsible for
  //ref gives the renderMap function a reference to the DOM element (rather than the virtual DOM element) for d3 to manipulate directly
  render() {
    return (
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height} onClick = {()=>this.props.onClick(undefined, this.node)}>  
      </svg>
    );
  }
}
