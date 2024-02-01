import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);

  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setIsLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Confirmer la suppression ?",
        text: `Catégorie : ${category.name}`,
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        // promise rejected...
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function updatePropertyName(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function updatePropertyValues(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <>

    
    <Layout>
      <h1>Catégories</h1>
      <label className={editedCategory ? "text-red-500" : ""}>
        {editedCategory
          ? `Modifier la catégorie ${editedCategory.name}`
          : "Créer une Nouvelle catégorie"}{" "}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Nom de la catégorie"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Pas de parent pour cette catégorie</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Propriétés</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Ajouter une nouvelle propriété
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              // eslint-disable-next-line react/jsx-key
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(ev) =>
                    updatePropertyName(index, property, ev.target.value)
                  }
                  placeholder="Nom de la propriété (exemple: couleur)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(ev) =>
                    updatePropertyValues(index, property, ev.target.value)
                  }
                  placeholder="Valeurs, ..."
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Supprimer
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Annuler
            </button>
          )}

          <button type="submit" className="btn-primary py-1 ">
            Enregistrer
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nom de la catégorie</td>
              <td>Parent</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1 mb-1 mt-1"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
    </>
    
  );
  
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
