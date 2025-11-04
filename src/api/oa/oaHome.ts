import request from "/@/utils/request"

/**
 * 获取报表数据
 * @param query
 */
export function getReportFormData(query?: Object) {
    return request({
        url: '/oa/home/reportFormData',
        method: 'get',
        params: query
    })
}
