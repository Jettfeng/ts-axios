import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    return new Promise((resolve, reject) => {
        const { data = null, url, method = "get", headers, responseType, timeout, cancelToken, withCredentials } = config
        const request = new XMLHttpRequest()
        if (responseType) {
            request.responseType = responseType
        }
        // 超时
        if (timeout) {
            request.timeout = timeout
        }
        request.open(method.toUpperCase(), url!, true)
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
            reject(createError('Network Error', config, null, request))
        }
        // 超时处理
        request.ontimeout = function handleTimeout() {
            createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        }
        // 跨域处理
        if (withCredentials) {
            request.withCredentials = withCredentials
        }
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }

        })
        // 取消
        if (cancelToken) {
            cancelToken.promise
                .then(reason => {
                    request.abort()
                    reject(reason)
                })
        }
        request.send(data)
        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(
                    createError(
                        `Request failed with status code ${response.status}`,
                        config,
                        null,
                        request,
                        response
                    )
                )
            }
        }
    })
}