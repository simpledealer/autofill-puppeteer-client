export const toAscii = input => Buffer.from(input, 'base64').toString('ascii')
export const toBase64 = input => Buffer.from(input, 'ascii').toString('base64')