import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    // State for form data
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [tableStyle, setTableStyle] = useState('default');
    const [wholesaleProducts, setWholesaleProducts] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [productsPerPage, setProductsPerPage] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Available columns options
    const columnOptions = [
        { value: 'image', label: 'Image' },
        { value: 'product_name', label: 'Product Name' },
        { value: 'sku', label: 'SKU' },
        { value: 'category', label: 'Category' },
        { value: 'price', label: 'Price' },
        { value: 'in_stock', label: 'Stock Status' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'add_to_cart', label: 'Add to Cart' }
    ];


    // Load initial settings
    useEffect(() => {
        loadSettings();
        loadCategories();
    }, []);

    const loadSettings = async () => {
        try {
            // Replace with actual API call to WordPress
            const response = await fetch('/wp-json/wpt/v1/settings');
            const data = await response.json();
            
            // Mock data for demonstration
            const mockSettings = {
                selected_columns: ['image', 'product_name', 'price'],
                table_style: 'default',
                wholesale_products: 'all',
                category: 'all',
                products_per_page: '10'
            };


            setSelectedColumns(data.selected_columns || []);
            setTableStyle(data.table_style || 'default');
            setWholesaleProducts(data.wholesale_products_opt || 'all');
            setSelectedCategory(data.wholesale_product_category || 'all');
            setProductsPerPage(data.wholesale_product_pp || '');
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading settings:', error);
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            // Replace with actual API call to WordPress
            const response = await fetch('/wp-json/wpt/v1/categories');
            const data = await response.json();
            
            // Check if data is an object and extract categories if they exist
            if (data && data.length) {
                // If data is already an array, set it as categories
                setCategories(data);
            } else if (data && Object.values(data).length) {
                // Convert the response object into an array of category objects
                const categoriesArray = Object.values(data); 
                setCategories(categoriesArray);
            } else {
                // Fallback to an empty array if no categories are found
                setCategories([]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleColumnChange = (columnValue) => {
        setSelectedColumns(prev => {
            if (prev.includes(columnValue)) {
                return prev.filter(col => col !== columnValue);
            } else {
                return [...prev, columnValue];
            }
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const settingsData = {
                selected_columns: selectedColumns,
                table_style: tableStyle,
                wholesale_products_opt: wholesaleProducts,
                wholesale_product_category: selectedCategory,
                wholesale_product_pp: productsPerPage
            };

            // Replace with actual API call to WordPress
            const response = await fetch('/wp-json/wpt/v1/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': wpApiSettings.nonce
                },
                body: JSON.stringify(settingsData)
            });

            // Mock success response
            setTimeout(() => {
                setMessage('Settings saved successfully!');
                setIsLoading(false);
                setTimeout(() => setMessage(''), 3000);
            }, 1000);

        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings. Please try again.');
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (isLoading && !message) {
        return (
            <div className="admin-dashboard">
                <div className="card-board">
                    <h3>Loading...</h3>
                    <p>Please wait while we load your settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="card-board">
                <h1 style={{ fontSize: '23px', fontWeight: '400', margin: '0 0 20px 0', padding: '9px 15px 4px 0', lineHeight: '29px' }}>
                    Wholesale Product Table Settings
                </h1>

                {message && (
                    <div style={{
                        backgroundColor: message.includes('Error') ? '#dc3232' : '#00a32a',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        border: '1px solid transparent'
                    }}>
                        {message}
                    </div>
                )}

                <div>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'separate', 
                        borderSpacing: '0',
                        backgroundColor: '#fff',
                        border: '1px solid #c3c4c7',
                        boxShadow: '0 1px 1px rgba(0,0,0,.04)'
                    }}>
                        <tbody>
                            {/* Column Selection */}
                            <tr style={{ borderBottom: '1px solid #c3c4c7' }}>
                                <th scope="row" style={{
                                    width: '200px',
                                    padding: '20px 10px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    verticalAlign: 'top',
                                    backgroundColor: '#f6f7f7'
                                }}>
                                    Select Columns to Display
                                </th>
                                <td style={{ padding: '20px 10px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {columnOptions.map(option => (
                                            <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={selectedColumns.includes(option.value)}
                                                    onChange={() => handleColumnChange(option.value)}
                                                    style={{ margin: '0' }}
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </td>
                            </tr>

                            {/* Table Style */}
                            <tr style={{ borderBottom: '1px solid #c3c4c7' }}>
                                <th scope="row" style={{
                                    width: '200px',
                                    padding: '20px 10px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    verticalAlign: 'top',
                                    backgroundColor: '#f6f7f7'
                                }}>
                                    Select Table Style
                                </th>
                                <td style={{ padding: '20px 10px' }}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="table_style"
                                                value="default"
                                                checked={tableStyle === 'default'}
                                                onChange={(e) => setTableStyle(e.target.value)}
                                                style={{ margin: '0' }}
                                            />
                                            Default Style
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="table_style"
                                                value="plugin"
                                                checked={tableStyle === 'plugin'}
                                                onChange={(e) => setTableStyle(e.target.value)}
                                                style={{ margin: '0' }}
                                            />
                                            Plugin Style
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            {/* Wholesale Products */}
                            <tr style={{ borderBottom: '1px solid #c3c4c7' }}>
                                <th scope="row" style={{
                                    width: '200px',
                                    padding: '20px 10px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    verticalAlign: 'top',
                                    backgroundColor: '#f6f7f7'
                                }}>
                                    Select Wholesale Products
                                </th>
                                <td style={{ padding: '20px 10px' }}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="wholesale_products"
                                                value="all"
                                                checked={wholesaleProducts === 'all'}
                                                onChange={(e) => setWholesaleProducts(e.target.value)}
                                                style={{ margin: '0' }}
                                            />
                                            All Products
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="wholesale_products"
                                                value="category"
                                                checked={wholesaleProducts === 'category'}
                                                onChange={(e) => setWholesaleProducts(e.target.value)}
                                                style={{ margin: '0' }}
                                            />
                                            Select a Category
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            {/* Category Selection */}
                            {wholesaleProducts === 'category' && (
                                <tr style={{ borderBottom: '1px solid #c3c4c7' }}>
                                    <th scope="row" style={{
                                        width: '200px',
                                        padding: '20px 10px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        verticalAlign: 'top',
                                        backgroundColor: '#f6f7f7'
                                    }}>
                                        Select a Category as Wholesale Product
                                    </th>
                                    <td style={{ padding: '20px 10px' }}>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #8c8f94',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                minWidth: '200px'
                                            }}
                                        >
                                            <option value="all">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category.term_id} value={category.term_id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )}

                            {/* Products Per Page */}
                            <tr>
                                <th scope="row" style={{
                                    width: '200px',
                                    padding: '20px 10px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    verticalAlign: 'top',
                                    backgroundColor: '#f6f7f7'
                                }}>
                                    Products Per Page
                                </th>
                                <td style={{ padding: '20px 10px' }}>
                                    <input
                                        type="text"
                                        value={productsPerPage}
                                        onChange={(e) => setProductsPerPage(e.target.value)}
                                        placeholder="Enter number of products per page"
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #8c8f94',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            width: '200px'
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            style={{
                                backgroundColor: '#2271b1',
                                color: 'white',
                                border: '1px solid #2271b1',
                                borderRadius: '3px',
                                padding: '8px 12px',
                                fontSize: '13px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;