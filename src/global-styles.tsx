import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
	background: rgb(220, 220, 220);
	background: linear-gradient(-45deg, rgba(220, 220, 220,1), rgba(255, 255, 255,1));
	animation: gradient 15s ease infinite;
	min-height: 100vh;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
`

export default GlobalStyle
