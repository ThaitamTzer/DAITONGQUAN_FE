import axiosClient from 'src/lib/axios'

const cacheService = {
  // flush all cache
  flushAll: async () => axiosClient.get('/statistics/flush-cache')
}

export default cacheService
