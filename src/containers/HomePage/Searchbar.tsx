import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Input = styled.div`
padding: 12px;
border-radius: 3px;
border: 1px solid #DCDCDC;
display: flex;

ul {
	display: inline-block;
	list-style: none;
	margin: 0;
	padding: 0;

	li {
		display: inline-block;
	}
}`

const Search = styled.div`
position: relative;
display: flex;
flex: 1;

input {
	border: none;
	flex: 1;
}`

const Dropdown = styled.div`
position: absolute;
top: 100%;
background-color: #FFFFFF;
border: 1px solid #DCDCDC;
border-radius: 5px;
z-index: 1;`

const DropdownItem = styled.div`
display: block;
padding: 12px;
min-width: 150px;
cursor: pointer;

&:hover {
	background-color: #F7F7F7;
}`

export default class Searchbar extends React.Component {
	state = {
		suggestions: [],
		tags: [],
		value: ''
	}

	componentDidMount() {
		this.setState({ tags: ['php', 'html'] })
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

		// execute the search callback
		this.props.onSearchAction(this.state.tags)
	}

	/**
	 * Add a tag
	 */
	addTag = (tagName) => {
		let searchTag = this.state.suggestions.find((tag) => { return tag.name = tagName })

		if (searchTag && !this.state.tags[tagName]) {
			this.setState({
				tags: [...this.state.tags, tagName],
				value: '',
				suggestions: [],
			})
		}
	}

	/**
	 * Render the template
	 */
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>

					<Input>
						<ul>
							{this.state.tags.map((tag, key) =>
								<li className="badge badge-primary badge-outline mr-2" key={key}>{tag}</li>
							)}
						</ul>

						<Search>
							<input type="text" placeholder="Search for a tag..." value={this.state.value} onChange={this.handleChange} />

							<Dropdown>
								{this.state.suggestions.map((suggestion, key) =>
									<DropdownItem key={key} onClick={() => this.addTag(suggestion.name)}>{suggestion.name}</DropdownItem>
								)}
							</Dropdown>
						</Search>
					</Input>

					<input type="submit" value="Submit" />
				</form>
			</div>
		)
	}
}
