import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "./RecipesSlice";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Recipes() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  console.log(data);
  const [recipeFilter, setRecipeFilter] = useState({
    recipeSearch: "",
  });
  const navigate = useNavigate();
  const [recipeArr, setRecipeArr] = useState([]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = recipeArr.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(recipeArr.length / itemsPerPage);

  const seeRecipeDetails = (id) => {
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  const update = (e) => {
    setRecipeFilter({
      recipeSearch: e.target.value,
    });
    const temp = e.target.value.toLowerCase();
    if (temp.length === 0) {
      setRecipeArr(data);
    } else {
      const filteredRecipes = data.filter((element) => {
        return element.name.toLowerCase().includes(temp);
      });
      setRecipeArr(filteredRecipes);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % recipeArr.length;
    setItemOffset(newOffset);
  };

  console.log(currentItems);
  return (
    <>
      <div className="container">
        <h2>Recipes</h2>
        <form>
          <label>
            <p>
              Search by Name or Ingredient:{" "}
              <input
                className="form-control"
                name="recipeSearch"
                value={recipeFilter.recipeSearch}
                onChange={update}
              />
            </p>
          </label>
        </form>
        <p>
          {isLoading && "Loading recipes..."}
          {error && "Error loading recipes..."}
        </p>
        <div>
          <div className="row g-2">
            {currentItems?.map((recipe) => (
              <div className="col" key={recipe.id}>
                <div
                  className="card h-100"
                  style={{ padding: "0", width: "18rem" }}
                >
                  {recipe?.photo ? (
                    <img
                      src={recipe.photo}
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x600?text=No+Photo+Available"
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">{recipe.description}</p>
                    <button
                      className="btn btn-outline-primary btn-sm "
                      onClick={() => seeRecipeDetails(recipe.id)}
                    >
                      Click for Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <br />
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel="< previous"
                  containerClassName="pagination"
                  activeClassName="active"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
