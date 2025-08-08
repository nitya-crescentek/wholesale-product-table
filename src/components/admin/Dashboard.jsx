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
        { value: 'price', label: 'Price' },
        { value: 'category', label: 'Category' },
        { value: 'in_stock', label: 'Stock Status' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'sku', label: 'SKU' },
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

    // Custom styles for react-select
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            padding: '2px 4px',
            border: '1px solid #8c8f94',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '200px',
            minHeight: 'auto'
        })
    };

    return (
        <div className="admin-dashboard">
            <div className="card-board">
                <h1 className="dashboard-title">
                    Wholesale Product Table Settings
                </h1>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'message--error' : 'message--success'}`}>
                        {message}
                    </div>
                )}

                <div className="settings-container">
                    <table className="settings-table">
                        <tbody>
                            {/* Column Selection */}
                            <tr className="settings-row">
                                <th className="settings-header">
                                    Select Columns to Display
                                </th>
                                <td className="settings-content">
                                    <div className="checkbox-group">
                                        {columnOptions.map(option => (
                                            <label key={option.value} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={selectedColumns.includes(option.value)}
                                                    onChange={() => handleColumnChange(option.value)}
                                                    className="checkbox-input"
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </td>
                            </tr>

                            {/* Table Style */}
                            <tr className="settings-row">
                                <th className="settings-header">
                                    Select Table Style
                                </th>
                                <td className="settings-content">
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="table_style"
                                                value="default"
                                                checked={tableStyle === 'default'}
                                                onChange={(e) => setTableStyle(e.target.value)}
                                                className="radio-input"
                                            />
                                            Default Style
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="table_style"
                                                value="plugin"
                                                checked={tableStyle === 'plugin'}
                                                onChange={(e) => setTableStyle(e.target.value)}
                                                className="radio-input"
                                            />
                                            Plugin Style
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            {/* Wholesale Products */}
                            <tr className="settings-row">
                                <th className="settings-header">
                                    Select Wholesale Products
                                </th>
                                <td className="settings-content">
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="wholesale_products"
                                                value="all"
                                                checked={wholesaleProducts === 'all'}
                                                onChange={(e) => setWholesaleProducts(e.target.value)}
                                                className="radio-input"
                                            />
                                            All Products
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="wholesale_products"
                                                value="category"
                                                checked={wholesaleProducts === 'category'}
                                                onChange={(e) => setWholesaleProducts(e.target.value)}
                                                className="radio-input"
                                            />
                                            Select a Category
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            {/* Category Selection */}
                            {wholesaleProducts === 'category' && (
                                <tr className="settings-row">
                                    <th className="settings-header">
                                        Select a Category as Wholesale to Show on Wholesale Table
                                    </th>
                                    <td className="settings-content">
                                        <Select
                                            isMulti
                                            name="selectedCategories"
                                            options={categories.map(cat => ({ 
                                                value: cat.term_id.toString(), 
                                                label: cat.name 
                                            }))}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            value={
                                                selectedCategory && selectedCategory !== 'all' && selectedCategory !== '' 
                                                    ? selectedCategory.split(',').map(catId => {
                                                        const category = categories.find(cat => cat.term_id.toString() === catId.toString());
                                                        return category ? { 
                                                            value: category.term_id.toString(), 
                                                            label: category.name 
                                                        } : null;
                                                    }).filter(option => option !== null)
                                                    : [] // Empty array when nothing selected or when 'all' was previously selected
                                            }
                                            onChange={(selected) => {
                                                const selectedIds = selected ? selected.map(option => option.value) : [];
                                                setSelectedCategory(selectedIds.length > 0 ? selectedIds.join(',') : '');
                                            }}
                                            placeholder="Select categories"
                                            isLoading={isLoading || categories.length === 0}
                                            isClearable
                                            closeMenuOnSelect={false}
                                            styles={selectStyles}
                                        />
                                        <span className="info-text">
                                            Note: If no category is selected, all products will be shown.
                                        </span>
                                    </td>
                                </tr>
                            )}

                            {/* Products Per Page */}
                            <tr className="settings-row">
                                <th className="settings-header">
                                    Products Per Page
                                </th>
                                <td className="settings-content">
                                    <input
                                        type="text"
                                        value={productsPerPage}
                                        onChange={(e) => setProductsPerPage(e.target.value)}
                                        placeholder="Enter number of products per page"
                                        className="text-input"
                                    />
                                </td>
                            </tr>

                            {/* Wholesale discount */}
                            <tr className="settings-row">
                                <th className="settings-header">
                                    Wholesale Discount ?
                                </th>
                                <td className="settings-content">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={EnableDiscount}
                                            checked={EnableDiscount === 'wholesale_discount_on'}
                                            onChange={() => setEnableDiscount(EnableDiscount === 'wholesale_discount_on' ? 'wholesale_discount_off' : 'wholesale_discount_on')}
                                            className="checkbox-input"
                                        />
                                        Enable Wholesale Discount
                                    </label>
                                </td>
                            </tr>

                            { EnableDiscount === 'wholesale_discount_on' && (
                            <>
                                <tr className="settings-row">
                                    <th className="settings-header">
                                        Wholesale Discount Type
                                    </th>
                                    <td className="settings-content">
                                        <select
                                            value={wholesaleDiscountType} 
                                            onChange={(e) => setWholesaleDiscountType(e.target.value)}
                                            className="select-input"
                                        >
                                            <option value="percentage">Percentage</option> 
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </td>
                                </tr>

                                <tr className="settings-row">
                                    <th className="settings-header">
                                        Wholesale Discount Value
                                    </th>
                                    <td className="settings-content">
                                        <input
                                            type="text"
                                            value={wholesaleDiscountValue}
                                            onChange={(e) => setWholesaleDiscountValue(e.target.value)}
                                            placeholder="Enter discount value"
                                            className="text-input"
                                        />
                                    </td>
                                </tr>

                                <tr className="settings-row">
                                    <th className="settings-header">
                                        Include Categories for Discount
                                    </th>
                                    <td className="settings-content">
                                        <Select
                                            isMulti
                                            name="includeCategories"
                                            options={categories.map(cat => ({ 
                                                value: cat.term_id.toString(), 
                                                label: cat.name 
                                            }))}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
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
                                        <span className="info-text">
                                            Note: If no categories are selected, all products will be eligible for the discount.
                                        </span>
                                    </td>
                                </tr>

                                <tr className="settings-row">
                                    <th className="settings-header">
                                        Exclude Categories from Discount
                                    </th>
                                    <td className="settings-content">
                                        <Select
                                            isMulti
                                            name="excludeCategories"
                                            options={categories.map(cat => ({ 
                                                value: cat.term_id.toString(), 
                                                label: cat.name 
                                            }))}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
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

                    <div className="button-container">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`save-button ${isLoading ? 'save-button--loading' : ''}`}
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