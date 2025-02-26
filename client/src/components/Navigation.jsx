import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLogin } from "../app/confirmLoginSlice";
import logo from "../logos/logo.jpg";

export default function NavBar({ token }) {
  const auth2 = useSelector(getLogin);

  const logout = () => {
    window.sessionStorage.removeItem("token");
    history.push("/");
  };
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-md bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand mb-0 h1">
            <img
              src={logo}
              alt="RACipe Hub Logo"
              style={{ maxHeight: "85px" }}
              className="rounded"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li> */}
              <li className="nav-item">
                <Link to="/recipes" className="nav-link" href="#">
                  Recipes
                </Link>
              </li>
              {!auth2 && (
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link" href="#">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" href="#">
                      Login
                    </Link>
                  </li>
                </>
              )}
              {auth2 && (
                <>
                  <li className="nav-item dropdown">
                    <Link
                      to="/account"
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Account
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          to="/share-recipe"
                          className="dropdown-item"
                          href="#"
                        >
                          Share Recipe
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-recipes"
                          className="dropdown-item"
                          href="#"
                        >
                          My Recipes
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/favorites"
                          className="dropdown-item"
                          href="#"
                        >
                          My Favorites
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider"></hr>
                      </li>
                      <li>
                        <Link to="/account" className="dropdown-item" href="#">
                          Account Details
                        </Link>
                      </li>
                      <li>
                        <Link to="/" onClick={logout} className="dropdown-item">
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
