import fetch from '@/utils/fetch'
export function fetchList(query) {
  return fetch({
    url: '/user/listByPage',
    method: 'get',
    params: query
  })
}

export function AddUser(data) {
  return fetch({
    url: '/user/add',
    method: 'post',
    data
  })
}
export function UpdataUser(data) {
  return fetch({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function DeleteUser(data) {
  return fetch({
    url: '/user/delete',
    method: 'post',
    data
  })
}

