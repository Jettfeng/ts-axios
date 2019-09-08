import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';
import { isURLSameOrigin } from '../helpers/url';
import { isFormData } from '../helpers/util';
import cookie from '../helpers/cookie';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    return new Promise((resolve, reject) => {
        const {
            data = null,
            url,
            method = "get",
            headers,
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus
        } = config
        const request = new XMLHttpRequest()

        request.open(method.toUpperCase(), url!, true)

        configureRequest()

        addEvents()

        processHeaders()

        processCancel()

        request.send(data)
        // 提取请求配置
        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }
            //  超时
            if (timeout) {
                request.timeout = timeout
            }
            // 跨域处理
            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }
        // 事件函数
        function addEvents(): void {
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
            // 下载进度
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }
            // 上传进度
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }
        // 处理header
        function processHeaders(): void {

            if (isFormData(data)) { // 如果上传的数据为formData
                delete headers['Content-Type']
            }
            // XSRF 防御
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }

            Object.keys(headers).forEach((name) => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }

            })
        }

        function processCancel(): void {
            // 取消
            if (cancelToken) {
                cancelToken.promise
                    .then(reason => {
                        request.abort()
                        reject(reason)
                    })
            }
        }

        function handleResponse(response: AxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)) {
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