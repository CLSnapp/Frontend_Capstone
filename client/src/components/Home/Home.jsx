import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "../Recipes/RecipesSlice";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import header from "../../logos/header.png";

export default function Home() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [carouselRecipes, setCarouselRecipes] = useState([]);
  const navigate = useNavigate();

  const seeRecipeDetails = (id) => navigate(`/recipes/${id}`);
  const seeAllRecipes = () => navigate(`/recipes`);

  const getRandomRecipes = (recipes, num) => {
    if (!recipes || recipes.length === 0) return [];
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    if (isSuccess && data?.length > 0) {
      setFeaturedRecipes(getRandomRecipes(data, 3));
      setCarouselRecipes(getRandomRecipes(data, 10));
    }
  }, [data, isSuccess]);

  return (
    <>
      <div className="masthead-container">
        <section className="masthead">
          <div className="masthead-content">
            <h1 className="display-4">The RACipe Hub</h1>
            <p className="lead">
              <strong>
                A central space for all things food, offering the essence of a
                community-driven recipe platform.
              </strong>
            </p>
            <p>
              <Link to="/register">
                <button type="button" className="btn btn-outline-light">
                  <strong>Get Started</strong>
                </button>
              </Link>
            </p>
          </div>
        </section>
      </div>
      <div className="container">
        <div className="home-container">
          <div>
            <Carousel className="mt-3">
              {carouselRecipes.map((recipe) => (
                <Carousel.Item
                  key={recipe.id}
                  onClick={() => seeRecipeDetails(recipe.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="d-block w-100"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                    src={
                      recipe.photo ||
                      "https://placehold.co/800x400?text=No+Photo+Available"
                    }
                    alt={recipe.name}
                  />
                  <Carousel.Caption>
                    <p>
                      <button
                        onClick={() => seeRecipeDetails(recipe.id)}
                        className="btn btn-link text-white"
                        style={{ background: "rgba(0, 0, 0, 0.4)" }}
                      >
                        <h1 className="display-6">
                          <strong>{recipe.name}</strong>
                        </h1>
                      </button>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <p className="text-center">
            {isLoading && "Loading recipes..."}
            {error && "Error loading recipes."}
          </p>

          <h3 className="mt-4">Featured Recipes</h3>
          <div className="row">
            {featuredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="col-md-4"
                style={{ marginBottom: "10px" }}
              >
                <div className="card bg-dark text-white h-100">
                  {recipe?.photo ? (
                    <img
                      src={
                        recipe.photo ||
                        "https://placehold.co/600x600?text=No+Photo+Available"
                      }
                      className="card-img-top"
                      alt={recipe.name}
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
                    <button
                      onClick={() => seeRecipeDetails(recipe.id)}
                      className="btn btn-primary"
                    >
                      View Recipe Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={seeAllRecipes} className="btn btn-secondary mt-4">
            Show All Recipes
          </button>

          <form className="mt-4">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
            <button className="btn btn-primary mt-2">Subscribe</button>
          </form>
        </div>
      </div>
    </>
  );
}
