export const mockSnippets = [
	{
		id: 1,
		title: "React UseAuth Hook",
		language: "typescript",
		description: "A simple custom hook for handling authentication context.",
		code: "export const useAuth = () => {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error('useAuth must be used within AuthProvider');\n  return context;\n};",
	},
	{
		id: 2,
		title: "Centering Div",
		language: "css",
		description: "The classic flexbox centering technique.",
		code: ".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}",
	},
	{
		id: 3,
		title: "Python API Request",
		language: "python",
		description: "Basic GET request using the requests library.",
		code: "import requests\n\nresponse = requests.get('https://api.example.com/data')\nprint(response.json())",
	},
];
