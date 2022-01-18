import test from 'ava'
import { validateAutofillType } from './main'

test('Check validate autofill type', t => {
  const error = t.throws(() => {
    validateAutofillType('loan')
  }, { instanceOf: Error })

  t.is(error.name, 'AutofillInvalidType')
})
