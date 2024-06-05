import axios from 'axios'

const AddressBaseURL = process.env.NEXT_PUBLIC_VN_URL

const addressService = {
  getProvince: async () => {
    try {
      const response = await axios.get(`${AddressBaseURL}/province`)

      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh:', error)
      throw error // Ném lỗi để useSWR có thể xử lý
    }
  },

  getDistrict: async (provinceID: number) => {
    try {
      const response = await axios.get(`${AddressBaseURL}/district/?idProvince=${provinceID}`)

      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách huyện:', error)
      throw error
    }
  },

  getWard: async (districtId: number) => {
    try {
      const response = await axios.get(`${AddressBaseURL}/commune/?idDistrict=${districtId}`)

      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xã:', error)
      throw error
    }
  }
}

export default addressService
