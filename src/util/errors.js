const DaemonNotInstalledError = new Error('AutofillDaemonNotInstalled')
DaemonNotInstalledError.name = 'AutofillDaemonNotInstalled'

const AutofillUnknownError = new Error('AutofillUnknownError')
AutofillUnknownError.name = 'AutofillUnknownError'

const AutofillInvalidTypeError = new Error('AutofillInvalidType')
AutofillInvalidTypeError.name = 'AutofillInvalidType'

const AutofillInvalidHeaders = new Error('AutofillInvalidHeaders')
AutofillInvalidHeaders.name = 'AutofillInvalidHeaders'
AutofillInvalidHeaders.message = 'Invalid headers object. Headers object must contain [x-api-key, x-sd-user-id, x-sd-store-id, Authorization]'

const AutofillOutdated = new Error('AutofillOutdated')
AutofillOutdated.name = 'AutofillOutdated'
AutofillOutdated.message = 'You are using an old version of autofill. Please download and install the new one'

export default {
  DaemonNotInstalledError,
  AutofillUnknownError,
  AutofillInvalidTypeError,
  AutofillInvalidHeaders,
  AutofillOutdated
}
