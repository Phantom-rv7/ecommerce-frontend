import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast, transformImage } from "../../../utils/feautures";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useProductDetailsQuery(params.id!);

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const photosFiles = useFileHandler("multiple", 20, 10);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    fakePrice: 0,
    off: 0,
    stock: 0,
    category: "",
    materialType: "",
    size: "",
    color: "",
    pocket: "",
    gsm: "",
    genderType:"",
  });

  useEffect(() => {
    if (data?.product) {
      const {
        name,
        description,
        price,
        fakePrice,
        off,
        stock,
        category,
        materialType,
        size,
        color,
        genderType,
        pocket,
        gsm,
      } = data.product;

      setFormState({
        name,
        description,
        price,
        fakePrice,
        off,
        stock,
        category,
        materialType,
        size,
        color,
        pocket,
        gsm,
        genderType,
      });
    }
  }, [data]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formData.set(key, value.toString());
      });

      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

        const res = await updateProduct({
          formData,
          userId:user?._id!, 
          productId:data?.product._id!,
        })

        responseToast(res, navigate, "/admin/product")
        } catch (error) {
            console.log(error);
          } finally {
            setBtnLoading(false);
          }
};

 const deleteHandler = async () => {
  setDeleteLoading(true); // ✅ start loading

  try {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    setDeleteLoading(false); // ✅ end loading
  }
};


  if (isError) return <Navigate to="/404" />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            {data?.product && (
              <section>
                <strong>ID - {data.product._id}</strong>
                <img src={transformImage(data.product.photos?.[0]?.url)} alt="Product" />
                <p>{formState.name}</p>
                {formState.stock > 0 ? (
                  <span className="green">{formState.stock} Available</span>
                ) : (
                  <span className="red">Not Available</span>
                )}
                <h3>₹{formState.price}</h3>
              </section>
            )}

            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>

              <form onSubmit={submitHandler}>
                <h2>Manage</h2>

                {Object.entries(formState).map(([key, value]) => (
                  <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type={typeof value === "number" ? "number" : "text"}
                      placeholder={key}
                      value={value}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          [key]:
                            typeof value === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}

                <div>
                  <label>Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={photosFiles.changeHandler}
                  />
                </div>

                {photosFiles.error && <p>{photosFiles.error}</p>}

                {photosFiles.preview && (
                  <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
                    {photosFiles.preview.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="New Image"
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                )}

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
