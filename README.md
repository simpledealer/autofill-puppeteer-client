## Description
Client library to connect to Simple Dealer's Autofill from the web

## Pre-Requisites
- [Simple Dealer Autofill](https://github.com/simpledealer/autofill-daemon/releases/download/v0.1.0/Simple.Dealer.Autofill-0.1.0.dmg)


## Installation

Add this as a dependency to your project using [npm] with

```
$ npm i @simple-dealer/autofill-puppeteer-client
```

or using [Yarn] with

```
$ yarn add @simple-dealer/autofill-puppeteer-client
```

## Usage


### Connect to autofill client

```js
import createAutoFillClient, { download } from '@simple-dealer/autofill-puppeteer-client'

const s3 = { 
  accessKeyId: '',
  secretAccessKey: '',
  region: ''
};

const autofillPayload = {}

const autoFillClient = createAutoFillClient({ s3 })
const { success, code } = await autoFillClient(autofillPayload);

if(!success) {
  if(equals(code, 'AutofillDaemonNotInstalled')) download()
  if(equals(code, 'AutofillUnknownError')) alert('Unknown error occurred')
  return
}

console.log('Autofill started')
```

### Get detailed parameters - [here](https://www.notion.so/simpledealer/Autofill-Puppeteer-Client-53aa3fa94d9a4e858cac861b567a1779)