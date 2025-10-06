import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";
import { useLocation } from "react-router-dom";
import Select from "react-select";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(10000); // default max price
  const [genderType, setGenderType] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category") || "";
  const sortFromURL = queryParams.get("sort") || "";
  const [showFilters, setShowFilters] = useState(false);

  const genderFromURL = queryParams.get("genderType") || "";

  const categoryOptions = [
  { label: "ALL", value: "" }, // 👈 Static option first
  ...(categoriesResponse?.categories?.map((i) => ({
    label: i.toUpperCase(),
    value: i,
      })) || [])
    ];


  const sortOptions = [
    { value: "", label: "None" },
    { value: "asc", label: "Price (Low to High)" },
    { value: "dsc", label: "Price (High to Low)" },
  ];

  const genderOptions = [
  { value: "", label: "All" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
    ];

  useEffect(() => {
    setCategory(categoryFromURL);
  }, [categoryFromURL]);

  useEffect(() => {
  setCategory(categoryFromURL);
  setSort(sortFromURL);
}, [categoryFromURL, sortFromURL]);

useEffect(() => {
  setCategory(categoryFromURL);
  setSort(sortFromURL);
  setGenderType(genderFromURL);
}, [categoryFromURL, sortFromURL, genderFromURL]);

  const dispatch = useDispatch();

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice, // interpreted as max price
    genderType,
  });

  const addToCardHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock!");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = searchedData && page < searchedData.totalPage;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
   <div className="search-page">
    <div className="filter-panel-wrapper">
      <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-block" style={{ zIndex: 5 }}>
            <h4>Sort</h4>
            <Select
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === sort)}
              onChange={(selected) => setSort(selected?.value || "")}
              placeholder="Sort by Price"
              styles={{
                container: (base) => ({ ...base, width: "100%" }),
                control: (base) => ({
                  ...base,
                  borderRadius: "6px",
                  borderColor: "#ccc",
                  padding: "2px",
                }),
              }}
            />
          </div>

          <div className="filter-block" style={{ zIndex: 0 }}>
            <h4>Max Price: ₹{maxPrice}</h4>
            <input
              type="range"
              min={99}
              max={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="filter-block">
            <h4>Category</h4>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((opt) => opt.value === category)}
              onChange={(selected) => setCategory(selected?.value || "")}
              placeholder="Select Category"
              isSearchable
              styles={{
                container: (base) => ({ ...base, width: "100%" }),
                control: (base) => ({
                  ...base,
                  borderRadius: "6px",
                  borderColor: "#ccc",
                  padding: "2px",
                }),
              }}
            />
          </div>

          <div className="filter-block" >
            <h4>Style Preference</h4>
            <Select
            options={genderOptions}
            value={genderOptions.find((opt) => opt.value === genderType)}
            onChange={(selected) => setGenderType(selected?.value || "")}
            placeholder="Select Gender"
            getOptionLabel={(e) => e.label.toUpperCase()} // ✅ This handles both dropdown and selected display
            styles={{
              container: (base) => ({ ...base, width: "100%" }),
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                borderColor: "#ccc",
                padding: "2px",
              }),
            }}
          />
          </div>
        </div>
      )}

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by Name.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton length={12} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCardHandler}
                photos={i.photos}
                materialType={i.materialType}
                size={i.size}
                fakePrice={i.fakePrice}
                off={i.off}
                color={i.color}
                pocket={i.pocket}
                gsm={i.gsm}
                genderType={i.genderType}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  </div>
  );
};

export default Search;
