import React, { useState, useRef, useCallback } from 'react';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useAdmin';
import { Input } from '../../../components/base/Input';
import { Plus, Edit2, Trash2, X, Upload, Loader2, Search, Hash } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';

const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Shoes', 'Sports', 'Home', 'Beauty', 'Toys'];

export const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');

  const { data: productsData, isLoading } = useAdminProducts(
    page,
    searchName.trim() || undefined,
    searchId.trim() || undefined,
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: CATEGORIES[0], brand: '', stock: '', images: ''
  });

  const totalPages = productsData?.data?.totalPages || 0;
  const products = productsData?.data?.products || [];

  // Reset page to 1 whenever search changes
  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setPage(1);
  };

  const handleSearchId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
    setPage(1);
  };

  const clearSearch = useCallback(() => {
    setSearchName('');
    setSearchId('');
    setPage(1);
  }, []);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        brand: product.brand,
        stock: product.stock.toString(),
        images: product.images?.join(', ') || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', category: CATEGORIES[0], brand: '', stock: '', images: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setIsUploading(true);
    try {
      const res: any = await axiosInstance.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImageUrl = `http://localhost:5000${res.data.imageUrl}`;
      setFormData(prev => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${newImageUrl}` : newImageUrl
      }));
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct._id, data }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createProduct.mutate(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Products</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Manage your storefront inventory
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="h-12 px-6 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] shadow-xl transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel bg-white rounded-2xl p-4 border border-border/50 shadow-md flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchName}
            onChange={handleSearchName}
            className="w-full h-10 pl-9 pr-4 border-2 border-border/50 rounded-xl text-sm font-medium bg-white focus:border-black outline-none transition-all"
          />
        </div>
        <div className="flex-1 min-w-[200px] relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product ID..."
            value={searchId}
            onChange={handleSearchId}
            className="w-full h-10 pl-9 pr-4 border-2 border-border/50 rounded-xl text-sm font-medium font-mono bg-white focus:border-black outline-none transition-all"
          />
        </div>
        {(searchName || searchId) && (
          <button
            onClick={clearSearch}
            className="h-10 px-4 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black hover:border-black/30 transition-colors flex items-center gap-2"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
        {(searchName || searchId) && (
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-auto">
            {products.length} result{products.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-border/50 bg-white">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center animate-pulse text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Loading Products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No products found</p>
              {(searchName || searchId) && (
                <p className="text-xs text-muted-foreground">Try adjusting your search criteria</p>
              )}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border/50">
                <tr>
                  <th className="px-8 py-5">Product Info</th>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Pricing</th>
                  <th className="px-8 py-5">Inventory</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {products.map((product: any) => (
                  <tr 
                    key={product._id} 
                    onClick={() => handleOpenModal(product)}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-5 flex items-center gap-4">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                        alt=""
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-border/50"
                      />
                      <div>
                        <div className="font-bold tracking-tight text-sm line-clamp-1">{product.name}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{product.brand}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-[10px] text-muted-foreground bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 select-all">
                        {product._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-sm tracking-tight">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${product.stock < 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex gap-1 justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }} 
                          className="p-2 hover:bg-black/5 text-black rounded-lg transition-colors border border-transparent hover:border-black/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} 
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-border/50 flex justify-between items-center bg-slate-50/50">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-6 h-10 border border-border rounded-xl disabled:opacity-50 hover:bg-white hover:border-black/30 bg-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Previous
            </button>
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-6 h-10 border border-border rounded-xl disabled:opacity-50 hover:bg-white hover:border-black/30 bg-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl space-y-6 border border-white/20 transform animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <h3 className="text-2xl font-black tracking-tight">{editingProduct ? 'Update Product' : 'Create New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input required label="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="font-bold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Description</label>
                <textarea
                  required
                  className="w-full bg-background border-2 border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none min-h-[100px] transition-all"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <Input required type="number" label="Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <Input required type="number" label="Stock Quantity" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
                <select
                  required
                  className="w-full h-11 border-2 border-border/50 rounded-xl px-4 text-sm bg-white font-bold focus:border-primary outline-none transition-all cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>

              <Input required label="Brand Name" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Images</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    Upload from PC
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
                <Input
                  placeholder="Or paste image URLs separated by comma"
                  value={formData.images}
                  onChange={e => setFormData({...formData, images: e.target.value})}
                />
                {formData.images && (
                  <div className="mt-3 flex gap-2 overflow-x-auto py-2">
                    {formData.images.split(',').map((url, i) => (
                      <div key={i} className="relative group flex-shrink-0">
                        <img src={url.trim()} className="w-12 h-12 rounded-lg object-cover border border-border" />
                        <button
                          type="button"
                          onClick={() => {
                            const remaining = formData.images.split(',').filter((_, idx) => idx !== i).join(', ');
                            setFormData({...formData, images: remaining});
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-border/50">
                <button type="button" className="px-8 h-12 border border-border rounded-xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:text-black transition-colors" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={createProduct.isPending || updateProduct.isPending} className="px-10 h-12 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform disabled:opacity-50">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
