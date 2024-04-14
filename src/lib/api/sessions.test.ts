import { add, set } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

describe('test date filtering', () => {
  const data = [
    new Date('2024-04-15T00:00:00Z'), // 2024-04-14 20:00 in America/New_York
    new Date('2024-04-15T03:59:59Z'), // 2024-04-14 23:59:59 in America/New_York
    new Date('2024-04-15T04:00:00Z'), // 2024-04-15 00:00 in America/New_York
    new Date('2024-04-15T08:00:00Z'), // 2024-04-15 04:00 in America/New_York
    new Date('2024-04-15T12:00:00Z'), // 2024-04-15 08:00 in America/New_York
    new Date('2024-04-15T16:00:00Z'), // 2024-04-15 12:00 in America/New_York
    new Date('2024-04-15T20:00:00Z'), // 2024-04-15 16:00 in America/New_York
    new Date('2024-04-16T01:00:00Z'), // 2024-04-15 21:00 in America/New_York
    new Date('2024-04-16T03:59:59Z'), // 2024-04-15 23:59:59 in America/New_York
    new Date('2024-04-16T04:00:00Z'), // 2024-04-16 00:00 in America/New_York
  ]

  it('filter dates only today', () => {
    const userTimezone = 'America/New_York'

    jest
      .useFakeTimers()
      .setSystemTime(toZonedTime(new Date('2024-04-15T10:00:00'), userTimezone))

    const serverNow = new Date()

    const userNow = fromZonedTime(serverNow, userTimezone)

    const userMidnight = set(userNow, { hours: 0, minutes: 0, seconds: 0 })
    const userNextMidnight = add(userMidnight, { hours: 24 })

    const filtered = data.filter((date) => {
      return (
        date.getTime() >= userMidnight.getTime() &&
        date.getTime() < userNextMidnight.getTime()
      )
    })

    expect(filtered).toEqual([
      new Date('2024-04-15T04:00:00Z'), // 2024-04-15 00:00 in America/New_York
      new Date('2024-04-15T08:00:00Z'), // 2024-04-15 04:00 in America/New_York
      new Date('2024-04-15T12:00:00Z'), // 2024-04-15 08:00 in America/New_York
      new Date('2024-04-15T16:00:00Z'), // 2024-04-15 12:00 in America/New_York
      new Date('2024-04-15T20:00:00Z'), // 2024-04-15 16:00 in America/New_York
      new Date('2024-04-16T01:00:00Z'), // 2024-04-15 21:00 in America/New_York
      new Date('2024-04-16T03:59:59Z'), // 2024-04-15 23:59:59 in America/New_York
    ])
  })
})
