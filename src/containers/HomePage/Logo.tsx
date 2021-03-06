import React from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div`
	width: 350px;
	max-width: 100%;
	margin: 50px auto;
`

const Image = styled.img`
	width: 100%;
`

export default class Item extends React.Component<any, any> {
	/**
	 * Render the template
	 */
	render() {
		return (
			<ImageContainer>
				<Image src="/imaging/logo.png" />
			</ImageContainer>
		)
	}
}