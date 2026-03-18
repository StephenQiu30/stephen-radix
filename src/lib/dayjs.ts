import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Set locale to Chinese
dayjs.locale('zh-cn')

// Extend with plugins
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default dayjs
