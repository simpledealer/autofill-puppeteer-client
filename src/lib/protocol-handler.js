import { always, path } from 'ramda'
import getDatePrefix from '../util/get-date-prefix'
import { v4 as getUuid } from 'uuid'
import createAssetClient from '@simple-dealer/asset-life-cycle'
import connectDaemon from '../util/connect-daemon'
import createCheckForUpdates from '../util/check-for-updates'
import { validateAutofillType } from '../util/autofill-types'

export const createHandleAutofillS3 = (
  {
    s3: { accessKeyId, secretAccessKey, region },
    headers = {},
    getVersion = always('v1')
  }
) => async ({
  mainApplicant,
  coApplicant,
  deal,
  userInformation,
  lenders = [],
  insurers = [],
  type = 'autofill'
}) => {
  validateAutofillType(type)
  const applicationId = path(['id'], mainApplicant)
  const dealershipId = path(['dealership', 'id'], mainApplicant)
  const prefix = getDatePrefix()
  const requestBody = JSON.stringify({ version: '4.0.0', mainApplicant, coApplicant, deal, userInformation, lenders, insurers, type, headers })
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
  connectDaemon(requestKey)
  const receivedRequestAvailable = await receivedRequest.isAvailable()
  const receivedRequestKey = receivedRequestAvailable ? receivedRequest.getKey() : null
  const checkForUpdates = createCheckForUpdates({ s3: { accessKeyId, secretAccessKey, region } })
  await checkForUpdates(receivedRequestKey)
}
