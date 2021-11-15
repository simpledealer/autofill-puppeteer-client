import createAssetClient from '@simple-dealer/asset-life-cycle'
import { v4 as getUuid } from 'uuid'
import { path, always, not } from 'ramda'
import getDatePrefix from './util/get-date-prefix'
import connectDaemon from './util/connect-daemon'
import errors from './util/errors'

export default ({
  s3: { accessKeyId, secretAccessKey, region },
  getVersion = always('v1')
}) => async ({
  mainApplicant,
  coApplicant,
  deal,
  userInformation,
  version = '3.2.0',
  lenders
}) => {
  const applicationId = path(['id'], mainApplicant)
  const dealershipId = path(['dealership', 'id'], mainApplicant)
  const prefix = getDatePrefix()
  const requestBody = JSON.stringify({ mainApplicant, coApplicant, deal, userInformation, version, lenders })
  const requestMetadata = {
    uuid: getUuid(),
    resultOrQueue: 'queue',
    applicationId,
    dealershipId
  }
  const assetClient = createAssetClient({
    s3: { accessKeyId, secretAccessKey, region, bucket: 'autofill-daemon-data' },
    getVersion
  })((prefix))
  const pendingRequest = await assetClient({ ...requestMetadata, assetType: 'status/pending' })
  const receivedRequest = await assetClient({ ...requestMetadata, assetType: 'status/received' })
  await pendingRequest.queue({ body: requestBody, ttl: 864000 })
  const requestKey = pendingRequest.getKey()
  await connectDaemon(requestKey)
  const autofillStarted = await receivedRequest.isAvailable()
  if(not(autofillStarted)) throw errors.AutofillUnknownError
  return autofillStarted
}

const createDownloadAutofillDaemon = () => () => window.location.href = 'https://github.com/simpledealer/autofill-daemon/releases/download/v0.1.0/Simple.Dealer.Autofill-0.1.0.dmg'

export { errors, createDownloadAutofillDaemon }