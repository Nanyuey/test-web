export const PositiveIntNZReg = /^\+?[1-9][0-9]*$/ // 非零正整数
export const PositiveIntReg = /^\d+$/ // 正整数
export const IndicatorWeightReg = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|^100$|^100\.0$|^100\.00$/ // 权重 0 - 100, 可以是两位小数
export const NumberReg = /^-?([1-9]\d*|0)(\.\d\d*)?$/ // 数字
export const InputNumberReg = /^-?(([1-9]\d*|0)(\.\d{0,2}?)?)?$/ // 输入过程中数字,允许小数点结尾,两位小数
export const InputPositiveIntReg = /^([1-9]\d*|0)(\.\d{0,2}?)?$/ // 输入过程中数字,允许小数点结尾,两位小数
