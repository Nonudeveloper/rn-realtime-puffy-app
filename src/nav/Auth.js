import { StackNavigator } from 'react-navigation';
import { Login, Register, ForgotPassword, Reset } from '../scenes';

const Auth = StackNavigator({
  Login: {
    screen: Login,
    path: '/',
  },
  Register: {
    screen: Register,
    path: '/',
  },
  ForgotPassword: {
    screen: ForgotPassword,
    path: '/',
  },
  Reset: {
    screen: Reset,
    path: '/',
  }
}, {
	headerMode: 'none',
});

export default Auth;
