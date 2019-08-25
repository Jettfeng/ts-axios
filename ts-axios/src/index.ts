import { AxiosRequestConfig } from './types/index';
import xhr from './xhr';
import { buildURL } from './helpers/url';
import { transformRequest } from './helpers/data';

function axios(config: AxiosRequestConfig): void {
    // TODO
    processConfig(config)
    xhr(config)
}
// 处理request数据
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.data = transformRequestData(config)
}
// 处理url
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}
export default axios
