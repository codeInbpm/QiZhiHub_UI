import request from "/@/utils/request"

/**
 * 获取员工列表数据（用于下拉选择）
 * @returns Promise<员工列表数据>
 */
export function fetchEmployeeList() {
  return request({
    url: '/oa/oaEmployees/list',
    method: 'get'
  })
}