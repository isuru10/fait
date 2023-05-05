import Head from "next/head";

const Layout = ({ children }) => {
	return (
		<div>
			<Head>
				<title>FAIT</title>
				<link rel="icon" href="/hat.png" />
			</Head>
			<main className="main">{children}</main>
		</div>
	);
};

export default Layout;
