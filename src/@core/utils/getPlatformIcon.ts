export const getPlatformPngAddress = (platform: 'TWOGIS' | 'YANDEX' | 'GOOGLE') => {
  switch (platform) {
  case 'TWOGIS':
    return 'https://static.tildacdn.biz/tild6264-3565-4132-b465-643935663933/2_1.png'
  case 'GOOGLE':
    return 'https://static.tildacdn.biz/tild3135-3566-4333-a262-396435363963/google_map.png'
  case 'YANDEX':
    return 'https://static.tildacdn.biz/tild3537-6162-4762-b431-306432353830/ya_map.png'
  default:
    return 'mdi-information-outline'
  }
}
