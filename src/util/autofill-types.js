import { includes, not } from 'ramda'
import errors from './errors'

export const autofillTypes = ['autofill', 'ofac', 'test']

export const validateAutofillType = autofillType => {
  if (not(includes(autofillType, autofillTypes))) throw errors.AutofillInvalidTypeError
}
