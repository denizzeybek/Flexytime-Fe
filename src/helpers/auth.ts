export const authHeader = () => {
  let authentication = JSON.parse(localStorage.getItem('authentication')!)
  return { Authorization: 'Bearer ' + authentication.access_token }
}

export const authLoginHeader = () => {
  return {
    Authorization:
      'BASIC QzFBMDNCMTAtN0Q1OS00MDdBLUE5M0UtQjcxQUIxN0FEOEMyOjE3N0UzMjk1LTA2NTYtNDMxNy1CQzkxLUREMjcxQTE5QUNGRg=='
  }
}
