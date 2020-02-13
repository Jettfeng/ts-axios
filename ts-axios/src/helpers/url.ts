import { isDate, isPlainObject } from './util';

function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
    // 返回一个新的url
    if (!params) { // 如果没有params，直接返回url
        return url
    }
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
        const val = params[key]
        if (val === null || typeof val === 'undefined') { // 不发送值为null和undefined的参数
            return
        }
        let values = []
        if (Array.isArray(val)) {  
          // 参数值为数组
          // axios({
          //   method: 'get',
          //   url: '/base/get',
          //   params: {
          //     foo: ['bar', 'baz']
          //   }
          // })
          // 最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'
            values = val
            key += '[]'
        } else {
            values = [val]
        }
        values.forEach((val) => {
            if (isDate(val)) {
                val = val.toISOString()
            } else if (isPlainObject(val)) {
                val = JSON.stringify(val)
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })
    let serializedParams = parts.join('&')
    if (serializedParams) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) {
            url = url.slice(0, markIndex)
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
}