export const Regex = {
  allCharsSame: /^(.)\1*$/,
  latinTR: /^([A-Za-zığüşöçİĞÜŞÖÇ\s]*)$/g,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,48}$/,
  website:
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

export const PASSWORD_RULES = [
  { textKey: 'common.password_strength.rules.uppercase', regex: /[A-Z]/ },
  { textKey: 'common.password_strength.rules.lowercase', regex: /[a-z]/ },
  { textKey: 'common.password_strength.rules.number', regex: /\d/ },
  { textKey: 'common.password_strength.rules.min', minLength: 8 }
]
