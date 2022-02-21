const DaemonNotInstalledError = new Error('AutofillDaemonNotInstalled')
DaemonNotInstalledError.name = 'AutofillDaemonNotInstalled'

const AutofillUnknownError = new Error('AutofillUnknownError')
AutofillUnknownError.name = 'AutofillUnknownError'

const AutofillInvalidTypeError = new Error('AutofillInvalidType')
AutofillInvalidTypeError.name = 'AutofillInvalidType'

const AutofillInvalidHeaders = new Error('AutofillInvalidHeaders')
AutofillInvalidHeaders.name = 'AutofillInvalidHeaders'
AutofillInvalidHeaders.message = 'Invalid headers object. Headers object must contain [x-api-key, x-sd-user-id, x-sd-store-id, Authorization]'


export default {
  DaemonNotInstalledError,
  AutofillUnknownError,
  AutofillInvalidTypeError,
  AutofillInvalidHeaders
}
