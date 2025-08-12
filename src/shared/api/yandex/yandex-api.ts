import axios from 'axios';
import type { IYandexPlacementSearchResponse } from '@/shared/api/yandex/dto/yandex-placement-search.response';

export interface YandexCity {
  name: string
  value: string
  ll: string
  ull: string
  center: { lon: number; lat: number }
}

export const YANDEX_CITIES: YandexCity[] = [
  {
    name: 'Алматы',
    value: 'almaty',
    ll: '76.62496499998943,43.35442588706985',
    ull: '77.16329500001059,43.13113611293015',
    center: { lon: 76.8898772983812, lat: 43.2380498785359 },
  },
  {
    name: 'Астана',
    value: 'astana',
    ll: '70.90478096090143,51.32213498127955',
    ull: '71.98144103909857,50.93696101872045',
    center: { lon: 71.4272, lat: 51.1694 },
  },
  {
    name: 'Актобе',
    value: 'aktobe',
    ll: '56.61578096090143,50.496242220105',
    ull: '57.69244103909857,50.10420177989499',
    center: { lon: 57.167, lat: 50.2839 },
  },
  {
    name: 'Актау',
    value: 'aqtau',
    ll: '51.11145488384938,43.73547477478483',
    ull: '51.384436748702676,43.61995778839738',
    center: { lon: 51.1975, lat: 43.6588 },
  },
  {
    name: 'Атырау',
    value: 'atyrau',
    ll: '51.444250506697514,47.33752311692409',
    ull: '52.383581493302486,46.919998883075905',
    center: { lon: 51.902798, lat: 47.116485 },
  },
  {
    name: 'Караганда',
    value: 'karaganda',
    ll: '72.54495296090143,50.01364820541876',
    ull: '73.62161303909856,49.61763379458124',
    center: { lon: 73.0945, lat: 49.8028 },
  },
  {
    name: 'Кызылорда',
    value: 'kyzylorda',
    ll: '65.03290350673272,45.04252406468154',
    ull: '65.97223449326727,44.60728993531847',
    center: { lon: 65.5233, lat: 44.8488 },
  },
  {
    name: 'Павлодар',
    value: 'pavlodar',
    ll: '76.40287796090144,52.4733116723913',
    ull: '77.47953803909857,52.097844327608705',
    center: { lon: 76.9516, lat: 52.2877 },
  },
  {
    name: 'Петропавловск',
    value: 'petropavlovsk',
    ll: '68.0634126045301,55.01176654882714',
    ull: '70.18957688786315,54.20487333754983',
    center: { lon: 69.142608, lat: 54.870308 },
  },
  {
    name: 'Семей',
    value: 'semey',
    ll: '79.7796265067334,50.600629557428846',
    ull: '80.7189574932666,50.20945244257115',
    center: { lon: 80.2512, lat: 50.4114 },
  },
  {
    name: 'Тараз',
    value: 'taraz',
    ll: '71.37976936583952,42.916608363296675',
    ull: '71.43639044014178,42.88617946676493',
    center: { lon: 71.3667, lat: 42.9 },
  },
  {
    name: 'Усть-Каменогорск',
    value: 'ustkam',
    ll: '82.15836150673296,50.14568100233532',
    ull: '83.09769249326705,49.750750997664696',
    center: { lon: 82.62274, lat: 49.945296 },
  },
  {
    name: 'Шымкент',
    value: 'shymkent',
    ll: '69.04870596090117,42.54230523817817',
    ull: '70.12536603909882,42.08858676182183',
    center: { lon: 69.590363, lat: 42.310109 },
  },
  {
    name: 'Туркестан',
    value: 'turkestan',
    ll: '68.21675912308999,43.32566645042533',
    ull: '68.36820451799719,43.26216987358288',
    center: { lon: 68.2581, lat: 43.2926 },
  },
  {
    name: 'Костанай',
    value: 'kostanay',
    ll: '63.093534961382986,53.40069259909468',
    ull: '64.17019503861701,53.02859540090532',
    center: { lon: 63.61, lat: 53.2198 },
  },
  {
    name: 'Кокшетау',
    value: 'kokshetau',
    ll: '71.8446047341811,52.36692992539729',
    ull: '71.93536975577268,52.33499587312909',
    center: { lon: 69.3967, lat: 53.2947 },
  },
  {
    name: 'Степногорск',
    value: 'stepnogorsk',
    ll: '71.8446047341811,52.36692992539729',
    ull: '71.93536975577268,52.33499587312909',
    center: { lon: 71.888244, lat: 52.350655 },
  },
  {
    name: 'Конаев',
    value: 'konaev',
    ll: '76.62496499998943,43.35442588706985',
    ull: '77.16329500001059,43.13113611293015',
    center: { lon: 77.062535, lat: 43.857106 },
  },
  {
    name: 'Каскелен',
    value: 'kaskelen',
    ll: '76.62496499998943,43.35442588706985',
    ull: '77.16329500001059,43.13113611293015',
    center: { lon: 76.6318, lat: 43.2008 },
  },
  {
    name: 'Уральск',
    value: 'uralsk',
    ll: '50.83218496138274,51.39861206164008',
    ull: '51.90884503861726,51.009305938359915',
    center: { lon: 51.37326, lat: 51.210624 },
  },
  {
    name: 'Жезказган',
    value: 'zhezkazgan',
    ll: '67.69785887097028,47.79247869587146',
    ull: '67.72449964413077,47.78217482360916',
    center: { lon: 67.707, lat: 47.7874 },
  },
];

// Replaced lodash.keyby with a manual reduce operation
const citiesByValue: Record<string, YandexCity> = YANDEX_CITIES.reduce((acc, city) => {
  acc[city.value] = city;
  return acc;
}, {} as Record<string, YandexCity>);

export const YandexApi = {
  getSearchList: async (
    q: string,
    city: string,
  ): Promise<{
    requestStatus: boolean;
    data: { result: { items: IYandexPlacementSearchResponse[] } };
  }> => {
    // Ensure the city exists in our lookup, otherwise handle the error or default
    const cityData = citiesByValue[city];
    if (!cityData) {
      console.error(`City data not found for value: ${city}`);
      return {
        requestStatus: false,
        data: { result: { items: [] } },
      };
    }

    const ll = cityData.ll;
    const ull = cityData.ull;

    const params = new URLSearchParams({
      part: q,
      ll,
      ull,
      v: '9',
      add_chains_loc: '1',
      add_rubrics_loc: '1',
      fullpath: '1',
      origin: 'maps-search-form',
      outformat: 'json',
      lang: 'ru-KZ',
    }).toString();

    try {
      const response = await axios.get(
        `https://suggest-maps.yandex.com/suggest-geo?${params}`,
        {
          headers: {
            Origin: 'https://yandex.com',
            Referer: 'https://yandex.com/',
          },
        },
      );

      const items: IYandexPlacementSearchResponse[] = response.data.results.map(
        (item: any) => ({
          id: item.log_id?.what?.id || item.log_id?.where?.source_id, // Added safe navigation for log_id.where
          address_name: item.subtitle.text,
          name: item.title.text,
          type: item.type,
          distance: item?.distance?.text || '', // Ensure distance is always a string
          search_attributes: {
            type: item.type,
          },
        }),
      );

      return {
        requestStatus: true,
        data: {
          result: {
            items,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching Yandex search list:', error);
      return {
        requestStatus: false,
        data: { result: { items: [] } },
      };
    }
  },
};
