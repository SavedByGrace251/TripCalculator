import React, { Component } from 'react';
import { Layout } from './components/Layout';
import { TripCalculator } from './components/TripCalculator';

export default class App extends Component {
	displayName = App.name

	render() {
		return (
			<Layout>
				<TripCalculator />
			</Layout>
		);
	}
}
