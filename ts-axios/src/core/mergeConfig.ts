import { AxiosRequestConfig } from '../types/index';
import { deepMerge,isPlainObject } from '../helpers/util';

const strats = Object.create(null)
// 默认合并策略(优先取val2)
function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
}
// 只取val2
function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}
// 复杂对象的合并
function deepMergeStrat(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
      return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
      return val2
    } else if (isPlainObject(val1)) {
      return deepMerge(val1)
    } else {
      return val1
    }
  }
const stratKeysFromVal2 = ['url', 'params', 'data'] // 如果有这些参数，这些参数只能来自config2
stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config2) {
        config2 = {}
    }

    const config = Object.create(null)
    // 遍历config2
    for (let key in config2) {
        mergeField(key)
    }
    // 遍历config1
    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }
    function mergeField(key: string): void {
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2![key])
    }
    return config
}