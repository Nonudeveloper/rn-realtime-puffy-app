import {
	Home,
	Profile,
	Filter,
	Likers,
	Messages,
	Message,
	Events,
	EventDetail,
	EventsHome,
	EventsView,
	File,
	EventApprove,
	EventsRating,
	Photo,
	Video,
	Gallery,
	Group,
	PhotoConfirm,
	VideoConfirm,
	ProfileSettings,
	ProfileEdit,
	Preferences,
	Support,
	SupportMsg,
	Misc,
	BlockList,
	ChangePassword,
	EventComment,
	FeedComment
} from "../scenes";

const routes = {
	Home: {
		screen: Home
	},
	Likers: {
		screen: Likers
	},
	Profile: {
		screen: Profile
	},
	Group: {
		screen: Group
	},
	Messages: {
		screen: Messages
	},
	Message: {
		screen: Message
	},
	Events: {
		screen: Events
	},
	EventDetail: {
		screen: EventDetail
	},
	EventsHome: {
		screen: EventsHome
	},
	EventsView: {
		screen: EventsView
	},
	EventApprove: {
		screen: EventApprove
	},
	EventsRating: {
		screen: EventsRating
	},
	EventComment: {
		screen: EventComment
	},
	File: {
		screen: File
	},
	FeedComment: {
		screen: FeedComment
	},
	Photo: {
		screen: Photo
	},
	Video: {
		screen: Video
	},
	Gallery: {
		screen: Gallery
	},
	PhotoConfirm: {
		screen: PhotoConfirm
	},
	VideoConfirm: {
		screen: VideoConfirm
	},
	ProfileSettings: {
		screen: ProfileSettings
	},
	Filter: {
		screen: Filter
	},
	Preferences: {
		screen: Preferences
	},
	ChangePassword: {
		screen: ChangePassword
	},
	ProfileEdit: {
		screen: ProfileEdit
	},
	Support: {
		screen: Support
	},
	SupportMsg: {
		screen: SupportMsg
	},
	Misc: {
		screen: Misc
	},
	BlockList: {
		screen: BlockList
	}
};

export default routes;
