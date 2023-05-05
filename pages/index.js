import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
	const [dateInput, setDateInput] = useState("");
	const [result, setResult] = useState();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(event) {
		setIsLoading(true);
		event.preventDefault();
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ dob: dateInput }),
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw (
					data.error ||
					new Error(`Request failed with status ${response.status}`)
				);
			}

			setResult(data.result);
			setDateInput("");
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			alert(error.message);
			setIsLoading(false);
		}
	}

	return (
		<div>
			<img src="/wizard.png" className="icon" />
			<h3>How is my next week?</h3>
			<p className="description">
				Welcome to the F<span>AI</span>T fortune teller. Enter your date of
				birth to generate a prediction on how your next week will be.
			</p>
			<form onSubmit={onSubmit}>
				<label htmlFor="dob">Enter Date of Birth</label>
				<input
					type="date"
					name="dob"
					placeholder="Enter date of birth"
					value={dateInput}
					onChange={(e) => setDateInput(e.target.value)}
				/>
				<input type="submit" value="Generate Predictions" />
			</form>
			{isLoading && <img src="/wizard-magic.gif" className="loading" />}
			<div className="result">{result}</div>
			<p>
				<Link href="/login">Login</Link>&nbsp;to save the predictions
			</p>
			<div className="disclaimer">
				DISCLAIMER: This is just for entertainment purposes only. Astrological
				predictions are based on the position of celestial bodies at the time of
				a person&apos;s birth, which is not a scientifically proven way to
				predict one&apos;s future.
			</div>
		</div>
	);
}
