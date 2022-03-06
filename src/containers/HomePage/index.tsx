import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Container from '../../components/Container'
import Searchbar from './Searchbar'
import Item from './Item'

const SearchContainer = styled.div`
	min-height: 100vh;
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const Button = styled.button`
`;

export default class HomePage extends React.Component<any, any> {
	state = {
		busy: false,
		page: 1,
		tags: [],
		items: [],
		quota_remaining: 0,
	}

	/**
	 * Retrieve the stackexchange data
	 */
	get = async (tags, page) => {
		this.setState({ busy: true })

		// check if there are tags to search for
		if (tags.length == 0) {
			console.warn('No tags to search for')
			this.setState({ items: [] })

			return false
		}

		// attempt to search for the tags
		await axios.get(`https://api.stackexchange.com/2.3/questions/unanswered?page=${page}&pagesize=25&order=desc&sort=activity&site=stackoverflow&tagged=${tags.join(';')}`).then(res => {
			const { data } = res

			this.setState({ 
				quota_remaining: data.quota_remaining,
				items: [...this.state.items, ...data.items],
				busy: false
			})
		}).catch((error) => {
			let { data } = error.response

			alert(`Error: ${data.error_message}`)
			this.setState({ busy: false })
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
	 * Handle the search action
	 */
	handleClearSearch = (tags) => {
		this.setState({ items: [], page: 1, tags })
		
		this.get(tags, 1)
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<Container>
				<SearchContainer>
					<h2 className="text-center py-5">StackOverflow <small>search</small></h2>

					<Searchbar onSearchAction={this.handleClearSearch} />
					
					{(this.state.items.length > 0) &&
						<div>
							{this.state.items.map((entry, key) =>
								<Item key={key} data={entry} />
							)}

							{(this.state.quota_remaining > 0) &&
								<div className="d-flex justify-content-center py-3">
									<Button className={this.state.busy ? "btn btn-soft btn-active btn-loading" : "btn btn-soft"} onClick={this.next}>Load more</Button>
								</div>
							}
						</div>
					}
				</SearchContainer>
			</Container>
		)
	}
}