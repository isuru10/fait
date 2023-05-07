import { useState } from "react";
import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import { useUser } from "@/lib/hooks";

export default function Home() {
	const [dateInput, setDateInput] = useState("");
	const [result, setResult] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const user = useUser();

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

			await savePrediction(data.result);

			setDateInput("");
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			alert(error.message);
			setIsLoading(false);
			setResult("");
		}
	}

	function savePrediction(prediction) {
		return new Promise(async (resolve, reject) => {
			if (user) {
				const response = await fetch("/api/predictions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ prediction: prediction, dob: dateInput }),
				});

				const data = await response.json();
				if (response.status !== 200) {
					throw (
						data.error ||
						new Error(`Request failed with status ${response.status}`)
					);
				}
				resolve();
			}
		});
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
					value={dateInput}
					onChange={(e) => setDateInput(e.target.value)}
				/>
				<input type="submit" value="Generate Predictions" />
			</form>
			{isLoading && <img src="/wizard-magic.gif" className="loading" />}
			<div className="result">{result}</div>

			{user ? (
				<p>
					<Link href="/predictions">All Predictions</Link>
				</p>
			) : (
				<p>
					<Link href="/login">Login</Link>&nbsp; or{" "}
					<Link href="/signup">Sign Up</Link>&nbsp; to save the predictions
				</p>
			)}

			<Disclaimer />
		</div>
	);
}
