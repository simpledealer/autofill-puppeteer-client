import { compose, concat, prop, replace } from 'ramda'
import yaml from 'js-yaml'
import axios from 'axios'
import errors from './util/errors'
import { listenToDaemon, createHandleAutofillWs } from './lib/websocket'
import { createHandleAutofillS3 } from './lib/protocol-handler'

const baseDaemonS3Bucket = 'https://autofill-daemon-executables.s3.amazonaws.com/'

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

export {
  errors,
  createDownloadAutofillDaemon,
  fetchLatestVersion,
  listenToDaemon,
  createHandleAutofillS3,
  createHandleAutofillWs
}
