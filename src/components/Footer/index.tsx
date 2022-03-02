import React from 'react'
import { FormattedMessage } from 'react-intl'

import A from '/src/components/A'
import Container from '/src/components/Container'
import messages from './messages'

function Footer() {
	return (
		<Container className="d-flex">
			<section>
				<FormattedMessage
					{...messages.licenseMessage}
					values={{
						title: 'Project'
					}}
					/>
			</section>
			<section className="ml-auto">
				<FormattedMessage {...messages.authorMessage} values={{author: <A href="https://github.com/naviisml" target="_blank">Navi</A>}} />
			</section>
		</Container>
	)
}

export default Footer
