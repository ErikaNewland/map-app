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
    const node = this.node
    const width = node.width.animVal.value
    const height = node.height.animVal.value
    const mapData = props.mapData
    //useful function for interplation scales- used once in a console log, remains as example
    const maxMapDisplayData = max(mapData, d=>{
      return d.displayDataValue
    })

    const colorScale = scaleLinear()
      .domain([0, 2700])
      .range(["violet", "red"])
      .interpolate(interpolateHclLong)
       colorScale.clamp(true)

   select(node)
      .append('g')
      .classed('countries', true)

    const countries = select('g')
      .selectAll('path')
      .data(mapData)
    
    countries.enter()
      .append('path')
        .classed('country', true)
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("strokeWidth", 0.75)
        .each(function (d, i) {
        
          const projection = () => {
            return geoMercator()
              .scale(150)
              .translate([width / 2, height / 1.5])
          }
          const dAttr = (d) => {
            return geoPath().projection(projection())(d)
          }
          select(this)
            .attr("d", dAttr())
            .attr("fill", colorScale(d.displayDataValue))
          })
        .merge(countries)
          .each(function (d, i) {
            select(this)
              .transition()
              .delay(100)
              .duration(1000)
              .attr("fill", colorScale(d.displayDataValue))
            })
    
      countries.exit()
        .remove()
            
  }

  
  componentWillReceiveProps(nextProps) {
    if (nextProps.mapData.length) {
      this.renderMap(nextProps)
    }
  }

  //prevents react from re-rendering the component when new props come in, allows the d3 to take control through the renderMap function, run via componentWillReceiveProps
  shouldComponentUpdate() {
    return false;
  }



  render() {
    return (
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height} onClick = {()=>this.props.onClick(undefined, this.node)}>  
      </svg>
    );
  }
}



