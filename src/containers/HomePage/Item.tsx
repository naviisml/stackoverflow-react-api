import React from 'react'
import styled from 'styled-components'

import Card from '/src/components/Card'

const CardContent = styled.div`
	padding: 12px;
`;

export default class Item extends React.Component {
	/**
	 * Render the template
	 */
	render() {
		return (
			<Card className="my-2">
				<CardContent>
					{this.props.data.title}

					<ul className="list list-block">
						{this.props.data.tags.map((tag, key) =>
							<li className="badge mr-2" key={key}>{tag}</li>
						)}
					</ul>
				</CardContent>
			</Card>
		)
	}
}