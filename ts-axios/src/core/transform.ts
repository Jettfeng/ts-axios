import { AxiosTransformer } from '../types/index';
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
    if (!fns) {
        return data
    }
    if (!Array.isArray(fns)) { // 如果不是数组，转换成长度为1的数组
        fns = [fns]
    }
    fns.forEach(fn => {
        data = fn(data, headers)
    })
    return data
}