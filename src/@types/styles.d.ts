import 'styled-components'
import { ThemeType } from '../styles/themes/types'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
