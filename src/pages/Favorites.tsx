import { useGetFavoritesQuery, useRemoveFavoriteMutation, favoriteApi } from "../redux/api/favoriteAPI";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { ProductType } from "../types/types";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { useState } from "react";
import toast from "react-hot-toast";

const Favorites = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useAuthRedirect(); // ✅ protect route
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeFavorite] = useRemoveFavoriteMutation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    data: favorites = [],
    isLoading,
    refetch,
  } = useGetFavoritesQuery(user?._id!, {
    skip: !user?._id,
  });

  if (!isAuthenticated || !user || !user._id) {
    return <div className="auth-redirecting">Redirecting to login...</div>;
  }

  return (
    <div className="favorites-container">
      <h1>My Favorites</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((product: ProductType | null) => {
            if (
              !product ||
              !product._id ||
              !product.name ||
              !product.photos ||
              product.photos.length === 0 ||
              !product.photos[0]?.url
            ) {
              return null; // Skip invalid entries
            }

            return (
              <div className="favorite-item" key={product._id}>
                <button
                  className="remove-favorite-btn"
                  onClick={async () => {
                    setRemovingId(product._id);
                    try {
                      if (!isAuthenticated || !user || !user._id) {
                        toast.error("You must be logged in to remove favorites");
                        return;
                      }

                      await removeFavorite({ userId: user._id, productId: product._id }).unwrap();

                      // ✅ Refresh favorites
                      await refetch();

                      // ✅ Optional: force global refresh
                      dispatch(favoriteApi.util.invalidateTags(["Favorites"]));

                      toast.success("Removed from favorites");
                    } catch (error) {
                      console.error("Failed to remove favorite:", error);
                      toast.error("Failed to remove favorite");
                    } finally {
                      setRemovingId(null);
                    }
                  }}
                >
                  {removingId === product._id ? "..." : "💔"}
                </button>
                <img
                  src={product.photos[0].url}
                  alt={product.name}
                  className="favorite-item__image"
                />
                <div className="favorite-item__details">
                  <h4>{product.name}</h4>
                  <p className="price">₹{product.price}</p>
                  <p style={{ fontFamily: "monospace" }}>Don’t wait</p>
                </div>
                <Link to={`/product/${product._id}`}>
                  <button className="buy-now-btn">Explore</button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
