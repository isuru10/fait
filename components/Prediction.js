const Prediction = ({ week, prediction }) => {
	return (
		<div className="prediction">
			<p className="week">{week}</p>
			{prediction}
		</div>
	);
};

export default Prediction;
