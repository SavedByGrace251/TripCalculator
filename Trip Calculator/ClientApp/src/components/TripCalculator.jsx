import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { ExpenseView, SettlementView } from './PersonView';

export class TripCalculator extends Component {
	constructor() {
		super();
		this.updateTrip = this.updateTrip.bind(this);
	}

	state = { trip: {} }

	updateTrip(newTrip) {
		console.log("Updating Trip")
		console.log('this', this)
		this.setState({ trip: newTrip })
		this.forceUpdate()
	}

	componentDidMount() {
		const xhr = new XMLHttpRequest();
		xhr.open('get', '/trip', true);
		xhr.onload = () => {
			const newTrip = JSON.parse(xhr.responseText);
			this.updateTrip(newTrip);
		};
		xhr.send();
	}

	render() {
		return (
			<Grid style={{ width: "100%" }} container
				direction="row"
				justify="space-between"
				alignItems="flex-start" >
				{this.state.trip.personPayments !== undefined && <Grid xs={6} item>
					<ExpenseView updateTrip={this.updateTrip} data={this.state.trip} />
				</Grid>}
				{this.state.trip.settlements !== undefined && <Grid xs={6} item>
					<SettlementView data={this.state.trip} />
				</Grid>}
			</Grid>
		);
	}
}
