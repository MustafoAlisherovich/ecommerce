import { isAxiosError } from 'axios'
import Toast from 'react-native-toast-message'

export const showErrorToast = (error: unknown, title = 'Error') => {
	let message = 'Something went wrong'

	if (isAxiosError(error)) {
		message = error.response?.data?.message || error.message
	} else if (error instanceof Error) {
		message = error.message
	} else if (typeof error === 'string') {
		message = error
	}

	Toast.show({
		type: 'error',
		text1: title,
		text2: message,
	})
}
