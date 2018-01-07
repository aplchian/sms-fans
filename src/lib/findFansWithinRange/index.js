const zipcodes = require("zipcodes")
const { curry, filter } = require("ramda")
const { Maybe } = require("ramda-fantasy")

const findFansWithinRange = curry((distance, zipCode, fans) => {
  const fanInRange = fan => zipcodes.distance(fan.zip, zipCode) <= distance
  return Maybe(fans)
    .map(filter(fanInRange))
    .getOrElse([])
})

export default findFansWithinRange
