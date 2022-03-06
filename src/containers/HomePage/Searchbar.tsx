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
		onSearchAction: false,
		suggestionTimer: null,
		suggestions: [],
		selectedTag: -1,
		tags: [],
		value: '',
	}

	/**
	 * Handle the keyDown event
	 */
	handleKeyDown = (event) => {
		let lastTag = this.state.tags[this.state.tags.length - 1]

		// reset the timer for suggestions
		if (this.state.suggestionTimer)
			clearTimeout(this.state.suggestionTimer)
		
				
		// check if the backspace was pressed, and if the length of the input is 0
		if ((event.keyCode ?? event.charCode) == 8 && event.target.value.length == 0) {
			// check if the selectedTag was selected, and if the backspace was
			// pressed again, if true; remove the last tag from the list, and reset
			// the selected tag
			if (this.state.selectedTag >= 0 && lastTag) {
				// remove the selectedTag
				this.state.tags.splice(this.state.selectedTag, 1)

				// reset the selectedTag
				this.setSelectedTag(-1)

				// search on the new tagList
				this.props.onSearchAction(this.state.tags)
			}

			// check if the selectedTag is NOT set, and if the lastTag exists,
			// if not; set the selectedTag to the id of the last tag.
			if (this.state.selectedTag == -1 && lastTag) {
				// set the selectedTag
				this.setSelectedTag(this.state.tags.length - 1)
			}
		} else {
			// reset the selected tag
			this.setSelectedTag(-1)
		}
	}

	/**
	 * Handle the form onChange data
	 */
	handleChange = (event) => {
		let tag = event.target.value
		
		// set a timeout, so when a key gets pressed within .5
		// seconds of each-other, the timer will be reset.
		this.state.suggestionTimer = setTimeout(() => {
			// Make sure the search contains atleast 2 characters
			if ([...tag].length >= 2) {
				// Retrieve the tags from the API
				axios.get(`https://api.stackexchange.com/2.3/tags?pagesize=5&order=desc&sort=popular&inname=${tag}&site=stackoverflow`).then(res => {
					const { data } = res
					
					this.setState({ suggestions: data.items })
				}).catch((error) => {
					let { data } = error.response

					this.setState({ suggestions: [] })

					// oopsie, we have hit a api limit!
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
		event.preventDefault()
	
		// add a tag
		this.addTag(this.state.value)
	}

	/**
	 * Add a tag
	 */
	addTag = (tagName) => {
		let tags = [...this.state.tags, tagName]
		
		// validate tags on existence to save on call cost to the api
		// NOTE: I've disabled it for now as its subject is unclear, but can be enabled at any time :)
		/*let searchTag = this.state.suggestions.find((tag) => { return tag.name = tagName })

		if (searchTag && !this.state.tags[tagName])
			return false*/
		
		this.setState({
			tags: tags,
			value: '',
			suggestions: [],
		})
		
		// execute the search callback
		this.props.onSearchAction(tags)
	}

	/**
	 * Set the selected tag by index
	 */
	setSelectedTag = (index) => {
		this.setState({
			selectedTag: index
		})
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
						<li key={key} className={(key == this.state.selectedTag) ? 'badge badge-primary mr-2' : 'badge mr-2'}>
							{tag}

							<Close onClick={() => this.removeTag(tag)}>
								✖
							</Close>
						</li>
					)}
				</ul>

				<Search>
					<form onSubmit={this.handleSubmit}>
						<input type="text" placeholder="Search for a tag..." value={this.state.value} onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
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
