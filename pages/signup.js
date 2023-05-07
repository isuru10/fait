import { useUser } from "@/lib/hooks";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useUser({ redirectTo: "/", redirectIfFound: true });

	const onSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");

		try {
			const signupRes = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: username, password: password }),
			});

			const signupData = await signupRes.json();
			if (signupRes.status !== 200) {
				throw signupData.error || new Error(signupData.message);
			}

			const loginRes = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: username, password: password }),
			});

			const loginData = await loginRes.json();
			if (loginRes.status === 200) {
				Router.push("/");
			} else {
				throw loginData.error || new Error(loginData.message);
			}
		} catch (error) {
			console.log("An unexpected error has occurred: ", error.message);
			setErrorMessage(error.message);
		}
	};

	return (
		<div>
			<h3>Sign Up</h3>
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
				<input type="submit" value="Sign Up" />
			</form>
			<p>
				Already have an account? <Link href="/login">Login</Link>
			</p>
			{errorMessage && <p className="error">{errorMessage}</p>}
		</div>
	);
};

export default Signup;
