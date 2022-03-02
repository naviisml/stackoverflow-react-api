import { useParams } from "react-router-dom";

import Container from '/src/components/Container'

export default function App() {
	let { id, slug } = useParams()

	return (
		<Container>
			{ id }
			{ slug }
		</Container>
	)
}
 