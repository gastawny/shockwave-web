import { http, RequestOptions } from './http'

interface FetcherOptions extends Omit<RequestOptions, 'revalidateTag' | 'tags'> {}

export async function fetcher<T = any>(path: string, options: FetcherOptions = {}) {
  return (await http<T>(path, options)).data
}
