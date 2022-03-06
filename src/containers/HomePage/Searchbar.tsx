import React from 'react'
import axios from 'axios'

export default class Searchbar extends React.Component {
	state = {
		suggestions: [],
		tags: [],
		value: ''
	}

	/**
	 * Handle the form onChange data
	 */
	handleChange = (event) => {
		let tags = event.target.value.replace(/ /g,'').split(',')
		let lastTag = tags[tags.length - 1]
		
		if (this.state.timeout)
			clearTimeout(this.state.timeout)
		
		this.state.timeout = setTimeout(() => {
			// Make sure the search contains atleast 2 characters
			if ([...lastTag].length >= 3) {
				// Retrieve the tags from the API
				axios.get(`https://api.stackexchange.com/2.3/tags?pagesize=5&order=desc&sort=popular&inname=${lastTag}&site=stackoverflow`).then(res => {
					const { data } = res
					
					this.setState({ suggestions: data.items })
				}).catch((error) => {
					let { data } = error.response

					this.setState({ suggestions: [] })

					alert(`Error: ${data.error_message}`)
				})
			} else {
				this.setState({ suggestions: [] })
			}
		}, 500)

		this.setState({value: event.target.value})
	}

	/**
	 * Handle the form submit event
	 */
	handleSubmit = (event) => {
		let tag = this.state.suggestions.find((tag) => { return tag.name = this.state.value })
		let existingTag = this.state.tags.find((tag) => { return tag = this.state.value })
		
		event.preventDefault()
		
		if (tag && !existingTag) {
			this.setState({
				tags: [...this.state.tags, this.state.value],
				value: '',
				suggestions: [],
			})

			this.props.onSearchAction(this.state.tags)
		}
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.value} onChange={this.handleChange} />

					<input type="submit" value="Submit" />
				</form>

				Suggestions
				{this.state.suggestions.map((suggestion, key) =>
					<li key={key}>{suggestion.name}</li>
				)}

				Tags
				{this.state.tags.map((tag, key) =>
					<li key={key}>{tag}</li>
				)}
			</div>
		)
	}
}
