import axios from 'axios'
import { Platform } from 'react-native'

const LOCAL_API_URL = Platform.select({
	android: `${process.env.EXPO_PUBLIC_API_URL}/api`,
	ios: `${process.env.EXPO_PUBLIC_API_URL}/api`,
	default: `${process.env.EXPO_PUBLIC_SERVER_URL}/api`,
})
const api = axios.create({ baseURL: LOCAL_API_URL })

export default api
