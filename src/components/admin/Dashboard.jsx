import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const Dashboard = () => {
    // State for form data
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [tableStyle, setTableStyle] = useState('default');
    const [wholesaleProducts, setWholesaleProducts] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [productsPerPage, setProductsPerPage] = useState('');
    const [categories, setCategories] = useState([]);
    const [EnableDiscount, setEnableDiscount] = useState('wholesale_discount_off');
    const [wholesaleDiscountType, setWholesaleDiscountType] = useState('percentage');
    const [wholesaleDiscountValue, setWholesaleDiscountValue] = useState('');
    const [includeCategories, setIncludeCategories] = useState('');
    const [excludeCategories, setExcludeCategories] = useState('');
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

            // Parse exclude categories if it's a string
            let excludeCategories = [];
            if (data.wpt_exclude_categories) {
                if (typeof data.wpt_exclude_categories === 'string' && data.wpt_exclude_categories.trim()) {
                    excludeCategories = data.wpt_exclude_categories.split(',')
                        .map(id => id.trim())
                        .filter(id => id); // Remove empty strings
                } else if (Array.isArray(data.wpt_exclude_categories)) {
                    excludeCategories = data.wpt_exclude_categories.map(id => id.toString());
                }
            }
            let includeCategories = [];
            if (data.wpt_include_categories) {
                if (typeof data.wpt_include_categories === 'string' && data.wpt_include_categories.trim()) {
                    includeCategories = data.wpt_include_categories.split(',')
                        .map(id => id.trim())
                        .filter(id => id); // Remove empty strings
                } else if (Array.isArray(data.wpt_include_categories)) {
                    includeCategories = data.wpt_include_categories.map(id => id.toString());
                }
            }

            // Mock data for demonstration
            const mockSettings = {
                selected_columns: ['image', 'product_name', 'price'],
                table_style: 'default',
                wholesale_products: 'all',
                category: 'all',
                products_per_page: '10',
                wholesale_discount: 'wholesale_discount_off',
                wholesale_discount_type: 'percentage',
                wholesale_discount_value: '',
                include_categories: '',
                exclude_categories: ''
            };


            setSelectedColumns(data.selected_columns || []);
            setTableStyle(data.table_style || 'default');
            setWholesaleProducts(data.wholesale_products_opt || 'all');
            setSelectedCategory(data.wholesale_product_category || 'all');
            setProductsPerPage(data.wholesale_product_pp || '');
            setIsLoading(false);
            setEnableDiscount(data.wpt_enabled_wholesale_discount || 'wholesale_discount_off');
            setWholesaleDiscountType(data.wpt_wholesale_discount_type || 'percentage'); // Default value
            setWholesaleDiscountValue(data.wpt_wholesale_discount_value || ''); // Default value
            setIncludeCategories(includeCategories);
            setExcludeCategories(excludeCategories);

            // If the data is not in the expected format, use mock data
            if (!data.selected_columns || !data.table_style || !data.wholesale_products_opt) {
                setSelectedColumns(mockSettings.selected_columns);
                setTableStyle(mockSettings.table_style);
                setWholesaleProducts(mockSettings.wholesale_products);
                setSelectedCategory(mockSettings.category);
                setProductsPerPage(mockSettings.products_per_page);
                setEnableDiscount(mockSettings.wholesale_discount);
                setWholesaleDiscountType(mockSettings.wholesale_discount_type);
                setWholesaleDiscountValue(mockSettings.wholesale_discount_value);
                setIncludeCategories(mockSettings.include_categories);
                setExcludeCategories(mockSettings.exclude_categories);
            }
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
                wholesale_product_pp: productsPerPage,
                wpt_enabled_wholesale_discount: EnableDiscount,
                wpt_wholesale_discount_type: wholesaleDiscountType,
                wpt_wholesale_discount_value: wholesaleDiscountValue,
                wpt_include_categories: includeCategories.join(','), // Join array to string for API
                wpt_exclude_categories: excludeCategories.join(',') // Join array to string for API
            };

            // console.log('Settings Data:', settingsData);
            // return false;


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

    // if (isLoading && !message) {
    //     return (
    //         <div className="admin-dashboard">
    //             <div className="card-board">
    //                 <h3>Loading...</h3>
    //                 <p>Please wait while we load your settings.</p>
    //             </div>
    //         </div>
    //     );
    // }

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
                                        <Select
                                            isMulti
                                            name="selectedCategories"
                                            options={[
                                                { value: 'all', label: 'All Categories' },
                                                ...categories.map(cat => ({ 
                                                    value: cat.term_id.toString(), 
                                                    label: cat.name 
                                                }))
                                            ]}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={
                                                selectedCategory === 'all' 
                                                    ? [{ value: 'all', label: 'All Categories' }]
                                                    : selectedCategory.split(',').map(catId => {
                                                        const category = categories.find(cat => cat.term_id.toString() === catId.toString());
                                                        return category ? { 
                                                            value: category.term_id.toString(), 
                                                            label: category.name 
                                                        } : null;
                                                    }).filter(option => option !== null)
                                            }
                                            onChange={(selected) => {
                                                if (!selected || selected.length === 0) {
                                                    setSelectedCategory('all');
                                                } else if (selected.find(item => item.value === 'all')) {
                                                    setSelectedCategory('all');
                                                } else {
                                                    const selectedIds = selected.map(option => option.value);
                                                    setSelectedCategory(selectedIds.join(','));
                                                }
                                            }}
                                            placeholder="Select categories"
                                            isLoading={isLoading || categories.length === 0}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    padding: '2px 4px',
                                                    border: '1px solid #8c8f94',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    minWidth: '200px',
                                                    minHeight: 'auto'
                                                })
                                            }}
                                        />
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

                            {/* Wholesale discount */}
                            <tr>
                                <th scope="row" style={{
                                    width: '200px',
                                    padding: '20px 10px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    verticalAlign: 'top',
                                    backgroundColor: '#f6f7f7'
                                }}>
                                    Wholesale Discount ?
                                </th>
                                <td style={{ padding: '20px 10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            value={EnableDiscount}
                                            checked={EnableDiscount === 'wholesale_discount_on'}
                                            onChange={() => setEnableDiscount(EnableDiscount === 'wholesale_discount_on' ? 'wholesale_discount_off' : 'wholesale_discount_on')}
                                            style={{ margin: '0' }}
                                        />
                                        Enable Wholesale Discount
                                    </label>
                                </td>
                            </tr>

                            { EnableDiscount === 'wholesale_discount_on' && (
                            <>
                                <tr>
                                    <th scope="row" style={{
                                        width: '200px',
                                        padding: '20px 10px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        verticalAlign: 'top',
                                        backgroundColor: '#f6f7f7'
                                    }}>
                                        Wholesale Discount Type
                                    </th>
                                    <td style={{ padding: '20px 10px' }}>
                                        <select
                                            value={wholesaleDiscountType} 
                                            onChange={(e) => setWholesaleDiscountType(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #8c8f94',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                minWidth: '200px'
                                            }}
                                        >
                                            <option value="percentage">Percentage</option> 
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row" style={{
                                        width: '200px',
                                        padding: '20px 10px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        verticalAlign: 'top',
                                        backgroundColor: '#f6f7f7'
                                    }}>
                                        Wholesale Discount Value
                                    </th>
                                    <td style={{ padding: '20px 10px' }}>
                                        <input
                                            type="text"
                                            value={wholesaleDiscountValue}
                                            onChange={(e) => setWholesaleDiscountValue(e.target.value)}
                                            placeholder="Enter discount value"
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

                                <tr>
                                    <th scope="row" style={{
                                        width: '200px',
                                        padding: '20px 10px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        verticalAlign: 'top',
                                        backgroundColor: '#f6f7f7'
                                    }}>
                                        Include Categories
                                    </th>
                                    <td style={{ padding: '20px 10px' }}>

                                        <Select
                                            isMulti
                                            name="includeCategories"
                                            options={categories.map(cat => ({ 
                                                value: cat.term_id.toString(), 
                                                label: cat.name 
                                            }))}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={
                                                // Safety check: ensure includeCategories is array and categories is loaded
                                                (Array.isArray(includeCategories) && categories.length > 0) 
                                                    ? includeCategories
                                                        .map(catId => {
                                                            const category = categories.find(cat => cat.term_id.toString() === catId.toString());
                                                            return category ? { 
                                                                value: category.term_id.toString(), 
                                                                label: category.name 
                                                            } : null;
                                                        })
                                                        .filter(option => option !== null)
                                                    : [] // Empty array if not ready
                                            }
                                            onChange={(selected) => {
                                                const selectedIds = selected ? selected.map(option => option.value.toString()) : [];
                                                setIncludeCategories(selectedIds);
                                            }}
                                            placeholder="Select categories to include"
                                            isLoading={isLoading || categories.length === 0} // Show loading while data loads
                                        />

                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row" style={{
                                        width: '200px',
                                        padding: '20px 10px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        verticalAlign: 'top',
                                        backgroundColor: '#f6f7f7'
                                    }}>
                                        Exclude Categories
                                    </th>
                                    <td style={{ padding: '20px 10px' }}>
                                        <Select
                                            isMulti
                                            name="excludeCategories"
                                            options={categories.map(cat => ({ 
                                                value: cat.term_id.toString(), 
                                                label: cat.name 
                                            }))}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={
                                                // Safety check: ensure excludeCategories is array and categories is loaded
                                                (Array.isArray(excludeCategories) && categories.length > 0) 
                                                    ? excludeCategories
                                                        .map(catId => {
                                                            const category = categories.find(cat => cat.term_id.toString() === catId.toString());
                                                            return category ? { 
                                                                value: category.term_id.toString(), 
                                                                label: category.name 
                                                            } : null;
                                                        })
                                                        .filter(option => option !== null)
                                                    : [] // Empty array if not ready
                                            }
                                            onChange={(selected) => {
                                                const selectedIds = selected ? selected.map(option => option.value.toString()) : [];
                                                setExcludeCategories(selectedIds);
                                            }}
                                            placeholder="Select categories to exclude"
                                            isLoading={isLoading || categories.length === 0} // Show loading while data loads
                                        />
                                    </td>
                                </tr>
                            </>
                            )}
                        
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