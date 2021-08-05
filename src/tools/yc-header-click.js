import { v4 as uuidv4 } from 'uuid'
import { hmacMD5 } from '@/tools/index'

const hostname = (window.location && window.location.hostname) || 'fanqier.cn'

let hostList = hostname.split('.')
hostList = hostList.splice(hostList.length - 2, hostList.length)

const topHost = hostList.join('.')

/**
 * @desc 有成吊顶打点
 * 测试环境验证提交数据：
 * http://gu8as2.cjfx.cn/f/pjwfuqlx/open/list
 *
 * @param  {Object} data 原始数据
 * @param  {Boolean} isTest 是否是测试，测试将提交到测试环境
 * @returns {Object} params 表单提交数据
 */
export const getYcHeaderClickPointData = ({ from, to, corpId, corpName, userId, nickName }, isTest) => {
  const fromDic = isTest ? {
    crm: { id: '5d81f991eb2c020abe00002d', name: '有成CRM' },
    cw: { id: '5d81f9b1eb2c020abe000032', name: '有成财务' },
    hy: { id: '5d81f9b5eb2c020abe000033', name: '有成会议' },
    hw: { id: '5d81f9baeb2c020abe000034', name: '有成会务' },
    fq: { id: '5d81f9beeb2c020abe000035', name: '番茄表单' }
  } : {
    crm: { id: '5d81a13330ce14e611000180', name: '有成CRM' },
    cw: { id: '5d81a13330ce14e611000181', name: '有成财务' },
    hy: { id: '5d81a13330ce14e611000182', name: '有成会议' },
    hw: { id: '5d81a13330ce14e611000183', name: '有成会务' },
    fq: { id: '5d81a13330ce14e611000184', name: '番茄表单' }
  }
  const toDic = isTest ? {
    crm: { id: '5d81f9c4eb2c020abe000037', name: '有成CRM' },
    cw: { id: '5d81f9c4eb2c020abe000038', name: '有成财务' },
    hy: { id: '5d81f9c4eb2c020abe000039', name: '有成会议' },
    hw: { id: '5d81f9c4eb2c020abe00003a', name: '有成会务' },
    fq: { id: '5d81f9c4eb2c020abe00003b', name: '番茄表单' }
  } : {
    crm: { id: '5d81a13630ce14e611000186', name: '有成CRM' },
    cw: { id: '5d81a13630ce14e611000187', name: '有成财务' },
    hy: { id: '5d81a13630ce14e611000188', name: '有成会议' },
    hw: { id: '5d81a13630ce14e611000189', name: '有成会务' },
    fq: { id: '5d81a13630ce14e61100018a', name: '番茄表单' }
  }
  const formId = isTest ? '5d81f934ed00f71d6d8c1993' : '5d81a06d8be1906ca329fd3a'
  const shortId = isTest ? 'pjwfuqlx' : 'yudiljvz'
  const { id: fromId, name: fromName } = fromDic[from] || {}
  const { id: toId, name: toName } = toDic[to] || {}

  if (!fromId || !toId) return

  const requestId = uuidv4()

  return {
    url: `${isTest ? `http:/${topHost}` : `https:/ding.${topHost}`}/api/f/${formId}`,
    type: 'POST',
    data: {
      values: [
        {
          definition: isTest ? '5d81f963eb2c020abe000028' : '5d81a78a30ce14e61100018b',
          type: 'text',
          value: corpId,
          isNumber: false
        },
        {
          definition: isTest ? '5d81f966eb2c020abe00002a' : '5d81a0af30ce14e611000179',
          type: 'text',
          value: corpName,
          isNumber: false
        },
        {
          definition: isTest ? '5d81f966eb2c020abe00002b' : '5d81a79330ce14e61100018c',
          type: 'text',
          value: userId,
          isNumber: false
        },
        {
          definition: isTest ? '5d81f963eb2c020abe000029' : '5d81a7a530ce14e61100018f',
          type: 'text',
          value: nickName,
          isNumber: false
        },
        {
          definition: isTest ? '5d81f991eb2c020abe00002c' : '5d81a11330ce14e61100017e',
          type: 'radio',
          selectedId: fromId,
          isOther: false,
          selectedItem: fromName,
          remark: ''
        },
        {
          definition: isTest ? '5d81f9c4eb2c020abe000036' : '5d81a13630ce14e611000185',
          type: 'radio',
          selectedId: toId,
          isOther: false,
          selectedItem: toName,
          remark: ''
        }
      ],
      formId,
      wechat: null,
      duration: 666,
      requestId,
      salt: hmacMD5(`${shortId}${requestId}`),
      dingtalk: {},
      isEncrypt: false
    }
  }
}
