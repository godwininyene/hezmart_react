import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";

const AddProduct = () => {
  const [hasMultipleOptions, setHasMultipleOptions] = useState(true);
  const [isDigitalItem, setIsDigitalItem] = useState(true);
  const [tags, setTags] = useState(["T-Shirt", "Mem Clothes", "Summer Collection"]);
  const [newTag, setNewTag] = useState("");
  
  // Categories data structure
  const categories = {
    "Women": ["T-Shirt", "Dress", "Jeans", "Skirt"],
    "Men": ["T-Shirt", "Shirt", "Jeans", "Shorts"],
    "Kids": ["T-Shirt", "Dress", "Jeans", "Shorts"],
    "Accessories": ["Bags", "Watches", "Jewelry", "Hats"]
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setAvailableSubcategories(categories[category] || []);
    setSelectedSubcategory("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <Link to="/manage-products">
          <button className="text-primary-dark font-medium">Back</button>
        </Link>
      </div>

      {/* Product Form */}
      <form className="space-y-6">
        {/* Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Information</h2>
          <div className="space-y-4">
            <InputField
              label="Product Name"
              placeholder="Summer T-Shirt"
              name="productName"
            />
            <InputField
              label="Product Description"
              placeholder="Product description"
              name="productDescription"
              as="textarea"
            />
          </div>
        </div>

        {/* Categories Section - Updated */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Main Category"
              options={Object.keys(categories)}
              onChange={(e) => handleCategoryChange(e.target.value)}
              value={selectedCategory}
              placeholder="Select a category"
            />
            
            <SelectField
              label="Subcategory"
              options={availableSubcategories}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              value={selectedSubcategory}
              placeholder={selectedCategory ? "Select a subcategory" : "Select main category first"}
              disabled={!selectedCategory}
            />
          </div>
         
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>
          <div className="space-y-4">
            {/* Cover Image */}
            <div>
              <label className="block text-md text-[#5A607F] mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" id="cover-image" className="hidden" />
                <label
                  htmlFor="cover-image"
                  className="cursor-pointer text-primary-dark font-medium"
                >
                  + Add File
                </label>
                <p className="text-gray-500 mt-2">or drag and drop files</p>
              </div>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-md text-[#5A607F] mb-2">Additional Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" id="additional-images" className="hidden" multiple />
                <label
                  htmlFor="additional-images"
                  className="cursor-pointer text-primary-dark font-medium"
                >
                  + Add File
                </label>
                <p className="text-gray-500 mt-2">or drag and drop files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
          <div>
            <InputField
              placeholder="Enter tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Price</h2>
          <div className="space-y-4">
            <InputField
              label="Product Price"
              placeholder="Enter price"
              name="price"
              type="number"
            />
            <InputField
              label="Discount Price"
              placeholder="Price at Discount"
              name="discountPrice"
              type="number"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-dark rounded"
              />
              <span>Add tax for this product</span>
            </label>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <InputField label="Title" name="seoTitle" />
            <InputField label="Description" name="seoDescription" as="textarea" />
          </div>
        </div>

        {/* Variant Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Different Options</h2>
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={hasMultipleOptions}
              onChange={() => setHasMultipleOptions(!hasMultipleOptions)}
              className="h-4 w-4 text-primary-dark rounded"
            />
            <span>This product has multiple options</span>
          </label>

          {hasMultipleOptions && (
            <div className="space-y-4">
              <div>
                <InputField label="Option 1" placeholder="Size" defaultValue="Size" />
                <div className="mt-2">
                  <label className="block text-md text-[#5A607F] mb-1">Value</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                      S <span className="ml-1 cursor-pointer">×</span>
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                      M <span className="ml-1 cursor-pointer">×</span>
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                      L <span className="ml-1 cursor-pointer">×</span>
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                      XL <span className="ml-1 cursor-pointer">×</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Add More"
                      className="border-b-2 border-gray-300 px-2 py-1 focus:outline-none focus:border-primary-dark"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="text-primary-dark font-medium text-sm"
              >
                + Add Another Option
              </button>
            </div>
          )}
        </div>

        {/* Shipping Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping</h2>
          <div className="space-y-4">
            <InputField
              label="Weight (kg)"
              placeholder="Enter Weight"
              name="weight"
              type="number"
            />
            <SelectField
              label="Country"
              options={["Select Country", "USA", "UK", "Canada", "Australia"]}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isDigitalItem}
                onChange={() => setIsDigitalItem(!isDigitalItem)}
                className="h-4 w-4 text-primary-dark rounded"
              />
              <span>This is digital item</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
          >
            Cancel
          </button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;