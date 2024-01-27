import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  // Pre loader for products
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState("");
  // State for shipping fee
  const [shippingFee, setShippingFee] = useState("");

  // Featured product setting
  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
 
  }, []);

  // Featured product // Shippping fee setting
  async function fetchAll() { 
    await axios.get("/api/products").then((res) => {
      setProducts(res.data);
      });
    await axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
      
    });
    // Shipping fee setting
    await axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data?.value);
    });
  }

  async function saveSettings() {
    setIsLoading(true);
    // Featured product setting
    await axios
      .put("/api/settings", {
        name: "featuredProductId",
        value: featuredProductId,
      });
      // Shipping fee setting 
      await axios
      .put("/api/settings", {
        name: "shippingFee",
        value: shippingFee,
      });
      setIsLoading(false);
      
      await swal.fire({
        title: "Paramètres enregistrés!",
        // text: "Le produit en vedette a été mis à jour.",
        icon: "success",
      });
      
  }

  return (
    <Layout>
      <h1>Gestion de la boutique</h1>
      {isLoading && <Spinner fullWidth={true} />}
      {!isLoading && (
        <>
          <label>Produit vedette (Sélectionnez votre produit vedette à afficher sur la page d'accueil)</label>
          <select
            value={featuredProductId}
            onChange={(ev) => setFeaturedProductId(ev.target.value)}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option value={product._id} key={product._id}>
                  {product.title}
                </option>
              ))}
          </select>
          <label>Frais de livraison (eur)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(ev => setShippingFee(ev.target.value))}
          />
          <div>
            <button onClick={saveSettings} className="btn-primary">
              Enregistrer
            </button>
          </div>
        </>
      )}
    </Layout>
  );

}

export default withSwal(({ swal }) => <SettingsPage swal={swal} />);
