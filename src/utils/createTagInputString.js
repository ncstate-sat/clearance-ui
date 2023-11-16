export default (person) => {
  let fullString = `${person['first_name']} ${person['last_name']}`
  if (person['email']) {
    fullString += ` (${person['email']})`
  }
  if (person['campus_id']) {
    fullString += ` [${person['campus_id']}]`
  }
  return fullString
}
