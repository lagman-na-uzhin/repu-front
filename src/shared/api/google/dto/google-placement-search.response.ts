export interface IGooglePlacementSearchResponse {
  id: string
  name: string
  address_name: string
  type: string
  location: {
    lat: number
    lng: number
  }
}
