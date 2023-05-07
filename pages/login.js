import { useUser } from "@/lib/hooks";
import Router from "next/router";
import { useState } from "react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useUser({ redirectTo: "/", redirectIfFound: true });

	const onSubmit = async (event) => {
		setIsLoading(true);
		event.preventDefault();
		setErrorMessage("");

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: username, password: password }),
			});

			const data = await res.json();
			if (res.status === 200) {
				setIsLoading(false);
				Router.push("/");
			} else {
				setIsLoading(false);
				throw data.error || new Error(data.message);
			}
		} catch (error) {
			console.log("An unexpected error has occurred: ", error.message);
			setErrorMessage(error.message);
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h3>Login</h3>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input type="submit" value="Login" />
			</form>
			{(errorMessage || isLoading) && (
				<p className={isLoading ? "loading-message" : "error"}>
					{isLoading ? "Loading..." : errorMessage}
				</p>
			)}
		</div>
	);
};

export default Login;
