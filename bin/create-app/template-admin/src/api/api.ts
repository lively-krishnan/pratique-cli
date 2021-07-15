import request from 'config/request.js'
import { HostName } from 'config/env'

export const axiosApi = (params) => {
  return request
    .post(`${HostName}/xxx`, params)
    .then((res) => res.data);
}