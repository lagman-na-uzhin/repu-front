import { axiosIns } from '@/plugins/request';
import qs from 'qs';
import { ApiResponse, handleApiMessage } from './useApi';

export const sendRequest = async <T>(
method: 'get' | 'post' | 'put' | 'delete',
api: string,
payload?: any,
isFormData = false
): Promise<ApiResponse<T>> => {
try {
const response = await axiosIns[method](api, payload, {
headers: { 'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' },
paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
});

await handleApiMessage('OK', response?.data?.message);

return { success: true, data: response.data?.data, message: response.data?.message };
}
catch (error) {
console.error(error);
await handleApiMessage('ERROR', error?.response?.data?.message);

return { success: false, message: error?.response?.data?.message };
}
};
