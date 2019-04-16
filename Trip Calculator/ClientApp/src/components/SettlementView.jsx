import React, { Component } from 'react';
import { Grid, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, FormControl, InputLabel, Input, TextField, Button } from '@material-ui/core';
import CurrencyFormat from 'react-currency-format';

/*
Trip Data:
{
	"personExpenses":[{
		"name":"Louis",
			"payments":[{
				"description":"Snacks",
				"amount":5.75
			},{
				"description":"Reservation",
				"amount":35.0
			}]},{
		"name":"David",
			"payments":[{
				"description":"Gas",
				"amount":10.0
			},{
				"description":"Gas",
				"amount":20.0
			}]},{
	"total":345.59
}

*/

function Expense(props) {
	var expenseData = props.data
	return (
		<TableRow>
			<TableCell align="left">{expenseData.description}</TableCell>
			<TableCell align="right">
				<CurrencyFormat value={expenseData.amount} displayType={'text'}
					thousandSeparator={true} prefix={'$ '}
					decimalScale={2} fixedDecimalScale={true} />
			</TableCell>
		</TableRow>
	)
}

class Person extends Component {
	personData = this.props.data
	state = { payments: this.personData.payments, newExpenseDesc: "", newExpenseAmount: 0 }

	postNewExpense(newExpense) {
		console.log("Posting new expense")
		const data = new FormData();
		data.append('PersonId', newExpense.personId);
		data.append('Description', newExpense.description);
		data.append('Amount', newExpense.amount);

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/person/add', true);
		xhr.onload = () => {
			this.props.loadTrip();
		}
		xhr.send(data);
		var newPayments = this.state.payments.concat(newExpense)
		this.setState({ payments: newPayments })
	}

	handleDescChange = (event) => {
		this.setState({ newExpenseDesc: event.target.value });
	};
	_handleDescKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.postNewExpense({ personId: this.personData.id, description: this.state.newExpenseDesc, amount: Number(this.state.newExpenseAmount) })
			this.setState({ newExpenseDesc: "", newExpenseAmount: 0 })
		}
	}

	handleAmountChange = (event) => {
		this.setState({ newExpenseAmount: event.target.value });
	};
	_handleAmountKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.postNewExpense({ personId: this.personData.id, description: this.state.newExpenseDesc, amount: Number(this.state.newExpenseAmount) })
			this.setState({ newExpenseDesc: "", newExpenseAmount: 0 })
		}
	}

	render() {
		return (
			<Paper style={{ margin: 8 }}>
				<Typography style={{ padding: 8 }} variant="h5">{this.personData.name}</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="left">Description</TableCell>
							<TableCell align="right">Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.payments.map((item, idx) =>
							<Expense key={idx} data={item} />
						)}
						{
							this.props.editable && <TableRow>
								<TableCell align="right">
									<TextField id="AddNewExpenseDescription" label="Description"
										value={this.state.newExpenseDesc} onChange={this.handleDescChange}
										onKeyDown={this._handleDescKeyDown} margin="dense" />
								</TableCell>
								<TableCell align="right">
									<TextField id="AddNewExpenseAmount" label="Amount"
										value={this.state.newExpenseAmount} onChange={this.handleAmountChange}
										onKeyDown={this._handleAmountKeyDown}
										type="number" margin="dense" />
								</TableCell>
							</TableRow>
						}
						<TableRow>
							<TableCell align="right"><span style={{ fontWeight: 'bold' }}>Total</span></TableCell>
							<TableCell align="right">
								<CurrencyFormat value={this.personData.total} displayType={'text'}
									thousandSeparator={true} prefix={'$ '}
									decimalScale={2} fixedDecimalScale={true} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>
		)
	}
}

function PersonView(props) {
	return (
		<Grid style={{ width: "100%" }} container
			direction="row"
			justify="space-around"
			alignItems="flex-start">
			{props.data.map((item, idx) =>
				<Person loadTrip={props.loadTrip} editable={props.editable} style={{ margin: 8 }} key={idx} data={item} />
			)}
		</Grid>
	);
}

function TotalView(props) {
	var total = props.data
	return (
		<Paper style={{ margin: 8, padding: 8 }}>
			<Typography variant="h5" align="right" style={{ width: "100%" }}>
				<CurrencyFormat value={total} displayType={'text'}
					thousandSeparator={true} prefix={'Trip Total: $ '}
					decimalScale={2} fixedDecimalScale={true} />
			</Typography>
		</Paper>
	)
}

export class TripView extends Component {
	render() {
		return (
			<Grid style={{ width: "100%" }} container
				direction="column"
				justify="flex-start"
				alignItems="stretch">
				<Grid item style={{ width: "100%" }}>
					<PersonView name="Expenses" editable loadTrip={this.props.loadTrip} data={this.props.data.personExpenses} />
				</Grid>
				<Grid item style={{ width: "100%" }}>
					<TotalView data={this.props.data.total} />
				</Grid>
				<Grid item style={{ width: "100%" }}>
					<PersonView name="Settlements" data={this.props.data.settlements} />
				</Grid>
			</Grid>
		);
	}
}
