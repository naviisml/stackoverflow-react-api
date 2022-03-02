import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { IntlProvider } from 'react-intl'

// import the App container
import App from './containers/App/App'

// import utilities
import './utils'

// define the root element
const rootElement = document.querySelector(".wrapper")

// render the application
render(
	<IntlProvider locale="en">
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</IntlProvider>,
	rootElement
)