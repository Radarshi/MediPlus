import MedicineDetailModal from '@/components/MedicineDetailModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Eye, Filter, Heart, Pill, Search, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';


const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const categories = [
    { id: 'all', name: 'All Medicines', count: 156 },
    { id: 'cardiology', name: 'Heart Care', count: 45 },
    { id: 'diabetes', name: 'Diabetes', count: 32 },
    { id: 'pain-relief', name: 'Pain Relief', count: 28 },
    { id: 'vitamins', name: 'Vitamins', count: 51 }
  ];
  
   useEffect(() => {
    const fetchData = async () => {
      // Fetch medicines
      const { data: meds, error: medError } = await supabase
        .from('medicine_store')
        .select('*');
        console.log('Medicine coming',meds);

      if (medError) {
        console.error('Failed to fetch medicines:', medError.message);
      } else {
        setMedicines(meds);
      }
    };

    fetchData();
  }, []);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Medicine Store</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medicine Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredMedicines.length} medicines found
              </h2>
              <select className="px-4 py-2 border rounded-lg">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-blue-500 to-green-500 p-6 text-center">
                          <div className="text-4xl mb-2">{medicine.image}</div>
                          {medicine.originalPrice > medicine.price && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% OFF
                            </div>
                          )}
                          {medicine.prescription && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Rx
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="rounded-full p-2">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="font-bold text-lg mb-1">{medicine.name}</h3>
                          <p className="text-sm text-gray-600">{medicine.genericName}</p>
                          <p className="text-xs text-gray-500">by {medicine.manufacturer}</p>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{medicine.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {medicine.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold ml-1">{medicine.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({medicine.reviews})</span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">
                            {medicine.inStock} in stock
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-green-600">${medicine.price}</span>
                            {medicine.originalPrice > medicine.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${medicine.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Dosage</p>
                            <p className="text-sm font-medium">{medicine.dosage}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="px-3"
                            onClick={() => handleViewMedicine(medicine)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Detail Modal */}
      {selectedMedicine && (
        <MedicineDetailModal
          medicine={selectedMedicine}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMedicine(null);
          }}
        />
      )}
    </div>
  );
};

export default StorePage;
