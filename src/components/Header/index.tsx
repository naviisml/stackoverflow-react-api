import React from 'react'
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl'

import Container from '/src/components/Container'

function Footer() {
	return (
		<nav className="nav-top py-1">
			<div className="container d-flex flex-row">
				<ul className="nav-list">
					<li className="nav-item">
						<Link className="nav-link" to="/">Home</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/test">Test</Link>
					</li>
				</ul>

				<ul className="nav-list ml-auto">
					<li className="nav-item">
						<a className="nav-link" href="#">
							Sign Up
						</a>
					</li>
					<li className="nav-button">
						<button className="btn btn-primary">Login</button>
					</li>
				</ul>
			</div>
		</nav>
	)
}

export default Footer
