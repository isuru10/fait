import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
	return (
		<div>
			<Head>
				<title>FAIT</title>
				<link rel="icon" href="/hat.png" />
			</Head>
			<Header />
			<main className="main">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
