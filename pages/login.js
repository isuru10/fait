import { useUser } from "@/lib/hooks";
import { Router } from "next/router";
import { useState } from "react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useUser({ redirectTo: "/", redirectIfFound: true });

	const onSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: username, password: password }),
			});

			if (res.status === 200) {
				console.log(res);
				Router.push("/");
			} else {
				throw new Error(await res.text());
			}
		} catch (error) {
			console.error("An unexpected error has occurred", error);
			setErrorMessage(error.message);
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
		</div>
	);
};

export default Login;
