//improvements to think about 
////1.  refactor the projection so I don't have to have a function inside a function- https://github.com/d3/d3-selection#joining-data
////2.  Get data from another source so I don't have to use feature to transform the map data before joining it to the other data


//next up!
////1.  how do you render the colors based on the data there
/////////a.  how do I find a min and max of the display data value in the data in order to set the scale

import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {interpolate, interpolateHclLong} from 'd3-interpolate'
import { connect } from 'react-redux'
import { feature } from 'topojson-client'
import countryCodes from '../data/countryCodes'

import { geoMercator, geoPath } from 'd3-geo'

export default class WorldMap extends Component {
  constructor(props) {
    super(props)
    this.renderMap = this.renderMap.bind(this)
  }

  transformMapRenderData(mapRenderData) {
    return feature(mapRenderData, mapRenderData.objects.countries).features
  }

  joinData(mapDisplayData, mapRenderData) {
    const mapRenderDataTransformed = this.transformMapRenderData(mapRenderData)
    return mapRenderDataTransformed.map(renderDataCountry => {
      const displayDataIndex = mapDisplayData.findIndex(displayDataCountry => {
        return renderDataCountry.id === displayDataCountry.id
      })
      if (displayDataIndex !== -1) {
        renderDataCountry.displayDataValue = mapDisplayData[displayDataIndex].value
      } else {
        renderDataCountry.displayDataValue = undefined
      }
      return renderDataCountry
    })

  }

  renderMap(props) {
    const node = this.node
    const width = node.width.animVal.value
    const height = node.height.animVal.value
    const mapData = this.joinData(props.mapDisplayData, props.mapRenderData)
    const colorScale = scaleLinear()
      .domain([])
      .range(["red", "violet"])
      .interpolate(interpolateHclLong)


  
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
      .attr("strokeWidth", 0.75)

    selectAll('path')
      .each(function (d, i) {
        //where to put these first 3 funcitons so I it is better- also issues with "this" if I call the in here
        const projection = () => {
          return geoMercator()
            .scale(150)
            .translate([width / 2, height / 2])
        }
        const dAttr = () => {
          return geoPath().projection(projection())(d)
        }
        select(this)
          .attr("d", dAttr())
      })
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.mapRenderData.objects && nextProps.mapDisplayData.length) {
      this.renderMap(nextProps)
    }
  }



  render() {
    return (
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}>
      </svg>
    );
  }
}



