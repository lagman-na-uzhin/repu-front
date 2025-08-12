export enum MODULE_CONTENT {
  ORGANIZATION_LIST = 'ORGANIZATION_LIST',
  REVIEW_LIST = 'REVIEW_LIST',
  EMPLOYEE_LIST = 'EMPLOYEE_LIST'
}

export function getTableParams(moduleName: string, filter = {}) {
  const params = {
    search: null,
    filter,
    pagination: {
      limit: 10,
      page: 1,
      perPage: 5,
    },
    sort: {
      sortBy: 'id',
      isSortDesc: true,
    },
  };

  const savedTableParams = localStorage.getItem(`${moduleName}_CONTENT_PARAMS`)

  return savedTableParams ? JSON.parse(savedTableParams) : params
}
export function saveTableParams(moduleName: string, params: unknown) {
  localStorage.setItem(`${moduleName}_CONTENT_PARAMS`, JSON.stringify(params));
}
export function getPaginationData(
  count: number,
  currentPage: number,
  perPage: number,
  totalRows: number
) {
  const firstIndex = count ? (currentPage - 1) * perPage + 1 : 0;
  let lastIndex = count + (currentPage - 1) * perPage;
  if (lastIndex > totalRows) lastIndex = totalRows;

  return `${firstIndex} по ${lastIndex} из ${totalRows} шт.`;
}
