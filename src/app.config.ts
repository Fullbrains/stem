import {stem} from './theme'
import {stemIcons, stemColors} from './config'

export default defineAppConfig({
  ui: {
    ...stem,
    colors: stemColors,
    icons: stemIcons,
  },
})
