export default function toLocalDate(date) {
  return new Date(date).toLocaleDateString("en-US", {day: "numeric", month: "long", year: "numeric"}); //long
}