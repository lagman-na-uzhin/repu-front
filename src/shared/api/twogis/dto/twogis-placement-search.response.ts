export interface ITwogisPlacementSearchResponse {
  id: string
  address_name: string
  name: string
  type: string
  point: { lat: number; lon: number }
  adm_div: any[],
  search_attributes: {
    type: string
  }
}
