import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddFavoriteRecipeMutation,
  useDeleteFavoriteRecipeMutation,
  useGetFavoriteRecipesQuery,
  useDeleteRecipeMutation,
  useGetRecipesQuery,
} from "../Recipes/RecipesSlice";
import { getLogin, getUser, confirmLogin } from "../../app/confirmLoginSlice";
import EditRecipeForm from "./EditRecipe";
import AdminEditRecipeForm from "../Admin/AdminEditRecipe";
import ReviewSection from "./Reviews";
import { useDeleteRecipeAsAdminMutation } from "../Admin/AdminSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  // Fetch user data and set up necessary states
  const { data, isSuccess, isLoading, error, refetch } = useGetRecipeQuery(id);
  const {
    data: allRecipes,
    isSuccess: recipesSuccess,
    refetch: allRecipesRefetch,
  } = useGetRecipesQuery();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();
  const [deleteFavoriteRecipe] = useDeleteFavoriteRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation(id);
  const [deleteRecipeAsAdmin] = useDeleteRecipeAsAdminMutation(id);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = useSelector(getLogin);
  const authUser = useSelector(getUser);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const role = window.sessionStorage.getItem("role");
  const navigate = useNavigate();

  const { data: favoriteRecipes, isSuccess: isFavoriteRecipesFetched } =
    useGetFavoriteRecipesQuery({ id });

  const [recipeArr, setRecipeArr] = useState([]);
  // When recipe data is available, update recipeArr state
  useEffect(() => {
    if (isSuccess && data) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  const [allRecipesArr, setAllRecipesArr] = useState([]);
  // When all recipes data is available, update allRecipesArr state
  useEffect(() => {
    if (recipesSuccess && allRecipes) {
      setAllRecipesArr(allRecipes);
    }
  }, [allRecipes, recipesSuccess]);


  // Handle recipe deletion for non-admin users
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteRecipe({ id });
        const updatedRecipes = allRecipesArr.filter((item) => item.id !== id);
        setAllRecipesArr(updatedRecipes);
        allRecipesRefetch();
        alert("Recipe deleted.");
        navigate("/");
        console.log(`Deleting item with ID: ${id}`);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe.");
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };


  // Handle recipe deletion for admin users
  const handleDeleteAdminClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteRecipeAsAdmin({ id });
        const updatedRecipes = allRecipesArr.filter((item) => item.id !== id);
        setAllRecipesArr(updatedRecipes);
        allRecipesRefetch();
        alert("Recipe deleted.");
        navigate("/");
        console.log(`Deleting item with ID: ${id}`);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe.");
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    refetch();
  };

  const handleAdminEditClick = () => {
    setIsEditing(true);
  };

  const handleAdminEditCancel = () => {
    setIsEditing(false);
  };

  // Retrieve and parse user data from sessionStorage if it exists
  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && !authUser) {
          dispatch(confirmLogin(parsedUser));
        }
      } catch (e) {
        console.error("Error parsing user data from sessionStorage:", e);
      }
    }
  }, [authUser, dispatch]);

  // Check if the logged-in user is the creator of the recipe
  const isCreator =
    authUser && recipeArr?.creatorId && recipeArr.creatorId === authUser.id;

  // Update isFavorite state based on whether the recipe is in the user's favorites
  useEffect(() => {
    if (isFavoriteRecipesFetched && favoriteRecipes) {
      const isRecipeFavorite = favoriteRecipes.some(
        (recipe) => recipe.recipeId === parseInt(id)
      );
      setIsFavorite(isRecipeFavorite);
    }
  }, [favoriteRecipes, isFavoriteRecipesFetched, id]);


  // Handle adding/removing a recipe from favorites
  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteFavoriteRecipe({ id: id }).unwrap();
        setIsFavorite(false);
      } else {
        await favoriteRecipe({
          recipeId: id,
        }).unwrap();
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error adding favorite recipe", error);
    }
  };

  // Function to calculate the average rating of user reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Function to render star rating display based on average rating
  const renderStarAverage = (rating) => {
    const totalStars = 5;
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        stars.push(
          <span key={i} className="star-rating">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-rating-empty">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      }
    }

    return stars;
  };

  // Round quantity to nearest fraction

  // Calculate avg. rating based off review ratings
  const averageRating = calculateAverageRating(recipeArr?.review);

  const favoriteCount = Array.isArray(recipeArr?.favoritedBy)
    ? recipeArr.favoritedBy.length
    : 0;
    
    console.log("loggg", recipeArr?.instructions);


  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <p>{error && "Error loading recipe..."}</p>

          {isEditing ? (
            <div className="card" style={{ minWidth: "42rem", margin: "auto" }}>
              {recipeArr?.photo ? (
                <img
                  src={recipeArr.photo}
                  className="card-img-top"
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                  alt={recipeArr.name}
                />
              ) : (
                <img
                  src="https://placehold.co/600x600?text=No+Photo+Available"
                  className="card-img-top"
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
              )}
              {isCreator && (
                <div className="card-body">
                  <EditRecipeForm
                    id={id}
                    onCancel={handleEditCancel}
                    setIsEditing={setIsEditing}
                  />{" "}
                </div>
              )}
              {role === "ADMIN" && !isCreator && (
                <div className="card-body">
                  <AdminEditRecipeForm
                    id={id}
                    onCancel={handleAdminEditCancel}
                    setIsEditing={setIsEditing}
                  />{" "}
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className="card"
                style={{ minWidth: "42rem", margin: "auto" }}
              >
                {recipeArr?.photo ? (
                  <img
                    src={recipeArr.photo}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                    alt={recipeArr.name}
                  />
                ) : (
                  <img
                    src="https://placehold.co/600x600?text=No+Photo+Available"
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">
                  <div className="d-flex mb-0">
                    <div className="p-0" style={{maxWidth: "80%"}}>
                      <figure>
                        <blockquote className="blockquote">
                          <h2>{recipeArr.name}</h2>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                          {recipeArr?.user?.firstName}{" "}
                          {recipeArr?.user?.lastName[0]}
                        </figcaption>
                      </figure>
                    </div>
                    <div className="ms-auto p-0">
                      <span className="h5">
                        {isCreator && (
                          <>
                            <i
                              className="bi bi-pencil-square btn btn-outline-dark controls"
                              onClick={handleEditClick}
                            ></i>
                            &nbsp;&nbsp;
                            <i
                              className="bi bi-trash btn btn-outline-dark controls"
                              onClick={() => handleDeleteClick(recipeArr.id)}
                            ></i>
                            &nbsp;&nbsp;
                          </>
                        )}

                        {role === "ADMIN" && !isCreator && (
                          <>
                            <i
                              className="bi bi-pencil-square btn btn-outline-dark controls"
                              onClick={handleAdminEditClick}
                            ></i>
                            &nbsp;&nbsp;
                            <i
                              className="bi bi-trash btn btn-outline-dark controls"
                              onClick={() =>
                                handleDeleteAdminClick(recipeArr.id)
                              }
                            ></i>
                            &nbsp;&nbsp;
                          </>
                        )}
                        {auth && (
                          <button
                            onClick={handleFavorite}
                            className="btn btn-outline-danger favorite"
                          >
                            {" "}
                            <span>
                              {isFavorite ? (
                                <i className="bi bi-heart-fill favorite"></i>
                              ) : (
                                <i className="bi bi-heart"></i>
                              )}{" "}
                              {favoriteCount}
                            </span>
                          </button>
                        )}
                      </span>
                    </div>
                  </div>

                  {recipeArr?.categories?.map((cat) => {
                    return (
                      <p
                        key={cat.id}
                        style={{ marginRight: "6px" }}
                        className="badge text-bg-secondary"
                      >
                        {cat.name}
                      </p>
                    );
                  })}
                  <div className="star-rating">
                    {renderStarAverage(Math.round(averageRating))}
                  </div>
                  <small>Average Rating: {averageRating.toFixed()} / 5</small>
                  <br />
                  <br />

                  <p className="card-text lead">{recipeArr.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <h5>Ingredients</h5>
                    <ul className="list-group list-group-flush">
                      {recipeArr?.ingredient?.map((ing) => {
                        return (
                          <li key={ing.id} className="list-group-item">
                           {ing.quantity} {ing.unit.name} of{" "}
                            {ing.ingredient.name}{" "}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li className="list-group-item">
                    <h5>Instructions</h5>
                    <ol className="list-group list-group-flush list-group-numbered">
                      {recipeArr?.instructions?.map((inst) => {
                        console.log(inst);
                        return (
                          <li key={inst.id} className="list-group-item">
                            {" "}
                            {inst.instruction}
                          </li>
                        );
                      })}
                    </ol>
                  </li>
                </ul>
              </div>
              <ReviewSection />
            </>
          )}
        </div>
      )}
    </>
  );
}
