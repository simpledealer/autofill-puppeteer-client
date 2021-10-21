import createAssetClient from '@simple-dealer/asset-life-cycle'
import { v4 as getUuid } from 'uuid'
import { path, always, isNil, not } from 'ramda'
import getDatePrefix from './util/get-date-prefix'
import connectDaemon from './util/connect-daemon'

export default ({
  s3: { accessKeyId, secretAccessKey, region },
  getVersion = always('v1'),
  testValue
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
    s3: { accessKeyId, secretAccessKey, region, bucket: 'autofill-daemon' },
    getVersion
  })((prefix))
  const pendingRequest = await assetClient({ ...requestMetadata, assetType: 'status/pending' })
  const receivedRequest = await assetClient({ ...requestMetadata, assetType: 'status/received' })
  await pendingRequest.queue({ body: requestBody, ttl: 864000 })
  const requestKey = pendingRequest.getKey()
  await connectDaemon(requestKey)
  if(not(isNil(testValue))) return testValue
  return receivedRequest.isAvailable()
}
