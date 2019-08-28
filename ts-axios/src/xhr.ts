import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index';
import { parseHeaders } from './helpers/headers';
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    return new Promise((resolve, reject) => {
        const { data = null, url, method = "get", headers, responseType, timeout } = config
        const request = new XMLHttpRequest()
        if (responseType) {
            request.responseType = responseType
        }
        // 超时
        if (timeout) {
            request.timeout = timeout
        }
        request.open(method.toUpperCase(), url, true)
        // 成功
        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {// 接收失败
                return
            }
            if (request.status === 0) {
                return
            }
            console.log(request)
            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData = responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            // resolve(response)
            handleResponse(response)
        }
        // 错误处理
        request.onerror = function handleError() {
            reject(new Error('Network Error'))
        }
        // 超时处理
        request.ontimeout = function handleTimeout() {
            reject(new Error(`Timeout of ${timeout} ms exceeded`))
        }
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }

        })
        request.send(data)
        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(new Error(`Request failed with status code ${response.status}`))
            }
        }
    })
}