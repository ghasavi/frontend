import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios"; // centralized API instance

export default function AdminDashboard() {
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get("/api/products")
			.then((res) => {
				setProducts(res.data || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	const deleteProduct = async (id) => {
		if (!window.confirm("Delete this anime pic?")) return;

		try {
			await api.delete(`/api/products/${id}`);
			setProducts((prev) => prev.filter((p) => p._id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) return <div className="p-10 text-xl">Loading admin data...</div>;

	return (
		<div className="min-h-screen bg-gray-100 p-6">

			{/* HEADER */}
			<h1 className="text-4xl font-bold mb-8 text-secondary">
				Anime Store Admin 🗾
			</h1>

			{/* STATS / NAV CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

				<StatCard
					title="Products"
					value={products.length}
					onClick={() => navigate("/admin/products")}
				/>

				<StatCard
					title="Orders"
					value="12"
					onClick={() => navigate("/admin/orders")}
				/>

				<StatCard
					title="Revenue"
					value="$420"
					onClick={() => navigate("/admin/revenue")}
				/>

				<StatCard
					title="Users"
					value="69"
					onClick={() => navigate("/admin/users")}
				/>

			</div>

			{/* PRODUCTS TABLE */}
			<div className="bg-white rounded-2xl shadow p-6">
				<h2 className="text-2xl font-semibold mb-4">Anime Pics Inventory</h2>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b">
								<th className="p-3">Image</th>
								<th className="p-3">Name</th>
								<th className="p-3">Price</th>
								<th className="p-3">Stock</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>

						<tbody>
							{products.map((product) => (
								<tr key={product._id} className="border-b hover:bg-gray-50">
									<td className="p-3">
										<img
											src={product.images?.[0] || ""}
											alt=""
											className="w-16 h-16 object-cover rounded-xl"
										/>
									</td>
									<td className="p-3 font-semibold">{product.name}</td>
									<td className="p-3 text-accent font-bold">
										${Number(product.price).toFixed(2)}
									</td>
									<td className="p-3">{product.stock ?? "∞"}</td>
									<td className="p-3 flex gap-2">
										<button
											onClick={() =>
												navigate(`/admin/products/edit/${product._id}`)
											}
											className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
										>
											Edit
										</button>
										<button
											onClick={() => deleteProduct(product._id)}
											className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function StatCard({ title, value, onClick }) {
	return (
		<div
			onClick={onClick}
			className="cursor-pointer bg-white rounded-2xl shadow p-6
				hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
		>
			<p className="text-gray-500">{title}</p>
			<p className="text-3xl font-bold mt-2">{value}</p>
		</div>
	);
}
