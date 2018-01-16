import { StackNavigator } from 'react-navigation';
import { ProfileEdit } from '../scenes';

const CompleteProfile = StackNavigator({
  ProfileEdit: {
    screen: ProfileEdit,
    path: '/',
  },
}, {
	headerMode: 'none',
});

export default CompleteProfile;