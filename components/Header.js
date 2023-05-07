import { useUser } from "@/lib/hooks";
import Link from "next/link";
import React from "react";

const Header = () => {
	const user = useUser();
	return (
		<nav className="nav-bar">
			<ul className="nav-items">
				<li>
					<Link href="/" className="nav-link">
						Home
					</Link>
				</li>
				<li>
					<Link href="/predictions" className="nav-link">
						Predictions
					</Link>
				</li>

				{!user ? (
					<>
						<li>
							<Link href="/login" className="nav-link">
								Login
							</Link>
						</li>
						<li>
							<Link href="/signup" className="nav-link">
								Sign Up
							</Link>
						</li>
					</>
				) : (
					<li>
						<Link href="/api/logout" className="nav-link">
							Logout
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Header;
