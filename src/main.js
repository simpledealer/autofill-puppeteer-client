import createAssetClient from '@simple-dealer/asset-life-cycle'
import { v4 as getUuid } from 'uuid'
import { path, always, isNil, not } from 'ramda'
import getDatePrefix from './util/get-date-prefix'
import connectDaemon from './util/connect-daemon'

export default ({
  s3: { accessKeyId, secretAccessKey, region },
  getVersion = always('v1'),
  testValue = true
}) => async creditApplication => {
  const applicationId = path(['mainApplicant', 'id'], creditApplication)
  const dealershipId = path(['mainApplicant', 'dealership', 'id'], creditApplication)
  const prefix = getDatePrefix()
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
  await pendingRequest.queue({ body: JSON.stringify(creditApplication), ttl: 864000 })
  const requestKey = pendingRequest.getKey()
  await connectDaemon(requestKey)
  if(not(isNil(testValue))) return testValue
  return receivedRequest.isAvailable()
}
