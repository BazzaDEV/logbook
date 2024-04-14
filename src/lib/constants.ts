// TODO: Use a dedicated timezone library
// For example, see: https://github.com/vvo/tzdb/
export const timezones = Intl.supportedValuesOf('timeZone').map((value) => ({
  name: value.replaceAll('_', ' '),
  value,
}))
