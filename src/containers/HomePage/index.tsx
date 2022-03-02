import React from 'react';
import styled from 'styled-components'
import axios from 'axios'

import Container from '/src/components/Container'

const Paragraph = styled.p`
	/* ... */
`;

const Button = styled.button`
	/* ... */
`;

export default class Counter extends React.Component {
	state = {
		page: 1,
		items: []
	}

	componentDidMount() {
		this.get(this.state.page)
	}

	get = (page) => {
		axios.get(`https://api.stackexchange.com/2.3/questions/unanswered?page=` + page + `&pagesize=50&order=desc&sort=activity&site=stackoverflow&tagged=php;sql`).then(res => {
			const data = res.data.items
			
			this.setState({ items: [...this.state.items, ...data] })
		}).catch((res) => {
			console.log(res)
		})
	}

	increment = () => {
		this.setState({ page: this.state.page + 1 })
		this.get(this.state.page)
	}

	decrement = () => {
		if ((this.state.page - 1) >= 1) {
			this.setState({ page: this.state.page - 1 })
			this.get(this.state.page)
		}
	}

	render() {
		return (
			<Container>
				<ul>
					{
					this.state.items
						.map(entry =>
							<li key={entry.question_id}>{entry.title}</li>
						)
					}
				</ul>
				<Paragraph>{this.state.page}</Paragraph>
				<Button onClick={this.increment}>+</Button>
				<Button onClick={this.decrement}>-</Button>
			</Container>
		)
	}
}