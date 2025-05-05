import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaEllipsisV, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const ShopManager = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch vendors from API
  const fetchVendors = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      let url = `api/v1/users?role=vendor&page=${page} &limit=${pagination.perPage}&search=${search}&fields=firstName,lastName,email,status,id,primaryAddress,primaryPhone,businessName,businessLogo`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const res = await axios.get(url);
      
      if (res.data.status === 'success') {
        setShops(res.data.data.users.map(user => ({
          id: user.id,
          name: user.businessName,
          owner: `${user.firstName} ${user.lastName}`,
          logo:user.businessLogo,
          email: user.email,
          mobile: user.primaryPhone,
          category: user.category?.name || 'Uncategorized',
          address: user.primaryAddress,
          status: user.status
        })));
        
        setPagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems,
          perPage: res.data.pagination.perPage
        });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors(1, searchQuery, activeTab === 'all' ? '' : activeTab);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchVendors(page, searchQuery, activeTab === 'all' ? '' : activeTab);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchVendors(1, searchQuery, tab === 'all' ? '' : tab);
  };

  // Update vendor status
  const updateStatus = async (vendorId, newStatus) => {
    setStatusUpdating(vendorId);
    setStatusError(null);
    
    try {
      const res = await axios.patch(`api/v1/users/${vendorId}/status`, { status: newStatus });
      
      if (res.data.status === 'success') {
        toast.success(`Status updated successfully`);
        fetchVendors(pagination.currentPage, searchQuery, activeTab === 'all' ? '' : activeTab);
      } else {
        toast.warning(res.data.message || 'Status updated with warning');
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.status === 'fail') {
        if (errorData.errors?.status) {
          setStatusError(`Invalid status: ${errorData.errors.status}`);
        } else if (errorData.errors?.message) {
          setStatusError(errorData.errors.message);
        } else {
          setStatusError(errorData.message || 'Failed to update status');
        }
        
        toast.error(errorData.message || 'Failed to update status');
      } else {
        setStatusError('Failed to update status. Please try again.');
        toast.error('Failed to update status. Please try again.');
      }
    } finally {
      setStatusUpdating(null);
      setActiveDropdown(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVendors();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'deactivated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusActions = (currentStatus) => {
    const allActions = {
      active: [
        { label: 'Mark as Pending', value: 'pending' },
        { label: 'Deactivate Shop', value: 'deactivate' }
      ],
      pending: [
        { label: 'Approve (Active)', value: 'approve' },
        { label: 'Deny Application', value: 'deny' }
      ],
      denied: [
        { label: 'Approve (Active)', value: 'approve' },
        { label: 'Mark as Pending', value: 'pending' }
      ],
      deactivated: [
        { label: 'Reactivate Shop', value: 'approve' }
      ]
    };

    return allActions[currentStatus] || [];
  };

  const toggleDropdown = (shopId) => {
    setActiveDropdown(activeDropdown === shopId ? null : shopId);
  };

  return (
    <div className="">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Shop Manager</h1>
        <form onSubmit={handleSearch} className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Status error message */}
      {statusError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {statusError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('all')}
        >
          All Shops
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('pending')}
        >
          Pending Applications
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Table with data */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                           
                            
                              {shop.logo ? (
                                <img 
                                  src={shop.logo} 
                                  alt={shop.owner} 
                                  className="h-full w-full rounded-full object-cover" 
                                />
                              ) : (
                                <FiShoppingBag className="text-blue-600" />
                              )}
                          
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          shop.category === "Fashion" ? "bg-purple-100 text-purple-800" :
                          shop.category === "Food" ? "bg-green-100 text-green-800" :
                          shop.category === "Electronics" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {shop.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shop.status)}`}>
                          {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={() => toggleDropdown(shop.id)}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={statusUpdating === shop.id}
                        >
                          {statusUpdating === shop.id ? (
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FaEllipsisV />
                          )}
                        </button>
                        
                        {activeDropdown === shop.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                          >
                            <div className="py-1">
                              {getStatusActions(shop.status).map((action) => (
                                <button
                                  key={action.value}
                                  onClick={() => updateStatus(shop.id, action.value)}
                                  disabled={statusUpdating === shop.id}
                                  className={`block px-4 py-2 text-sm w-full text-left ${
                                    statusUpdating === shop.id 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {statusUpdating === shop.id ? (
                                    <span className="flex items-center">
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Processing...
                                    </span>
                                  ) : (
                                    action.label
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No shops found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {shops.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.perPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)}</span> of{' '}
                    <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1 || loading}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <FaChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}

                    <button 
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages || loading}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <FaChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopManager;