export const CAPITALIZED = {
  pattern: /^[A-ZА-Я][\wа-я-]*/s,
  message: 'Must be capitalized',
};
export const LATIN_AND_CYRILLIC = {
  pattern: /[\wа-я-]*/s,
  message: 'Only latin, cyrillic and hyphen',
};
export const ALPHA_REQUIRED = {
  pattern: /([a-z])+/is,
  message: 'At least one latin letter required',
};
export const ALNU_HYPHEN_UNDERSCORE = {
  pattern: /([\w-]+)/i,
  message: 'Allowed only latin, numbers and underscore',
};
export const CAPITAL_REQUIRED = {
  pattern: /[A-ZА-Я]+/s,
  message: 'At least one capital letter required',
};
export const DIGIT_REQUIRED = {
  pattern: /\d+/s,
  message: 'At least one digit required',
};
export const ONLY_DIGITS = {
  pattern: /\+?\d/s,
  message: 'Phone cannot contain non-numerical symbols',
};

export const EMAIL = {
  pattern: /^[\w.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/,
  message: 'Incorrect email format',
};
