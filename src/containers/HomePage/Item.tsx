import React from 'react'
import styled from 'styled-components'

import Card from '../../components/Card'

const CardContent = styled.a`
	padding: 12px;
	
	&:hover {
		text-decoration: none;
	}
`

export default class Item extends React.Component<any, any> {
	state = {
		data: {
			title: null,
			link: null,
			tags: [],
			owner: {
				display_name: null,
			},
			creation_date: null,
		}
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<Card>
				<CardContent href={this.props.data.link} target="_blank" className="d-flex flex-column">
					<strong>{this.props.data.title.length > 50 ? this.props.data.title.substr(0, 50 - 1) + "..." : this.props.data.title}</strong>

					<div className="py-2">
						{this.props.data.tags.map((tag, key) =>
							<span className="badge mr-2" key={key}>{tag}</span>
						)}
					</div>

					<div className="d-flex">
						<small className="text-muted">Created by {this.props.data.owner.display_name}</small>

						<small className="text-muted ml-auto">On {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(this.props.data.creation_date)}</small>
					</div>
				</CardContent>
			</Card>
		)
	}
}