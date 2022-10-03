import PolySchema, { PolyTypes, PolyCondition } from "the-poly-schema"

// setup schema to validate form data
const longerThanThree = new PolyCondition("String of length 3", (value) =>
    typeof value === "string" && value.length > 3
)

const schema = new PolySchema("submitProject", {
    name: longerThanThree,
    link: longerThanThree,
    description: longerThanThree,
})

export default schema