import { isPlainObject } from './util';
// 请求参数为对象时，转换为字符串
export function transformRequest(data: any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

export function transformResponse(data: any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch{
            // do nothing
        }
    }
    return data
}