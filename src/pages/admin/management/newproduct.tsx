import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/feautures";
import { useNavigate } from "react-router-dom";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [fakePrice, setFakePrice] = useState<number>(0);
  const [off, setOff] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [materialType, setMaterialType] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [pocket, setPocket] = useState<string>("");
  const [gsm, setGsm] = useState<string>("");
  const [genderType, setgenderType] = useState<string>("");

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();
  const photos = useFileHandler("multiple", 20, 10);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      if (!name || !price || stock < 0 || !category) return;
      if (!photos.file || photos.file.length === 0) return;

      const formData = new FormData();
      formData.set("name", name);
      formData.set("price", price.toString());
      formData.set("fakePrice", fakePrice.toString());
      formData.set("off", off.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);
      formData.set("materialType", materialType);
      formData.set("size", size.toUpperCase());
      formData.set("description", description);
      formData.set("color", color);
      formData.set("pocket", pocket);
      formData.set("gsm", gsm);
      formData.set("genderType", genderType);

      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({ id:user?._id!, formData }); // ✅ No manual UID
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>

            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Fake Price</label>
              <input
                required
                type="number"
                placeholder="Fake Price"
                value={fakePrice}
                onChange={(e) => setFakePrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Off</label>
              <input
                required
                type="number"
                placeholder="Off"
                value={off}
                onChange={(e) => setOff(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="oversized,polo,shirt,hoodie,cap,.."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Material Type</label>
              <input
                required
                type="text"
                placeholder="eg.Cotton,Polyster,.."
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
              />
            </div>

            <div>
              <label>Available Sizes</label>
              <input
                required
                type="text"
                placeholder="eg.L,..."
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>

            <div>
              <label>Color</label>
              <input
                required
                type="text"
                placeholder="eg.White,Black,Red,.."
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div>
              <label>Which Gender</label>
              <input
                required
                type="text"
                placeholder="eg.male or female"
                value={genderType}
                onChange={(e) => setgenderType(e.target.value)}
              />
            </div>

            <div>
              <label>Pocket</label>
              <input
                required
                type="text"
                placeholder="eg.No Pocket, Pocket"
                value={pocket}
                onChange={(e) => setPocket(e.target.value)}
              />
            </div>

            <div>
              <label>GSM</label>
              <input
                required
                type="text"
                placeholder="eg.190,200,.."
                value={gsm}
                onChange={(e) => setGsm(e.target.value)}
              />
            </div>

            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Photos</label>
              <input required type="file" multiple onChange={photos.changeHandler} />
            </div>

            {photos.error && <p>{photos.error}</p>}

            {photos.preview && (
              <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
                {photos.preview.map((img, i) => (
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
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;