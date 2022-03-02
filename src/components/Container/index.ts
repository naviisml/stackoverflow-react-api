import styled from 'styled-components'

const Container = styled.div`
	position: relative;
	box-sizing: border-box;
	width: 1040px;
	max-width: 80%;
	display: block;
	margin: 0 auto;

	.row,
	.form-row
	{
		width: calc(100% + #{$column-gap});
	}
`

export default Container
