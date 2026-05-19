import { User } from '@/types/index'
import { api } from '@/services/api'

export async function createUser(data: User) {
  return api('/user', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}