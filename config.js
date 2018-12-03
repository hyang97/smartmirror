const WEB_SOCKET_PORT = 40510;

// const KEYWORDS = ["weather", "calendar"];

const KEYWORDS = [
	{	page: "listening", 
		keywords: ["ok google", "listen"]
	},
	{
		page: "weather", 
		keywords: ["temperature", "hot", "cold", "rain", "degrees", "what should i wear"]
	}, 
	{
		page: "calendar", 
		keywords: ["schedule", "my day"]
	}, 
	{
		page: "nav", 
		keywords: ["command", "what can i do", "what can you do"]
	}, 
	{
		page: "index", 
		keywords: ["home page", "main page", "home screen", "take me back"]
	}
];

module.exports = { WEB_SOCKET_PORT, KEYWORDS };
