import S3 from 'aws-sdk/clients/s3'
import { equals, prop, not, toString } from 'ramda'
import axios from 'axios'
import yaml from 'js-yaml'
import errors from './errors'

export const latestDaemonUrl = 'https://autofill-daemon-executables.s3.amazonaws.com/latest.yml'

export default ({ s3 }) => async receivedRequestKey => {
  if (!receivedRequestKey) {
    throw errors.AutofillOutdated
  }

  // Load current daemon version
  const s3Client = new S3(s3)
  const { Body } = await s3Client.getObject({
    Bucket: 'autofill-daemon-data',
    Key: receivedRequestKey
  }).promise()
  const payload = JSON.parse(toString(Body))
  const { daemonVersion: currentDaemonVersion } = payload

  // Load latest daemon version
  const { data: latestYaml } = await axios.get(latestDaemonUrl)
  const latestJSON = yaml.load(latestYaml)
  const latestDaemonVersion = prop('version')(latestJSON)


  if (not(equals(currentDaemonVersion, latestDaemonVersion))) {
    throw errors.AutofillOutdated
  }
}
