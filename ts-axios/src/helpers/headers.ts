import { isPlainObject } from './util';
function normalizeHeaderName(headers: any, normalizeName: any): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach((name) => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}
export function processHeaders(headers: any, data: any): any {
  // 只有data是普通对象的时候才做处理
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=uft-8'
        }
    }
    return headers
}

// 格式化返回的headers
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null)
    if (!headers) {
        return headers
    }
    headers.split('\r\n').forEach((line) => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}