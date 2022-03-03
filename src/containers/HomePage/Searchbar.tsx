import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Input = styled.div`
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, .06), 0 3px 6px rgba(0, 0, 0, .13);
	background-color: #FFFFFF;
	display: flex;

	ul {
		display: inline-block;
		list-style: none;
		margin: 0;
		padding: 0;

		li {
			display: inline-block;
		}
	}
`

const Search = styled.div`
	position: relative;
	display: flex;
	flex: 1;

	input {
		border: none;
		flex: 1;
		margin: 5px;
	}
`

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	background-color: #FFFFFF;
	border: 1px solid #DCDCDC;
	border-radius: 5px;
	z-index: 1;
`

const DropdownItem = styled.div`
	display: block;
	padding: 12px;
	min-width: 150px;
	cursor: pointer;

	&:hover {
		background-color: #F7F7F7;
	}
`

const Close = styled.span`
	cursor: pointer;
	margin-left: 10px;
`

export default class Searchbar extends React.Component<any, any> {
	state = {
		suggestions: [],
		tags: [],
		value: '',
		timeout: null,
	}

	props = {
		onSearchAction: null,
	}

	/**
	 * Handle the form onChange data
	 */
	handleChange = (event) => {
		let tags = event.target.value.replace(/ /g,'').split(',')
		let lastTag = tags[tags.length - 1]
		
		// Clear the timeout if it exists
		if (this.state.timeout)
			clearTimeout(this.state.timeout)
		
		// Make a timeout to check if we change the input ('Client throttle')
		this.state.timeout = setTimeout(() => {
			// Make sure the search contains atleast 2 characters
			if ([...lastTag].length >= 2) {
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
		}, 1000)
		
		// update the form data
		this.setState({value: event.target.value})
	}

	/**
	 * Handle the form submit event
	 */
	handleSubmit = (event) => {
		event.preventDefault()
	
		// add a tag
		this.addTag(this.state.value)
	}

	/**
	 * Add a tag
	 */
	addTag = (tagName) => {
		let searchTag = this.state.suggestions.find((tag) => { return tag.name = tagName })

		if (searchTag && !this.state.tags[tagName]) {
			let tags = [...this.state.tags, tagName]

			this.setState({
				tags: tags,
				value: '',
				suggestions: [],
			})
			
			// execute the search callback
			this.props.onSearchAction(tags)
		}
	}

	/**
	 * Remove a tag by the name
	 */
	removeTag = (tagName) => {
		let tags = this.state.tags.filter(function(tag) { 
			return tag !== tagName
		})

		this.setState({ tags })
		
		// execute the search callback
		this.props.onSearchAction(tags)
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<Input>
				<ul>
					{this.state.tags.map((tag, key) =>
						<li className="badge mr-2" key={key}>
							{tag}

							<Close onClick={() => this.removeTag(tag)}>
								✖
							</Close>
						</li>
					)}
				</ul>

				<Search>
					<form onSubmit={this.handleSubmit}>
						<input type="text" placeholder="Search for a tag..." value={this.state.value} onChange={this.handleChange} />
					</form>

					<Dropdown>
						{this.state.suggestions.map((suggestion, key) =>
							<DropdownItem key={key} onClick={() => this.addTag(suggestion.name)}>
								{suggestion.name}
							</DropdownItem>
						)}
					</Dropdown>
				</Search>
			</Input>
		)
	}
}
