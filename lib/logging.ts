import { createLogger, format, transports } from 'winston'

const csv = format.printf(({ message, timestamp }) => {
  return `"${timestamp}",${message}`
})

export const logging = createLogger({
  format: format.combine(
    format.timestamp(),
    csv
  ),
  transports: [
    new transports.File({ filename: 'logs/pagetimes.csv' })
  ]
})
