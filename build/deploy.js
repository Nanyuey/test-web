#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const zipdir = require('zip-dir')
const superagent = require('superagent')

const projectDir = path.resolve(__dirname, '..')
const dir = str => path.resolve(projectDir, str)
const packageJson = require(dir('./package.json'))
const {
  ddNoticeToken, // 钉钉机器人通知token
  userAuthToken, // 发布系统的授权码
  packgeUrl
} = packageJson.fanqierCi
const packgeVersion = packageJson.version

function initParams () {
  return new Promise((resolve, reject) => {
    let packgeBranch
    let packgeParameter
    let localName
    let publishMethod
    const argvs = process.argv.slice(2)
    const publishCode = argvs[1]
    if (argvs[0] === 'production') {
      packgeBranch = 'fq-gift-d-online'
      packgeParameter = 'fq-gift-d-online'
      localName = 'tomato-activity-d-web'
      publishMethod = 'prod'
    } else if (argvs[0] === 'test') {
      packgeBranch = 'fq-gift-d-test'
      packgeParameter = 'fq-gift-d-test'
      localName = 'tomato-activity-test-d-web'
      publishMethod = 'test'
    } else {
      return reject(new Error('发布参数错误，未能找到发布版本'))
    }

    // 校验执行发布的必要条件 不满足直接取消
    if (!userAuthToken) {
      reject(new Error('package 缺少 token，发布中止'))
    } else if (!packgeVersion) {
      reject(new Error('package 缺少 version，发布中止'))
    } else if (!packgeUrl || !packgeVersion) {
      reject(new Error('package 缺少 repository，发布中止'))
    } else {
      resolve({
        publishCode, // 发布码
        userAuthToken, // 发布系统的授权码
        packgeVersion,
        packgeUrl,
        packgeBranch,
        packgeParameter,
        localName,
        publishMethod
      })
    }
  })
}

async function upload (data) {
  console.log('上传任务启动')
  if (!fs.existsSync(dir('./dist/'))) {
    console.error('找不到打包文件')
    await pushNotice(new Error('找不到打包文件'), data)
    process.exit(1)
  }

  const {
    packgeBranch,
    packgeParameter,
    localName,
    packgeUrl,
    packgeVersion,
    userAuthToken
  } = data

  console.log('开始制作压缩包')
  const zipTempPath = dir('./dist/package.zip')
  await zipdir(projectDir, {
    saveTo: zipTempPath,
    filter: (path) => {
      return path.startsWith(dir('./dist'))
    }
  })
  console.log('压缩包制作完成', fs.statSync(zipTempPath))
  const res = await superagent
    .post('http://sync.superboss.cc/api/add_version_file.json')
    .set('cache-control', 'no-cache')
    .attach('uploadFile', zipTempPath)
    .field({
      packgeBranch,
      packgeParameter,
      localName,
      packgeUrl,
      packgeVersion,
      userAuthToken
    })
  return new Promise((resolve, reject) => {
    if (!res.body) {
      reject(new Error('上传压缩包请求异常'))
    } else if (res.body.code !== '200') {
      reject(res.body)
    } else if (!res.body.data || !res.body.data.remotePackageVersion) {
      reject(new Error('返回数据中缺少 remotePackageVersion'))
    } else {
      resolve({
        ...data,
        remotePackageVersion: res.body.data.remotePackageVersion
      })
    }
  })
}

async function publish (data) {
  console.log('开始执行发布')
  const {
    publishCode,
    publishMethod,
    packgeVersion,
    localName,
    userAuthToken,
    remotePackageVersion
  } = data

  console.log({
    publishCode,
    method: publishMethod,
    version: packgeVersion,
    localName,
    remotePackageVersion,
    userAuthToken
  })

  const res = await superagent
    .post('http://sync.superboss.cc/api/publish_version_html.json')
    .set('cache-control', 'no-cache')
    .type('form')
    .send({
      publishCode,
      method: publishMethod,
      version: packgeVersion,
      localName,
      remotePackageVersion,
      userAuthToken
    })

  return Promise.resolve({
    ...data,
    publishRes: res.body
  })
}

async function pushNotice (error, data) {
  const name = '番茄抽奖'
  const env = data.publishMethod === 'prod' ? '正式' : '测试'
  let picUrl = 'https://qn.fqcdn.cn/20210624162500-309776.jpeg?imageView2/5/w/100/h/100'
  let result = '发布成功'
  if (error) {
    picUrl = 'https://qn.fqcdn.cn/20210624162757-934156.jpeg?imageView2/5/w/100/h/100'
    result = '发布失败'
  }
  const res = await superagent
    .post(`https://oapi.dingtalk.com/robot/send?access_token=${ddNoticeToken}`)
    .send({
      msgtype: 'markdown',
      markdown: {
        title: `[${name}] ${env} ${result} ${error ? `, ${error}` : ''}`,
        text: `## [${name}] ${env} ${result} \n### ${error || '发布成功'}\n![](${picUrl})`
      }
    })
  console.log('钉钉通知结果', res.body)
}

async function run () {
  initParams()
    .then(upload)
    .then(publish)
    .then(async data => {
      await pushNotice(null, data)
    })
    .catch(async e => {
      console.log(e)
      const argvs = process.argv.slice(2)
      await pushNotice(e, {
        publishMethod: { production: 'prod', test: 'test' }[argvs[0]]
      })
      process.exit(1)
    })
}

run()
