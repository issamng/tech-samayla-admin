import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      <h1>Commandes</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paiement</th>
            <th>Destinataire</th>
            <th>Produits</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()} </td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "OK" : "Non effectué"}
                </td>
                <td>
                  {order.firstName} {order.lastName} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.adress}
                  <br />
                  {order.country}
                </td>
                <td>
                  {order.line_items?.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x {l.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
