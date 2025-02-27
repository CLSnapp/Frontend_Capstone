import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Account() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserQuery(id);

  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  console.log(data);

  return (
    <>
      <div className="container">
        <h3>
          Welcome {user.firstName} {user.lastName}
        </h3>
        <h6>{user.email}</h6>
        <hr></hr>
        <h1 className="display-6">My Recipes</h1>
        <div>
          <div className="row g-2">
            {Array.isArray(user?.recipes) && user.recipes.length > 0 ? (
              user?.recipes?.slice(0, 3).map((rec) => (
                <div className="col-4" key={rec.id}>
                  <div className="card h-100" style={{ padding: "0" }}>
                    {rec.photo ? (
                      <img
                        src={rec.photo}
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
                      <h5 className="card-title">{rec.name}</h5>
                      <p className="card-text">{rec.description}</p>
                      <Link
                        to={`/recipes/${rec.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You currently have no recipes.</p>
            )}
          </div>
        </div>
        <br />
        <p>
          <Link to="/share-recipe" className="btn btn-primary">
            Share a Recipe
          </Link>
          <br />
        </p>
        <p>
          {Array.isArray(user?.recipes) && user.recipes?.length > 3 ? (
            <Link to="/my-recipes" className="btn btn-primary">
              View all My Recipes
            </Link>
          ) : (
            ""
          )}
        </p>
        <hr></hr>
        <h1 className="display-6">My Favorite Recipes</h1>
        <div>
          <div className="row g-2">
            {user?.favorites?.slice(0, 3).map((fav) => (
              <div className="col-md-4" key={fav.id}>
                <div className="card h-100" style={{ padding: "0" }}>
                  {fav?.recipe?.photo ? (
                    <img
                      src={fav.recipe.photo}
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
                    <h5 className="card-title">{fav.recipe.name}</h5>
                    <p className="card-text">{fav.recipe.description}</p>
                    <Link
                      to={`/recipes/${fav.recipeId}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <br />
        <p>
          {Array.isArray(user?.favorites) && user.favorites.length > 3 ? (
            <Link to="/favorites" className="btn btn-primary">
              View all Favorites
            </Link>
          ) : (
            ""
          )}
        </p>
      </div>
    </>
  );
}
