import createAssetClient from '@simple-dealer/asset-life-cycle'
import { v4 as getUuid } from 'uuid'
import { always, compose, concat, includes, not, path, prop, replace } from 'ramda'
import yaml from 'js-yaml'
import axios from 'axios'
import getDatePrefix from './util/get-date-prefix'
import connectDaemon from './util/connect-daemon'
import createCheckForUpdates from './util/check-for-updates'
import errors from './util/errors'

const baseDaemonS3Bucket = 'https://autofill-daemon-executables.s3.amazonaws.com/'

export const autofillTypes = ['lender', 'ofac', 'test']

export const validateAutofillType = autofillType => {
  if (not(includes(autofillType, autofillTypes))) throw errors.AutofillInvalidTypeError
}

export default ({
  s3: { accessKeyId, secretAccessKey, region },
  headers = {},
  getVersion = always('v1')
}) => async ({
  mainApplicant,
  coApplicant,
  deal,
  userInformation,
  lenders,
  type = 'lender'
}) => {
  validateAutofillType(type)
  const applicationId = path(['id'], mainApplicant)
  const dealershipId = path(['dealership', 'id'], mainApplicant)
  const prefix = getDatePrefix()
  const requestBody = JSON.stringify({
    version: '4.0.0',
    mainApplicant,
    coApplicant,
    deal,
    userInformation,
    lenders,
    type,
    headers
  })
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

const fetchLatestVersion = async () => {
  const { data: latestYaml } = await axios.get(`${baseDaemonS3Bucket}latest.yml`)
  const { version } = yaml.load(latestYaml)
  return version
}

const createDownloadAutofillDaemon = () => async () => {
  const { data: latestYaml } = await axios.get(`${baseDaemonS3Bucket}latest.yml`)
  const latestJSON = yaml.load(latestYaml)
  const latestDaemonName = prop('path')(latestJSON)
  const latestDaemonUrl = compose(replace(' ', '+'), concat(baseDaemonS3Bucket))(latestDaemonName)
  window.open(latestDaemonUrl)
}

export { errors, createDownloadAutofillDaemon, fetchLatestVersion }
