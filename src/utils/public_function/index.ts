/**
 * 判断数组中是否存在指定对象的键值对
 * @function arrIsKey
 * @param {any[]} arr - 待检查的数组
 * @param {string} key - 对象的键名
 * @param {(string | number)} value - 要匹配的值
 * @returns {boolean} - 是否存在匹配项
 */
export function arrIsKey(arr: any[], key: string, value: string | number): boolean {
  return arr.some(item => item[key] === value)
}

/**
 * 格式化价格，保留两位小数
 * @function formatPrice
 * @param {(string | number)} price - 待格式化的价格
 * @returns {string} - 格式化后的价格字符串
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price
  return isNaN(numPrice) ? '' : numPrice.toFixed(2)
}

/**
 * 移除对象中无效的属性
 * @function cleanObject
 * @param {object} obj - 待处理的对象
 * @returns {object} - 处理后的新对象
 */
export function cleanObject(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== '' && obj[key] !== null
      && !Number.isNaN(obj[key]) && !(Array.isArray(obj[key]) && obj[key].length === 0)
      && !(typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

/**
 * 在指定日期上添加天数
 * @function addDaysToDate
 * @param {string} dateStr - 日期字符串
 * @param {number} daysToAdd - 添加的天数
 * @returns {string} - 新的日期字符串
 */
export function addDaysToDate(dateStr: string, daysToAdd: number): string {
  return dayjs(dateStr).add(daysToAdd, 'day').format('YYYY-MM-DD')
}

/**
 * 验证输入金额格式
 * @function validatePrice
 * @param {any} rule - 验证规则
 * @param {(string | number)} price - 待验证的金额
 * @returns {Promise<void>} - 验证结果
 */
export function validatePrice(rule: any, price: string | number): Promise<void> {
  const value = price.toString()
  const amountRegex = /^\d+(\.\d{1,2})?$/
  return !amountRegex.test(value) || Number.parseFloat(value) < 0
    ? Promise.reject('输入金额格式不正确')
    : Promise.resolve()
}

/**
 * 浮点数减法，解决精度问题
 * @function safeSubtraction
 * @param {(number | string)} value1 - 被减数
 * @param {(number | string)} value2 - 减数
 * @returns {(number | null)} - 计算结果
 */
export function safeSubtraction(value1: number | string, value2: number | string): number | null {
  if (!value1 || !value2)
    return null
  const result = new Decimal(value1).minus(new Decimal(value2))
  return result.toNumber()
}

/**
 * 深拷贝对象
 * @function deepClone
 * @param {T} obj - 待拷贝的对象
 * @returns {T} - 拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
