import { AxiosRequestConfig } from './types/index';
import { processHeaders } from './helpers/headers';
import { transformRequest, transformResponse } from './helpers/data';

const defaults: AxiosRequestConfig = {
    method: 'get',

    timeout: 0,

    headers: {
        common: {
            Accept: 'application/json,text/plain,*/*'
        }
    },
    transformRequest: [
        function (data: any, headers: any): any {
            processHeaders(data, headers)
            return transformRequest(data)
        }
    ],
    transformResponse: [
        function (data: any): any {
            return transformResponse(data)
        }
    ]
}

// 请求参数没有data
const methodsNoData = ['delete', 'get', 'head', 'options']
methodsNoData.forEach((method) => {
    defaults.headers[method] = {}
})
// 请求参数有data
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach((method) => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults;