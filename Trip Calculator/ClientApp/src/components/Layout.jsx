import React, { Component } from 'react';
import { Grid, AppBar, Toolbar, Typography } from '@material-ui/core';

export class Layout extends Component {
	displayName = Layout.name

	render() {
		return (
			<Grid container>
				<Grid item style={{width: "100%"}}>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6" color="inherit">
								Trip Calculator
							</Typography>
						</Toolbar>
					</AppBar>
				</Grid>
				<Grid item style={{ width: "100%" }}>
					{this.props.children}
				</Grid>
			</Grid>
		);
	}
}
