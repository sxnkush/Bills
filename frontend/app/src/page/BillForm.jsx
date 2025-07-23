import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import getBillPDFSiya from "../services/getBillPDFSiya";
import getBillPDFKrishna from "../services/getBillPDFKrishna";

export default function BillForm() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [totalAmount, setTotalAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [loaderError, setLoaderError] = useState(false);
  const [loaderSuccess, setLoaderSuccess] = useState(false);
  const [items, setItems] = useState({
    firmName: "",
    address: "",
    gstin: "",
    contractId: "",
    customerName: "",
    itemsAdded: [{ productName: "", quantity: 0, price: 0, total: 0 }],
    contact: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const handleAddItem = () => {
    setItems({
      ...items,
      itemsAdded: [
        ...items.itemsAdded,
        { productName: "", quantity: 0, price: 0, total: 0 },
      ],
    });
  };

  const handleChangeItem = (index, field, value) => {
    const updatedItems = items.itemsAdded.map((item, idx) => {
      //if you use curly braces then u need to use return statemnt else it wnot automatically return ig not using curly braces no need for return
      let total = item.total;
      if (field === "price") total = Number(item.quantity) * Number(value);
      else total = Number(item.price) * Number(value);

      return index === idx ? { ...item, [field]: value, total: total } : item;
    });
    setItems({ ...items, itemsAdded: updatedItems });
  };
  const handleDelete = (index) => {
    const deletedItems = items.itemsAdded.filter((item, idx) => idx !== index);

    setItems({ ...items, itemsAdded: deletedItems });
  };

  useEffect(() => {
    const savedItems = localStorage.getItem("billformdetails");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    //Here we need to define loading as next useEffect is triggerred, it is using default value of useState (that as no data) before setting of that state here above- (setItems(JSON.parse(savedItems)))
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading)
      localStorage.setItem("billformdetails", JSON.stringify(items));
  }, [items, isLoading]);

  useEffect(() => {
    let total = 0;
    items.itemsAdded.map((item) => (total += Number(item.total)));
    setTotalAmount(total);
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/bill/`, items, {
        withCredentials: true,
      });

      if (items.firmName === "Siya Traders")
        await getBillPDFSiya(items, totalAmount, "generate");
      else await getBillPDFKrishna(items, totalAmount, "generate");
      setLoader(false);
      if (res.status === 200) setLoaderSuccess(true);

      const timeout = setTimeout(() => setLoaderSuccess(false), 1500);
      setItems({
        firmName: "",
        address: "",
        gstin: "",
        contractId: "",
        customerName: "",
        itemsAdded: [{ productName: "", quantity: 0, price: 0, total: 0 }],
        contact: "",
      });

      return () => clearTimeout(timeout);
    } catch (err) {
      console.log("Error in POST route frontend", err);
      setLoader(false);
      setLoaderError(true);
      const timeout = setTimeout(() => setLoaderError(false), 1500);
      return () => clearTimeout(timeout);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-10 ">
      <h1 className="text-3xl font-bold text-center">Bill Form</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-5 w-full max-w-4xl px-4"
      >
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <label
            htmlFor="firmName"
            className="font-semibold text-lg w-full md:w-1/4"
          >
            Firm Name
          </label>
          <select
            name="firmName"
            id="firmName"
            onChange={(e) => setItems({ ...items, firmName: e.target.value })}
            className="border-2 border-black rounded-lg p-2 w-full"
          >
            <option value="">Select</option>
            <option value="Siya Traders">Siya Traders</option>
            <option value="Krishna Enterprises">Krishna Enterprises</option>
          </select>
        </div>

        {items.firmName === "Siya Traders" &&
          [
            { label: "Customer Name", key: "customerName" },
            { label: "Address", key: "address" },
            { label: "GSTIN", key: "gstin" },
            { label: "Contract ID", key: "contractId" },
            { label: "Contact Number", key: "contact" },
          ].map(({ label, key }) => (
            <div
              key={key}
              className="flex flex-col md:flex-row gap-5 items-center"
            >
              <label
                htmlFor={key}
                className="font-semibold text-lg w-full md:w-1/4"
              >
                {label}
              </label>
              <input
                type={key === "contact" ? "number" : "text"}
                name={key}
                id={key}
                value={items[key]}
                className="border-2 border-black rounded-lg p-2 w-full"
                onChange={(e) => {
                  setItems({ ...items, [key]: e.target.value });
                }}
              />
            </div>
          ))}

        <div>
          <h1 className="font-bold text-lg">Add Items</h1>
          <div className="flex flex-col gap-4">
            {items.itemsAdded.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row flex-wrap gap-4 p-2 border border-gray-300 rounded-md"
              >
                {[
                  { label: "Product Name", key: "productName", type: "text" },
                  { label: "Quantity", key: "quantity", type: "number" },
                  { label: "Price (in Rs.)", key: "price", type: "number" },
                ].map(({ label, key, type }) => (
                  <div
                    key={key}
                    className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto"
                  >
                    <label
                      htmlFor={key}
                      className="font-semibold text-lg md:w-36"
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      name={key}
                      id={key}
                      value={item[key]}
                      onChange={(e) =>
                        handleChangeItem(idx, key, e.target.value)
                      }
                      className="border-2 border-black rounded-lg p-2 w-full md:w-36"
                    />
                  </div>
                ))}
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <label
                    htmlFor="total"
                    className="font-semibold text-lg md:w-24"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={Number(item.quantity) * Number(item.price)}
                    className="border-2 border-black rounded-lg p-2 w-full md:w-36 hover:cursor-not-allowed"
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(idx)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg w-full md:w-auto"
          >
            Add +
          </button>
          <div>
            <span className="text-lg font-semibold">
              Total Amount (in Rs):{" "}
            </span>
            <span className="border-2 border-black rounded-md p-2">
              {totalAmount}/-
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg w-full md:w-auto"
          >
            Create Bill
          </button>
          <button
            type="button"
            onClick={() => {
              if (items.firmName === "Siya Traders")
                getBillPDFSiya(items, totalAmount, "");
              else getBillPDFKrishna(items, totalAmount, "");
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-3 rounded-lg w-full md:w-auto"
          >
            Preview
          </button>
        </div>
      </form>

      {loader ? <div className="absolute top-10">Loading...</div> : null}
      {loaderError ? <div className="absolute top-10">Failed</div> : null}
      {loaderSuccess ? (
        <div className="absolute top-10">Bill Generated</div>
      ) : null}
    </div>
  );
}
