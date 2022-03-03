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
		search: [],
		items: []
	}

	/**
	 * Retrieve the stackexchange data
	 */
	get = (search, page) => {
		axios.get(`https://api.stackexchange.com/2.3/questions/unanswered?page=${page}&pagesize=25&order=desc&sort=activity&site=stackoverflow&tagged=${search.join(';')}`).then(res => {
			const { data } = res
			
			this.setState({ items: [...this.state.items, ...data.items] })
		}).catch((res) => {
			console.log("No!", res)
		})
	}

	/**
	 * Retrieve the previous page data
	 */
	previous = () => {
		this.setState({ page: this.state.page + 1 })
		this.handleSearch(this.state.search)
	}

	/**
	 * Retrieve the next page data
	 */
	next = () => {
		if ((this.state.page - 1) >= 1) {
			this.setState({ page: this.state.page - 1 })
			this.handleSearch(this.state.search)
		}
	}

	/**
	 * Handle the search action
	 */
	handleSearch = (value) => {
		this.state.search = value

		this.get(this.state.search, this.state.page)
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
						<Paragraph>Page {this.state.page}</Paragraph>
						<Button onClick={this.next}>Load more</Button>
					</div>
				}
			</Container>
		)
	}
}