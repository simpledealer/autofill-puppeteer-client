import createAssetClient from '@simple-dealer/asset-life-cycle'
import { v4 as getUuid } from 'uuid'
import { path, always, not, includes, prop } from 'ramda'
import getDatePrefix from './util/get-date-prefix'
import connectDaemon from './util/connect-daemon'
import errors from './util/errors'
import yaml from 'js-yaml';

const baseDaemonS3Bucket = 'https://autofill-daemon-executables.s3.amazonaws.com'
const latestDaemon = 'https://autofill-daemon-executables.s3.amazonaws.com/Simple+Dealer+Autofill+Setup+1.0.16.exe'

export const autofillTypes = ['lender', 'ofac', 'test']

export const validateAutofillType = autofillType => {
  if (not(includes(autofillType, autofillTypes))) throw errors.AutofillInvalidTypeError
}

export default ({
  s3: { accessKeyId, secretAccessKey, region },
  getVersion = always('v1')
}) => async ({
  mainApplicant,
  coApplicant,
  deal,
  userInformation,
  version = '3.2.0',
  lenders,
  type = 'lender'
}) => {
  validateAutofillType(type)
  const applicationId = path(['id'], mainApplicant)
  const dealershipId = path(['dealership', 'id'], mainApplicant)
  const prefix = getDatePrefix()
  const requestBody = JSON.stringify({ mainApplicant, coApplicant, deal, userInformation, version, lenders, type })
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
  if (not(autofillStarted)) throw errors.AutofillUnknownError
  return autofillStarted
}

const createDownloadAutofillDaemon = () => async () => {
  /*const {data: latestYaml} = await axios.get(`${baseDaemonS3Bucket}/latest.yml`)
  const latestJSON = yaml.load(latestYaml)
  const latestDaemonName = prop('path')(latestJSON)
  window.location.href = `${baseDaemonS3Bucket}/${latestDaemonName}`*/
  window.location.href = latestDaemon
}

export { errors, createDownloadAutofillDaemon }
