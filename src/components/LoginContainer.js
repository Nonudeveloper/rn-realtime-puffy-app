import React, { Component } from 'react';
import { View, NavigationExperimental } from 'react-native';
import { Login } from '../scenes';

const {
	CardStack: NavigationCardStack,
	StateUtils: NavigationStateUtils
} = NavigationExperimental;

class LoginContainer extends Component {

	constructor(props) {
		super(props);
		this.goBack = this.goBack.bind(this);
		this.pushRoute = this.pushRoute.bind(this);
		this.renderScene = this.renderScene.bind(this);

		this.state = {
		// This defines the initial navigation state.
			navigationState: {
				index: 0, // Starts with first route focused.
				routes: [
					{ name: 'Login', component: Login, key: '0' },
				], // Starts with only one route.
			},
		};
	}

	// As in TabBar use NavigationUtils for this 2 methods
	goBack() {
		const navigationState = NavigationStateUtils.pop(this.state.navigationState);
		this.setState({ navigationState });
	}

	pushRoute(route) {
		const navigationState = NavigationStateUtils.push(this.state.navigationState, route);
		this.setState({ navigationState });
	}

	renderScene({ scene }) {
		const Route = scene.route.component;

		return	(
			<View style={styles.container}>
			<Route 
				goBack={this.goBack}
				goTo={this.pushRoute}
				screenKey={scene.route.key}
				setLogged={this.props.setLogged}
			/>
			</View>
		);			
	}


	render() {
		return (
			<NavigationCardStack 
				direction='vertical'
				navigationState={this.state.navigationState}
				onNavigate={() => {}}
				renderScene={this.renderScene}
			/>);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#FEFEFE'
	}
 };

export default LoginContainer;
