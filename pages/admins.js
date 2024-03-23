/* eslint-disable react/no-unescaped-entities */
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  function addAdmin(ev) {
    ev.preventDefault();
    axios.post("/api/admins", { email }).then((res) => {
      console.log(res.data);
      swal.fire({
        title: "Nouvel administrateur ajouté avec succès !",
        icon: "success",
      });
      setEmail("");
      loadAdmins();
    }).catch(err => {
      swal.fire({
        title: "Erreur!",
        text: err.response.data.message,
        icon: "error",
      });
    });
  }

  // Delete Admin
  function deleteAdmin(_id, email) {
    swal
    .fire({
      title: "Confirmer la suppression ?",
      text: `Admin : ${email}`,
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    })
    .then(async (result) => {
        if (result.isConfirmed) {
            axios.delete("/api/admins?_id=" + _id).then(() => {
                swal.fire({
                  title: "Admin supprimé",
                  icon: "success",
                });
                loadAdmins();
              });
        }
    } );
  }
  // Update the table after adding new admin or deleting one 
  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Gestion des administrateurs</h1>
      <h2>Ajouter un admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
          
            type="text"
            className=" mb-0"
            value={email}
            required
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Entrez l'email"
          />
          <button type="submit" className="btn-primary py-1">
            Ajouter
          </button>
        </div>
      </form>
      <h2>Admins actuels</h2>

      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Emails</th>
            <th className="text-left">Date d'ajout</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <Spinner fullWidth={true} />
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((adminEmail) => (
              <tr key={adminEmail._id}>
                <td>{adminEmail.email}</td>
                <td>
                  {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                </td>
                <td>
                  <button
                    onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)}
                    className="btn-red flex items-center"
                  >
                     <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }) => <AdminsPage swal={swal} />);
