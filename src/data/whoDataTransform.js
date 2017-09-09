import maternalDeathData from './maternalDeathData'
import countryCodes from './countryCodes'

const transformData = (value) => {
  const bracketIndex = value.indexOf('[')
  return Number(value.slice(0,bracketIndex).trim().replace(" ",""))
}

const maternalDDTransformed = maternalDeathData.fact.map(data=> {
  const value = transformData(data.Value)
  const countryCodeIndex = countryCodes.findIndex(country=>{
    return country.CountryorArea === data.dims.COUNTRY
   })
  const m49Code = countryCodes[countryCodeIndex].M49Code

  return Object.assign({}, data, {value: value, id: m49Code})
})

export default maternalDDTransformed