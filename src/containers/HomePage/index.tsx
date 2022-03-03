import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Card from '/src/components/Card'
import Container from '/src/components/Container'
import Searchbar from './Searchbar'

const Paragraph = styled.p`
	/* ... */
`;

const Button = styled.button`
	/* ... */
`;

export default class Counter extends React.Component {
	state = {
		page: 1,
		tags: [],
		items: []
	}

	/**
	 * Retrieve the stackexchange data
	 */
	get = (tags, page) => {
		axios.get(`https://api.stackexchange.com/2.3/questions/unanswered?page=${page}&pagesize=25&order=desc&sort=activity&site=stackoverflow&tagged=${tags.join(';')}`).then(res => {
			const { data } = res
			
			this.setState({ items: [...this.state.items, ...data.items] })
		}).catch((error) => {
			let { data } = error.response

			alert(`Error: ${data.error_message}`)
		})
	}

	/**
	 * Retrieve the previous page data
	 */
	previous = () => {
		if ((this.state.page - 1) >= 1) {
			this.handleSearch(this.state.tags, this.state.page - 1)
		}
	}

	/**
	 * Retrieve the next page data
	 */
	next = () => {
		this.handleSearch(this.state.tags, this.state.page + 1)
	}

	/**
	 * Handle the search action
	 */
	handleSearch = (tags, page = 1) => {
		this.setState({ tags, page })
		
		this.get(tags, page)
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<Container>
				<Searchbar onSearchAction={this.handleSearch} />

				{this.state.items.length <= 0 ? false :
					<div>
						{this.state.items.map((entry, key) =>
							// <Item key={key} data={entry} />
							<Card key={key}>
								{entry.title}
								<ul>
									{entry.tags.map((tag, key) =>
										<li key={key}>{tag}</li>
									)}
								</ul>
							</Card>
						)}

						<Paragraph>Showing {this.state.items.length} items</Paragraph>
						<Button onClick={this.next}>Load more</Button>
					</div>
				}
			</Container>
		)
	}
}