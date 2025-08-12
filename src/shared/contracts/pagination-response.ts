export interface PaginationResponse<T> {
  list: T[]
  total: number
  totalPages: number
  currentPage: number
  limit: number
}
