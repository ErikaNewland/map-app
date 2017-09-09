import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import axios from 'axios'

const defaultState = {
  worldMapData: {},
  maternalDeathData: {}
}

const SET_WORLD_MAP_DATA = 'SET_WORLD_MAP_DATA'
const SET_MATERNAL_DEATH_DATA = "SET_MATERNAL_DEATH_DATA"

const setWorldMapData = (mapData) =>{
  return { type: SET_WORLD_MAP_DATA, mapData }
}

export const setMaternalDeathData = (maternalDeathData) => {
  return {type: SET_MATERNAL_DEATH_DATA, maternalDeathData}
}

export const settingWorldMapData = () =>{
  return function thunk(dispatch) {
    axios.get("https://unpkg.com/world-atlas@1/world/110m.json")
    .then(res =>  {
      return res.data
    })
    .then((data)=>{
      dispatch(setWorldMapData(data))
    })
  }
}




const reducer = (state=defaultState, action) =>{
  switch(action.type) {
    case SET_WORLD_MAP_DATA : {
      return Object.assign({}, state, {worldMapData: action.mapData})
    }
    case SET_MATERNAL_DEATH_DATA: {
      return Object.assign({}, state, {maternalDeathData: action.maternalDeathData})
    }
    default: return state
  }
}

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk, createLogger({ collapsed: true }))))

//data
//selected year