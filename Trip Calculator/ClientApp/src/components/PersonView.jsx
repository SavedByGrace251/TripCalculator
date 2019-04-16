import React, { Component } from 'react';
import { Grid, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, FormControl, InputLabel, Input, TextField, Button, IconButton, Fab } from '@material-ui/core';
import { Delete, Close } from '@material-ui/icons';
import CurrencyFormat from 'react-currency-format';

function loadTrip(callback) {
	const xhr = new XMLHttpRequest();
	xhr.open('get', '/trip', true);
	xhr.onload = () => {
		const newTrip = JSON.parse(xhr.responseText);
		callback(newTrip);
	};
	xhr.send();
}


function isNotEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return true;
	}
	return false;
}


class Expense extends Component {
	deleteExpense() {
		const xhr = new XMLHttpRequest();
		const data = new FormData();
		data.append('PersonId', this.props.data.personId);
		data.append('Id', this.props.data.id);
		xhr.open('delete', '/expense/remove', true);
		xhr.onload = () => {
			loadTrip(this.props.updateTrip);
		}
		xhr.send(data);
	}

	render() {
		return (
			<TableRow>
				<TableCell align="left">{this.props.data.description}</TableCell>
				<TableCell align="right">
					<CurrencyFormat value={this.props.data.amount} displayType={'text'}
						thousandSeparator={true} prefix={'$ '}
						decimalScale={2} fixedDecimalScale={true} />
				</TableCell>
				{this.props.editable && <TableCell align="right">
					<IconButton aria-label="Delete" onClick={() => { this.deleteExpense(this.props.data.personId, this.props.data.Id) }}>
						<Delete />
					</IconButton>
				</TableCell>}
			</TableRow>
		)
	}
}

class Person extends Component {
	state = { newExpenseDesc: "", newExpenseAmount: 0 }

	componentWillReceiveProps(nextProps) {
		this.setState({ data: nextProps.data });
	}

	removePerson() {
		var remove = window.confirm("Delete " + this.props.data.name + "?")
		if (remove) {
			this.deletePerson()
		}
	}

	deletePerson() {
		const xhr = new XMLHttpRequest();
		const data = new FormData();
		data.append('Id', this.props.data.id);
		xhr.open('delete', '/person/remove', true);
		xhr.onload = () => {
			loadTrip(this.props.updateTrip);
		}
		xhr.send(data);
	}

	postNewExpense(newExpense) {
		var newId = this.props.data.payments.length;
		console.log("Posting new expense")
		const data = new FormData();
		data.append('Id', newId);
		data.append('PersonId', newExpense.personId);
		data.append('Description', newExpense.description);
		data.append('Amount', newExpense.amount);

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/expense/add', true);
		xhr.onload = () => {
			loadTrip(this.props.updateTrip);
		}
		xhr.send(data);
	}

	handleDescChange = (event) => {
		this.setState({ newExpenseDesc: event.target.value });
	};
	_handleDescKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.postNewExpense({ personId: this.props.data.id, description: this.state.newExpenseDesc, amount: Number(this.state.newExpenseAmount) })
			this.setState({ newExpenseDesc: "", newExpenseAmount: 0 })
		}
	}

	handleAmountChange = (event) => {
		this.setState({ newExpenseAmount: event.target.value });
	};
	_handleAmountKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.postNewExpense({ personId: this.props.data.id, description: this.state.newExpenseDesc, amount: Number(this.state.newExpenseAmount) })
			this.setState({ newExpenseDesc: "", newExpenseAmount: 0 })
		}
	}

	render() {
		return (
			<Paper style={{ margin: 8 }}>
				<Grid style={{ padding: 8 }} container direction="row" justify="space-between" alignItems="center">
					<Grid item>
						<Typography variant="h5">
							{this.props.data.name}
						</Typography>
					</Grid>
					{this.props.editable && <Grid item>
						<IconButton onClick={() => { this.removePerson() }}> <Close /> </IconButton>
					</Grid>}
				</Grid>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="left">Description</TableCell>
							<TableCell align="right">Amount</TableCell>
							{this.props.editable && <TableCell align="right">Remove</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.data.payments.map((item, idx) =>
							<Expense editable={this.props.editable} updateTrip={this.props.updateTrip} key={idx} data={item} />
						)}
						{
							this.props.editable && <TableRow>
								<TableCell align="left">
									<TextField id="AddNewExpenseDescription" label="Description"
										value={this.state.newExpenseDesc} onChange={this.handleDescChange}
										onKeyDown={this._handleDescKeyDown} margin="dense" />
								</TableCell>
								<TableCell align="left">
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
								<CurrencyFormat value={this.props.data.total} displayType={'text'}
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
	console.log('props', props)
	return (
		<Grid container
			direction="column"
			justify="flex-start"
			alignItems="flex-start" >
			{props.data.map((item, idx) =>
				<Person updateTrip={props.updateTrip} editable={props.editable} style={{ margin: 8 }} key={idx} data={item} />
			)}
		</Grid>
	);
}

function TotalView(props) {
	var total = props.data
	return (
		<Typography variant="h5" align="right">
			<CurrencyFormat value={total} displayType={'text'}
				thousandSeparator={true} prefix={'Trip Total: $ '}
				decimalScale={2} fixedDecimalScale={true} />
		</Typography>
	)
}

export class SettlementView extends Component {
	render() {
		return (
			<Grid container
				direction="column"
				justify="flex-start"
				alignItems="center">
				<Paper style={{ width: "100%", margin: 8, padding: 8 }}>
					<Typography variant="h3" style={{ padding: 8 }}>
						Settlements
					</Typography>
					<Grid item>
						<PersonView name="Settlements" data={this.props.data.settlements} />
					</Grid>
				</Paper>
			</Grid>
		);
	}
}

export class ExpenseView extends Component {
	state = { newPerson: "" }

	PostNewPerson() {
		var newId = this.props.data.personPayments.length;
		var newPerson = { id: newId, name: this.state.newPerson, payments: {}, total: 0 }
		this.setState({ newPerson: "" })

		const data = new FormData();
		data.append('Id', newId)
		data.append('Name', newPerson.name);

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/person/add', true);
		xhr.onload = () => {
			loadTrip(this.props.updateTrip);
		}
		xhr.send(data);
	}

	handleChange = (event) => {
		this.setState({ newPerson: event.target.value });
	};
	_handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.PostNewPerson()
		}
	}

	render() {
		return (
			<Grid container
				direction="column"
				justify="flex-start"
				alignItems="stretch">
				<Paper style={{ margin: 8, padding: 8 }}>
					<Grid style={{ padding: 8 }} item container direction="row" justify="space-between" alignItems="center">
						<Typography variant="h3">
							Payments
						</Typography>
						<TotalView data={this.props.data.total} />
					</Grid>
					<Grid item style={{ padding: 8 }}>
						<Grid container spacing={8} alignItems="flex-end" >
							<Grid item>
								<Typography variant="h6">
									Add Person
							</Typography>
							</Grid>
							<Grid item>
								<TextField id="AddPersonNameField" label="Name"
									value={this.state.newPerson} onChange={this.handleChange}
									onKeyDown={this._handleKeyDown} />
							</Grid>
							<Grid item>
								<Button type="submit" label="Add" onClick={() => { this.PostNewPerson() }}
									variant="contained" color="primary">
									Add
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<PersonView name="Payments" editable updateTrip={this.props.updateTrip} data={this.props.data.personPayments} />
					</Grid>
				</Paper>
			</Grid>
		);
	}
}
