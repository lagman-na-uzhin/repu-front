export interface IYandexPlacementSearchResponse {
  id: string
  address_name: string
  name: string
  type: string
  point: { lat: number; lon: number }
  search_attributes: {
    type: string
  }
}
