import request from "/@/utils/request"

/**
 * 获取员工列表数据（用于下拉选择）
 * @param query - 查询参数对象，包含关键字、分页等
 * @returns Promise<员工列表数据>
 */
export function fetchEmployeeList(query?: Object) {
  return request({
    url: '/oa/oaEmployees/list',
    method: 'get',
    params: query
  })
}
