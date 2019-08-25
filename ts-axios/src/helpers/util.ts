// 判断是否是日期
const toString = Object.prototype.toString
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}
// 判断是否为对象
export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object'
}