const { curry } = require("ramda")
const sendSMS = require("../sms")

const sendMessage = curry((message, fromNum, fan) => {
  sendSMS({
    to: fan.phone,
    from: fromNum,
    body: message
  })
})

module.exports = sendMessage
