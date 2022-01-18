const DaemonNotInstalledError = new Error('AutofillDaemonNotInstalled')
DaemonNotInstalledError.name = 'AutofillDaemonNotInstalled'

const AutofillUnknownError = new Error('AutofillUnknownError')
AutofillUnknownError.name = 'AutofillUnknownError'

const AutofillInvalidTypeError = new Error('AutofillInvalidType')
AutofillInvalidTypeError.name = 'AutofillInvalidType'

export default {
  DaemonNotInstalledError,
  AutofillUnknownError,
  AutofillInvalidTypeError
}
