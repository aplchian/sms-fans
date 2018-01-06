require("dotenv").config()

const app = require("express")()
const {
  split,
  path,
  curry,
  filter,
  join,
  forEach,
  length,
  toLower,
  head
} = require("ramda")
const fans = require("./fans.json")
const bodyParser = require("body-parser")
const zipcodes = require("zipcodes")
const sendSMS = require("./lib/sms")

app.use(bodyParser.urlencoded({ extended: true }))
const fromNum = process.env.OUTGOING

app.get("/", (req, res) => {
  res.send({ ok: true })
})

const findFansWithinRange = curry((distance, zipCode, fans) => {
  const fanInRange = fan => zipcodes.distance(fan.zip, zipCode) <= distance
  return filter(fanInRange, fans)
})

const sendMessage = curry((message, fromNum, fan) => {
  sendSMS({
    to: fan.phone,
    from: fromNum,
    body: message
  })
})

app.post("/sms", async (req, res) => {
  try {
    const msg = split(" ", path(["body", "Body"], req))

    if (toLower(head(msg)) === "stats") {
      const [stats, zip, distance] = msg
      const fansWithinRangeLength = length(
        findFansWithinRange(distance, zip, fans)
      )
      const { city, state } = zipcodes.lookup(zip)
      sendMessage(
        `There are ${fansWithinRangeLength} fans within ${distance} miles of ${city}, ${state} ${zip}`,
        req.body.To,
        { phone: req.body.From }
      )
    } else {
      const [zip, distance, ...message] = msg
      const messageStr = join(" ", message)
      const fansWithinRange = findFansWithinRange(distance, zip, fans)
      forEach(sendMessage(messageStr, fromNum), fansWithinRange)
      sendMessage(
        `${length(fansWithinRange)} messages were succesfully sent!`,
        req.body.To,
        { phone: req.body.From }
      )
      res.send({ ok: true })
    }
  } catch (error) {
    console.log("error", error)
    sendMessage(
      `something went wrong.. make sure you use the format:
      zipcode distance message 
      28464 100 hey this is an example message
      `,
      req.body.To,
      { phone: req.body.From }
    )
  }
})

app.listen(4040)
