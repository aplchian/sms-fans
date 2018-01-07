import findFansWithinRange from "./"

test("find fans within range should work and return a fan", () => {
  const res = findFansWithinRange(100, "29405", getTestData())
  expect(res).toMatchSnapshot()
})

test("find fans within range should work and return no fans", () => {
  const res = findFansWithinRange(1, "29405", getTestData())
  expect(res).toMatchSnapshot()
})

function getTestData() {
  return [
    {
      zip: "29464",
      name: "alex"
    },
    {
      zip: "90210",
      name: "peter"
    }
  ]
}
