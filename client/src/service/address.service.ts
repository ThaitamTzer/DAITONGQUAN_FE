import axios from 'axios'

const AddressBaseURL = process.env.NEXT_PUBLIC_VNAPPMOB_URL

const addressService = {
  getProvince: async () => {
    try {
      const response = await axios.get(`${AddressBaseURL}/api/province`)

      return response.data.results
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh:', error)
      throw error // Ném lỗi để useSWR có thể xử lý
    }
  },

  getDistrict: async (provinceID: number) => {
    try {
      const response = await axios.get(`${AddressBaseURL}/api/province/district/${provinceID}`)

      return response.data.results
    } catch (error) {
      console.error('Lỗi khi lấy danh sách huyện:', error)
      throw error
    }
  },

  getWard: async (districtId: number) => {
    try {
      const response = await axios.get(`${AddressBaseURL}/api/province/ward/${districtId}`)

      return response.data.results
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xã:', error)
      throw error
    }
  }
}

export default addressService
