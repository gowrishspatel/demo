import React, { useEffect, useState } from "react";
import tableApi from "../api/tableApi";
import Pagination from "../component/Pagination";
import './table.css';
import CustomMessage from "../component/CustomMessage";

const Index = () => {
    const [products, setProducts] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [dialogImage, setDialogImage] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const productsData = await tableApi.fetchProducts();
            setProducts(productsData);
        } catch (err) { }
    };

    const header = [
        "id",
        'title',
        "description",
        'category',
        'price',
        'stock',
        'brand',
        'rating',
        'thumbnail'
    ];

    const headers = ["Select", ...header];

    const handleCheckboxChange = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    const handleSelectAllChange = () => {
        const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
        if (selectAll) {
            setSelectedRows((prevSelectedRows) =>
                prevSelectedRows.filter((rowId) =>
                    !currentProducts.some((product) => product.id === rowId)
                )
            );
        } else {
            setSelectedRows((prevSelectedRows) => [
                ...prevSelectedRows,
                ...currentProducts
                    .map((product) => product.id)
                    .filter((id) => !prevSelectedRows.includes(id)),
            ]);
        }
        setSelectAll(!selectAll);
    };

    const DeleteRow = () => {
        const updatedProducts = products.filter(
            (product) => !selectedRows.includes(product.id)
        );
        setProducts(updatedProducts);
        setMessage(`${selectedRows.length > 1 ? selectedRows.length + " products were deleted" : selectedRows.length + " product was deleted"}`);
        setSelectedRows([]);
    };

    const searchProducts = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const openImageDialog = (imgUrl) => {
        setDialogImage(imgUrl);
    };

    const closeImageDialog = () => {
        setDialogImage(null);
    };

    return (
        <>
            <div className="search-content">
                <input
                    className="search-box"
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={searchProducts}
                />
            </div>
            <div className="table-content">
                <div className="table-body">
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        style={{
                                            width: header === "Select" ? "3%" : header === "id" ? "3%" : `${100 / headers.length - 1}%`
                                        }}
                                    >
                                        {header === "Select" ? (
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAllChange}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ) : (
                                            header.charAt(0).toUpperCase() + header.slice(1)
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr
                                            className={selectedRows.includes(product.id) ? "selected-row" : ""}
                                        >
                                            {headers.map((key) => (
                                                <td key={key}>
                                                    {key === "Select" ? (
                                                        <input
                                                            className="checkBox"
                                                            type="checkbox"
                                                            checked={selectedRows.includes(product.id)}
                                                            onChange={() => handleCheckboxChange(product.id)}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    ) : key === "thumbnail" ? (
                                                        <img
                                                            src={product[key]}
                                                            alt={product.title}
                                                            onClick={() => openImageDialog(product[key])}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    ) : key === "description" ? (
                                                        <span
                                                            title={product[key].length > 100 ? product[key] : ""}
                                                            style={{
                                                                cursor: product[key].length > 100 ? "pointer" : "default",
                                                            }}
                                                        >
                                                            {product[key].length > 100
                                                                ? `${product[key].slice(0, 100)}...`
                                                                : product[key]}
                                                        </span>
                                                    ) : (
                                                        product[key]?.toString()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Divider Row */}
                                        <tr>
                                            <td colSpan={headers.length} style={{ padding: "0px" }}>
                                                <div className="faded_devider"></div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} style={{ textAlign: "center" }}>
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer">
                    <div>
                        <button
                            className="delete"
                            type="button"
                            onClick={DeleteRow}
                            disabled={selectedRows.length <= 0 ? true : false}
                        >
                            Delete selected
                        </button>
                    </div>
                    <div className="pagination-content">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    <div style={{ width: "30%", display: "flex", justifyContent: "flex-end" }}>
                        {message !== "" && (
                            <CustomMessage message={message} setMessage={setMessage} />
                        )}
                    </div>
                </div>
            </div>

            {dialogImage && (
                <div className="image-dialog" onClick={closeImageDialog}>
                    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                        <img src={dialogImage} alt="Dialog" class="imagestyle" />
                    </div>
                </div>
            )}


        </>
    );
};

export default Index;
