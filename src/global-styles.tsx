import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
	background: rgb(220, 220, 220);
	background-image: linear-gradient(-45deg, hsla(0, 0%, 0%, .25), transparent);
	background-position: fixed;
	background-size: 100%;
	min-height: 100vh;
}
`

export default GlobalStyle
