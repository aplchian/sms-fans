require("dotenv").config()

const app = require("express")()
const {
  split,
  path,
  curry,
  filter,
  join,
  forEach,
  isEmpty,
  length,
  toLower,
  head
} = require("ramda")
const fans = require("./fans.json")
const bodyParser = require("body-parser")
const zipcodes = require("zipcodes")
const sendSMS = require("./lib/sms")
import findFansWithinRange from "./lib/findFansWithinRange"
const sendMessage = require("./lib/sendMessage")

app.use(bodyParser.urlencoded({ extended: true }))
const fromNum = process.env.OUTGOING

app.get("/", (req, res) => {
  res.send({ ok: true })
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
      if (isEmpty(fansWithinRange)) throw new Error("No fans found!")
      forEach(sendMessage(messageStr, fromNum), fansWithinRange)
      sendMessage(
        `${length(fansWithinRange)} messages were succesfully sent!`,
        req.body.To,
        { phone: req.body.From }
      )
      res.send({ ok: true })
    }
  } catch (error) {
    console.log("error", error.message)
    sendMessage(error.message, req.body.To, { phone: req.body.From })
  }
})

app.listen(4040)
