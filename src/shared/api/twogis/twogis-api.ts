import { RequestResult, useApi } from "@/composables/useApi"
import { ITwogisSearchedRubricsResult } from "@/shared/api/twogis/dto/search-rubrics.response"
import axios from 'axios'
import type { ITwogisPlacementSearchResponse } from '@/shared/api/twogis/dto/twogis-placement-search.response'

export interface City {
  name: string
  value: string
  vp1: string
  vp2: string
  center: { lon: number; lat: number }
}

export const TWOGIS_CITIES: City[] = [
  {
    name: 'Алматы',
    value: 'almaty',
    vp1: '76.62496499998943,43.35442588706985',
    vp2: '77.16329500001059,43.13113611293015',
    center: { lon: 76.8898772983812, lat: 43.2380498785359 },
  },
  {
    name: 'Астана',
    value: 'astana',
    vp1: '70.90478096090143,51.32213498127955',
    vp2: '71.98144103909857,50.93696101872045',
    center: { lon: 71.4272, lat: 51.1694 },
  },
  {
    name: 'Актобе',
    value: 'aktobe',
    vp1: '56.61578096090143,50.496242220105',
    vp2: '57.69244103909857,50.10420177989499',
    center: { lon: 57.167, lat: 50.2839 },
  },
  {
    name: 'Актау',
    value: 'aqtau',
    vp1: '51.11145488384938,43.73547477478483',
    vp2: '51.384436748702676,43.61995778839738',
    center: { lon: 51.1975, lat: 43.6588 },
  },
  {
    name: 'Атырау',
    value: 'atyrau',
    vp1: '51.444250506697514,47.33752311692409',
    vp2: '52.383581493302486,46.919998883075905',
    center: { lon: 51.902798, lat: 47.116485 },
  },
  {
    name: 'Караганда',
    value: 'karaganda',
    vp1: '72.54495296090143,50.01364820541876',
    vp2: '73.62161303909856,49.61763379458124',
    center: { lon: 73.0945, lat: 49.8028 },
  },
  {
    name: 'Кызылорда',
    value: 'kyzylorda',
    vp1: '65.03290350673272,45.04252406468154',
    vp2: '65.97223449326727,44.60728993531847',
    center: { lon: 65.5233, lat: 44.8488 },
  },
  {
    name: 'Павлодар',
    value: 'pavlodar',
    vp1: '76.40287796090144,52.4733116723913',
    vp2: '77.47953803909857,52.097844327608705',
    center: { lon: 76.9516, lat: 52.2877 },
  },
  {
    name: 'Петропавловск',
    value: 'petropavlovsk',
    vp1: '68.0634126045301,55.01176654882714',
    vp2: '70.18957688786315,54.20487333754983',
    center: { lon: 69.142608, lat: 54.870308 },
  },
  {
    name: 'Семей',
    value: 'semey',
    vp1: '79.7796265067334,50.600629557428846',
    vp2: '80.7189574932666,50.20945244257115',
    center: { lon: 80.2512, lat: 50.4114 },
  },
  {
    name: 'Тараз',
    value: 'taraz',
    vp1: '71.37976936583952,42.916608363296675',
    vp2: '71.43639044014178,42.88617946676493',
    center: { lon: 71.3667, lat: 42.9 },
  },
  {
    name: 'Усть-Каменогорск',
    value: 'ustkam',
    vp1: '82.15836150673296,50.14568100233532',
    vp2: '83.09769249326705,49.750750997664696',
    center: { lon: 82.62274, lat: 49.945296 },
  },
  {
    name: 'Шымкент',
    value: 'shymkent',
    vp1: '69.04870596090117,42.54230523817817',
    vp2: '70.12536603909882,42.08858676182183',
    center: { lon: 69.590363, lat: 42.310109 },
  },
  {
    name: 'Туркестан',
    value: 'turkestan',
    vp1: '68.21675912308999,43.32566645042533',
    vp2: '68.36820451799719,43.26216987358288',
    center: { lon: 68.2581, lat: 43.2926 },
  },
  {
    name: 'Костанай',
    value: 'kostanay',
    vp1: '63.093534961382986,53.40069259909468',
    vp2: '64.17019503861701,53.02859540090532',
    center: { lon: 63.61, lat: 53.2198 },
  },
  {
    name: 'Кокшетау',
    value: 'kokshetau',
    vp1: '71.8446047341811,52.36692992539729',
    vp2: '71.93536975577268,52.33499587312909',
    center: { lon: 69.3967, lat: 53.2947 },
  },
  {
    name: 'Степногорск',
    value: 'stepnogorsk',
    vp1: '71.8446047341811,52.36692992539729',
    vp2: '71.93536975577268,52.33499587312909',
    center: { lon: 71.888244, lat: 52.350655 },
  },
  {
    name: 'Конаев',
    value: 'konaev',
    vp1: '76.62496499998943,43.35442588706985',
    vp2: '77.16329500001059,43.13113611293015',
    center: { lon: 77.062535, lat: 43.857106 },
  },
  {
    name: 'Каскелен',
    value: 'kaskelen',
    vp1: '76.62496499998943,43.35442588706985',
    vp2: '77.16329500001059,43.13113611293015',
    center: { lon: 76.6318, lat: 43.2008 },
  },
  {
    name: 'Уральск',
    value: 'uralsk',
    vp1: '50.83218496138274,51.39861206164008',
    vp2: '51.90884503861726,51.009305938359915',
    center: { lon: 51.37326, lat: 51.210624 },
  },
  {
    name: 'Жезказган',
    value: 'zhezkazgan',
    vp1: '67.69785887097028,47.79247869587146',
    vp2: '67.72449964413077,47.78217482360916',
    center: { lon: 67.707, lat: 47.7874 },
  },
]

TWOGIS_CITIES.sort((a, b) => {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB)
    return -1
  if (nameA > nameB)
    return 1

  return 0
})

// Replaced lodash.keyby with a manual reduce operation
const citiesByValue: Record<string, City> = TWOGIS_CITIES.reduce((acc, city) => {
  acc[city.value] = city

  return acc
}, {} as Record<string, City>)

export const TwogisApi = {
  getSearchList: async (
    q: string,
    city: string,
  ): Promise<{
    requestStatus: boolean
    data: { result: { items: ITwogisPlacementSearchResponse[] } }
  }> => {
    const cityData = citiesByValue[city]
    if (!cityData) {
      console.error(`City data not found for value: ${city}`)

      return {
        requestStatus: false,
        data: { result: { items: [] } },
      }
    }

    const viewpoint1 = cityData.vp1
    const viewpoint2 = cityData.vp2

    // Replace with your actual 2GIS API key if 'rurbbn3446' is a placeholder
    const key = 'rurbbn3446'

    try {
      const response = await axios.get('https://catalog.api.2gis.ru/3.0/suggests', {
        params: {
          q,
          viewpoint1,
          viewpoint2,
          key,
          fields: 'items.point,items.adm_div',
          type: 'building,adm_div.place,branch',
          page_size: 50,
        },
      })

      // Assuming the response structure is similar to the Yandex one,
      // and we need to map it to ITwogisPlacementSearchResponse
      const items: ITwogisPlacementSearchResponse[] = response.data.result.items.map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          address_name: item.address_name,
          type: item.type,
          point: item.point,
          adm_div: item.adm_div,

          // Add other fields from ITwogisPlacementSearchResponse as needed
        }),
      )

      return {
        requestStatus: true,
        data: {
          result: {
            items,
          },
        },
      }
    }
    catch (error) {
      console.error('Error fetching 2GIS search list:', error)

      return {
        requestStatus: false,
        data: { result: { items: [] } },
      }
    }
  },

  getGeoByPoints: async (payload: {
    lng: number
    lat: number
    zoom: number
  }): Promise<{
    requestStatus: boolean
    data: { result: { items: ITwogisPlacementSearchResponse[] } }
  }> => {
    // Replace with your actual 2GIS API key if 'ruregt3044' is a placeholder
    const key = 'ruregt3044'

    try {
      const response = await axios.get('https://catalog.api.2gis.ru/2.0/geo/search', {
        params: {
          key,
          point: `${payload.lng},${payload.lat}`,
          type: 'building,adm_div.place,poi',
          zoom_level: payload.zoom,
        },
      })

      const items: ITwogisPlacementSearchResponse[] = response.data.result.items.map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          address_name: item.address_name,
          type: item.type,
          point: item.point,
          adm_div: item.adm_div,

          // Add other fields from ITwogisPlacementSearchResponse as needed
        }),
      )

      return {
        requestStatus: true,
        data: {
          result: {
            items,
          },
        },
      }
    }
    catch (error) {
      console.error('Error fetching 2GIS geo by points:', error)

      return {
        requestStatus: false,
        data: { result: { items: [] } },
      }
    }
  },

  getOrganizationExternalInfoById: async (
    organizationId: number | string,
  ): Promise<{
    requestStatus: boolean
    data: { result: { items: ITwogisPlacementSearchResponse[] } }
  }> => {
    // This function was not in your original snippet, but if you have an API for it,
    // you would implement it here. For demonstration, I'll return an empty array.
    // Replace with your actual 2GIS API key
    const key = 'ruregt3044'

    try {
      const response = await axios.get(`https://catalog.api.2gis.ru/2.0/firms/${organizationId}`, {
        params: {
          key,
          fields: 'items.point,items.adm_div,items.address_name,items.name,items.type',
        },
      })

      const items: ITwogisPlacementSearchResponse[] = response.data.result.items.map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          address_name: item.address_name,
          type: item.type,
          point: item.point,
          adm_div: item.adm_div,
        }),
      )

      return {
        requestStatus: true,
        data: {
          result: {
            items,
          },
        },
      }
    }
    catch (error) {
      console.error(`Error fetching 2GIS organization info by ID ${organizationId}:`, error)

      return {
        requestStatus: false,
        data: { result: { items: [] } },
      }
    }
  },

  searchRubricsFromTwogis: async (query: {organizationId: string, text: string}): Promise<RequestResult<ITwogisSearchedRubricsResult>> => {
    return useApi.get('external/twogis/rubrics-search', query)
  }
}
