import { ResolvedFn, RejectedFn } from '../types/index';

interface interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T>{
    private interceptors: Array<interceptor<T> | null>
    constructor() {
        this.interceptors = []
    }
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }
    // 让外部访问
    forEach(fn: (interceptor: interceptor<T>) => void): void {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }
    // 删除拦截器
    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}