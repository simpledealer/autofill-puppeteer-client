const DaemonNotInstalledError = new Error('AutofillDaemonNotInstalled')
DaemonNotInstalledError.name = 'AutofillDaemonNotInstalled'

const AutofillUnknownError = new Error('AutofillUnknownError')
AutofillUnknownError.name = 'AutofillUnknownError'

export default {
  DaemonNotInstalledError,
  AutofillUnknownError
}