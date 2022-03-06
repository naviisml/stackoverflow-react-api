import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
	background: rgb(220, 220, 220);
	background: linear-gradient(-45deg, hsla(0, 0%, 0%, .25), transparent);
	background-size: 100%;
	min-height: 100vh;
}
`

export default GlobalStyle
