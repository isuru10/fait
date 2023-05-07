import Disclaimer from "@/components/Disclaimer";
import Prediction from "@/components/Prediction";
import { useUser } from "@/lib/hooks";
import { useEffect, useState } from "react";

const Predictions = () => {
	useUser({ redirectTo: "/login", redirectIfFound: false });

	const [predictions, setPredictions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		try {
			setIsLoading(true);
			fetch("/api/predictions", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			})
				.then((res) => res.json())
				.then((data) => {
					setIsLoading(false);
					setPredictions(data.predictions);
				})
				.catch((err) => {
					setIsLoading(false);
					throw new Error(err);
				});
		} catch (error) {
			console.log("An unexpected error has occurred", error.stack);
			setErrorMessage("An unexpected error has occurred");
			setIsLoading(false);
		}
	}, []);

	const dateOptions = { year: "numeric", month: "short", day: "numeric" };

	return (
		<div>
			<h3>Predictions</h3>
			<section className="prediction-container">
				{predictions.length > 0 ? (
					predictions.map((prediction) => (
						<Prediction
							key={prediction.dateFrom}
							week={`${new Date(prediction.dateFrom).toLocaleDateString(
								undefined,
								dateOptions
							)}   -   ${new Date(prediction.dateTo).toLocaleDateString(
								undefined,
								dateOptions
							)}`}
							prediction={prediction.prediction}
						/>
					))
				) : isLoading ? (
					<p>Loading...</p>
				) : (
					<p>No predictions generated yet</p>
				)}
				<Disclaimer />
			</section>
		</div>
	);
};

export default Predictions;
