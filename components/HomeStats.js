import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";

/* eslint-disable react/no-unescaped-entities */
export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach(order => {
        const {line_items} = order;
        line_items.forEach(li => {
            const lineSum = li.quantity * li.price_data.unit_amount / 100;
            sum += lineSum;
        })
    })
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR', 
        maximumFractionDigits: 0,
      }).format(sum);
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  );

  const ordersThisWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24*7)
  );

  const ordersThisMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24*30)
  );

  return (
    <>
      <h1>Commandes</h1>
      <div className="tiles-grid">
        <div className="tile">
          <h2 className="tile-header">Aujourd'hui</h2>
          <div className="tile-body">{ordersToday.length}</div>
          <div className="tile-desc">{ordersToday.length} commandes aujourd'hui</div>
        </div>
        <div className="tile">
          <h2 className="tile-header">Cette semaine</h2>
          <div className="tile-body">{ordersThisWeek.length}</div>
          <div className="tile-desc">{ordersThisWeek.length} commandes cette semaine</div>
        </div>
        <div className="tile">
          <h2 className="tile-header">Ce mois</h2>
          <div className="tile-body">{ordersThisMonth.length}</div>
          <div className="tile-desc">{ordersThisMonth.length} commandes ce mois</div>
        </div>
      </div>
      <h1>Revenues</h1>
      <div className="tiles-grid">
        <div className="tile">
          <h2 className="tile-header">Aujourd'hui</h2>
          <div className="tile-body">{ordersTotal(ordersToday)}</div>
          <div className="tile-desc">{ordersToday.length} commandes aujourd'hui</div>
        </div>
        <div className="tile">
          <h2 className="tile-header">Cette semaine</h2>
          <div className="tile-body">{ordersTotal(ordersThisWeek)}</div>
          <div className="tile-desc">{ordersThisWeek.length} commandes cette semaine</div>
        </div>
        <div className="tile">
          <h2 className="tile-header">Ce mois</h2>
          <div className="tile-body">{ordersTotal(ordersThisMonth)}</div>
          <div className="tile-desc">{ordersThisMonth.length} commandes ce mois</div>
        </div>
      </div>
    </>
  );
}
