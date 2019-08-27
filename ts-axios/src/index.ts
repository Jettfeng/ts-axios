import { AxiosRequestConfig } from './types/index';
import xhr from './xhr';
import { buildURL } from './helpers/url';
import { transformRequest } from './helpers/data';
import { processHeaders } from './helpers/headers';

function axios(config: AxiosRequestConfig): void {
    // TODO
    processConfig(config)
    xhr(config)
}
// 处理request数据
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.headers = transformHeaders(config)
    // 处理headers要在处理data之前，因为处理data的时候对data进行了转换
    config.data = transformRequestData(config)
}
// 处理url
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}
// 处理data
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}
// 处理headers
function transformHeaders(config: AxiosRequestConfig): void {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}
export default axios
