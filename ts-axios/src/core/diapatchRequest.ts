import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index';
import xhr from './xhr';
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url';
import { transformRequest, transformResponse } from '../helpers/data';
import { processHeaders, flattenHeaders } from '../helpers/headers';
import transform from './transform';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config).then((res) => {
        return transformResponseData(res)
    })
}
// 处理request数据
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    // config.headers = transformHeaders(config)
    // 处理headers要在处理data之前，因为处理data的时候对data进行了转换
    config.data = transform(config.data, config.headers, config.transformRequest)

    config.headers = flattenHeaders(config.headers, config.method!)
}
// 处理url
export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramsSerializer)// url!表示该数据一定不会为空
}
// 处理data
// function transformRequestData(config: AxiosRequestConfig): any {
//     return transformRequest(config.data)
// }
// 处理headers
// function transformHeaders(config: AxiosRequestConfig): void {
//     const { headers = {}, data } = config
//     return processHeaders(headers, data)
// }
// 处理返回的数据
function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}
