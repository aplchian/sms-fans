const fans = require("./fans.json")
const zipcodes = require("zipcodes")
const { curry, filter } = require("ramda")

// console.log("fans", fans)

// const charleston = zipcodes.lookup(29464)

const findFansWithinRange = curry((distance, zipCode, fans) => {
  const fanInRange = fan => zipcodes.distance(fan.zip, zipCode) <= distance
  return filter(fanInRange, fans)
})

console.log("charleston", findFansWithinRange(50, 30075, fans))
