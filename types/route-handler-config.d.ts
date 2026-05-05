declare global {
  type RouteHandlerConfig<Route extends string = string> = {
    GET?: (...args: any[]) => any
    POST?: (...args: any[]) => any
    PUT?: (...args: any[]) => any
    PATCH?: (...args: any[]) => any
    DELETE?: (...args: any[]) => any
    HEAD?: (...args: any[]) => any
    OPTIONS?: (...args: any[]) => any
  }
}

export {};
