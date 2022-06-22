import WebSocket from 'reconnecting-websocket'
import { v4 as uuid } from 'uuid'
import { values } from 'ramda'
import { validateAutofillType } from '../util/autofill-types'

/** @type {WebSocket} **/
let ws
const wsListeners = { open: {}, error: {}, message: {}, close: {} }
let wsConnected = false

const connectWS = () => {
  ws = new WebSocket('ws://localhost:5001/realtime')

  ws.onopen = event => {
    wsConnected = true
    const handlers = values(wsListeners.open)
    handlers.forEach(handler => createHandleEvent(handler)(event))
  }

  ws.onerror = event => {
    wsConnected = false
    const handlers = values(wsListeners.error)
    handlers.forEach(handler => createHandleEvent(handler)(event))
  }

  ws.onmessage = event => {
    const handlers = values(wsListeners.message)
    handlers.forEach(handler => createHandleEvent(handler)(event))
  }

  ws.onclose = event => {
    wsConnected = false
    const handlers = values(wsListeners.close)
    handlers.forEach(handler => createHandleEvent(handler)(event))
  }
}

const parseWsData = data => {
  if (data) return JSON.parse(data)
}

const createHandleEvent = (handler = () => { }) => ({ data }) => {
  const payload = parseWsData(data)
  return handler(payload)
}

const addWSListener = ({ key, ref, action }) => {
  wsListeners[key][ref] = action
}

const removeWSListener = ({ key, ref }) => {
  delete wsListeners[key][ref]
}

const sendWSPayload = payload => {
  const data = typeof payload !== 'string' ? JSON.stringify(payload) : payload
  if (data) ws.send(data)
}

export const listenToDaemon = ({
  onOpen = () => { },
  onError = () => { },
  onMessage = () => { },
  onClose = () => { }
} = {}) => {
  if (!ws) connectWS()
  const ref = uuid()
  if (wsConnected) onOpen()
  addWSListener({ key: 'open', ref, action: onOpen })
  addWSListener({ key: 'error', ref, action: onError })
  addWSListener({ key: 'message', ref, action: onMessage })
  addWSListener({ key: 'close', ref, action: onClose })
  return {
    connected: wsConnected,
    sendWSPayload,
    unsubscribe: () => {
      removeWSListener({ key: 'open', ref })
      removeWSListener({ key: 'error', ref })
      removeWSListener({ key: 'message', ref })
      removeWSListener({ key: 'close', ref })
    }
  }
}

export const createHandleAutofillWs = ({
  headers = {}
  // getVersion = always('v1')
} = {}) => async ({
  mainApplicant,
  coApplicant,
  deal,
  userInformation,
  lenders = [],
  insurers = [],
  type = 'autofill',
  timestamp = new Date()
}) => {
  validateAutofillType(type)
  const data = {
    version: '4.0.0',
    mainApplicant,
    coApplicant,
    deal,
    userInformation,
    lenders,
    insurers,
    type,
    headers,
    timestamp
  }
  ws.send(JSON.stringify({
    type: 'autofill',
    data: data
  }))
}
