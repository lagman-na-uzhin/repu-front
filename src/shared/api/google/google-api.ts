import { useApi } from "@/composables/useApi"
import axios from 'axios'

export interface GooglePlaceSearchItem {
  id: string
  displayName: { text: string }
  formattedAddress: string
  location: {
    latitude: number
    longitude: number
  }
}

export const GoogleApi = {
  getSearchList: async (
    query: string,
  ): Promise<{
    requestStatus: boolean
    data: { result: { items: GooglePlaceSearchItem[] } }
  }> => {
    try {
      const response = await useApi.get(`external/google/places-search?text=${query}`)

      const items: GooglePlaceSearchItem[] = response.data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address_name: place.formatted_address,
        location: place.location,
      }))

      return {
        requestStatus: true,
        data: { result: { items } },
      }
    } catch (error) {
      console.error('Google Places API error:', error)

      return {
        requestStatus: false,
        data: { result: { items: [] } },
      }
    }
  },
}
