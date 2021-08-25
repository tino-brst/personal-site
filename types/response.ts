type Error = { message: string }

type Response<T> = T | Error

export type { Response }
