import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Method, AxiosError, ResolvedFn, RejectedFn } from '../types/index';
import dispatchRequest, { transformURL } from './diapatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise),
    rejected?: RejectedFn
}

export default class Axios {
    defaults: AxiosRequestConfig
    interceptors: Interceptors
    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    request(url: any, config?: any): AxiosPromise { // 函数重载
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url
        } else { // url为对象
            config = url
        }
        // 合并配置
        config = mergeConfig(this.defaults, config)
        // 拦截器
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        this.interceptors.request.forEach((interceptor) => {
            chain.unshift(interceptor)
        })

        this.interceptors.response.forEach((interceptor) => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)
        while (chain.length) {
            let { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }
        return promise
    }
    get(url: string, config: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get', url, config)
    }
    delete(url: string, config: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }
    head(url: string, config: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }
    options(url: string, config: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }
    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('post', url, data, config)
    }
    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }
    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }
    getUri(config?: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config)
        return transformURL(config)
    }
    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }))
    }
    _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url,
            data
        }))
    }
}