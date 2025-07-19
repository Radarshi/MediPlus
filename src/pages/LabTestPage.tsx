import LabTestBookingModal from '@/components/LabTestBookingModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Calendar, Clock, Download, Filter, MapPin, Search, Star, TestTube } from 'lucide-react';
import { useState } from 'react';

const LabTestPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Tests', count: 89 },
    { id: 'blood', name: 'Blood Tests', count: 32 },
    { id: 'urine', name: 'Urine Tests', count: 18 },
    { id: 'imaging', name: 'Imaging', count: 15 },
    { id: 'cardiac', name: 'Cardiac Tests', count: 12 },
    { id: 'hormonal', name: 'Hormonal Tests', count: 12 }
  ];

  const labTests = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'blood',
      price: 25,
      originalPrice: 35,
      duration: '2-4 hours',
      fasting: false,
      homeCollection: true,
      rating: 4.9,
      reviews: 234,
      booked: 1250,
      description: 'Comprehensive blood analysis to check overall health status',
      includes: ['Red Blood Cell Count', 'White Blood Cell Count', 'Platelet Count', 'Hemoglobin', 'Hematocrit'],
      preparation: 'No special preparation required',
      sampleType: 'Blood',
      reportTime: 'Same day',
      labName: 'MedLab Diagnostics',
      icon: '🩸',
      tags: ['Popular', 'Basic Health Check']
    },
    {
      id: 2,
      name: 'Lipid Profile',
      category: 'blood',
      price: 35,
      originalPrice: 45,
      duration: '12 hours',
      fasting: true,
      homeCollection: true,
      rating: 4.8,
      reviews: 189,
      booked: 890,
      description: 'Measures cholesterol and triglyceride levels for heart health assessment',
      includes: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL'],
      preparation: '12-hour fasting required',
      sampleType: 'Blood',
      reportTime: '24 hours',
      labName: 'CardioLab Center',
      icon: '❤️',
      tags: ['Heart Health', 'Fasting Required']
    },
    {
      id: 3,
      name: 'Thyroid Function Test (TFT)',
      category: 'hormonal',
      price: 45,
      originalPrice: 60,
      duration: '24 hours',
      fasting: false,
      homeCollection: true,
      rating: 4.7,
      reviews: 156,
      booked: 670,
      description: 'Evaluates thyroid gland function and hormone levels',
      includes: ['TSH', 'Free T3', 'Free T4', 'Anti-TPO', 'Thyroglobulin'],
      preparation: 'No special preparation required',
      sampleType: 'Blood',
      reportTime: '24-48 hours',
      labName: 'EndoLab Institute',
      icon: '🦋',
      tags: ['Hormonal', 'Metabolism']
    },
    {
      id: 4,
      name: 'Diabetes Panel (HbA1c)',
      category: 'blood',
      price: 30,
      originalPrice: 40,
      duration: '24 hours',
      fasting: false,
      homeCollection: true,
      rating: 4.8,
      reviews: 198,
      booked: 950,
      description: 'Comprehensive diabetes screening and monitoring panel',
      includes: ['HbA1c', 'Fasting Glucose', 'Random Glucose', 'Insulin Level'],
      preparation: 'No fasting required for HbA1c',
      sampleType: 'Blood',
      reportTime: '24 hours',
      labName: 'DiabetesCheck Lab',
      icon: '🍯',
      tags: ['Diabetes', 'Popular']
    },
    {
      id: 5,
      name: 'Chest X-Ray',
      category: 'imaging',
      price: 55,
      originalPrice: 70,
      duration: '30 minutes',
      fasting: false,
      homeCollection: false,
      rating: 4.6,
      reviews: 145,
      booked: 420,
      description: 'Digital chest X-ray for lung and heart examination',
      includes: ['PA View', 'Lateral View', 'Digital Images', 'Radiologist Report'],
      preparation: 'Remove metal jewelry and clothing from chest area',
      sampleType: 'X-Ray Imaging',
      reportTime: '2-4 hours',
      labName: 'Imaging Center Plus',
      icon: '🫁',
      tags: ['Imaging', 'Lung Health']
    },
    {
      id: 6,
      name: 'Urine Complete Analysis',
      category: 'urine',
      price: 15,
      originalPrice: 25,
      duration: '1-2 hours',
      fasting: false,
      homeCollection: true,
      rating: 4.5,
      reviews: 167,
      booked: 780,
      description: 'Complete urine examination for kidney and urinary tract health',
      includes: ['Physical Examination', 'Chemical Analysis', 'Microscopic Examination', 'Protein Levels'],
      preparation: 'Clean catch midstream urine sample',
      sampleType: 'Urine',
      reportTime: 'Same day',
      labName: 'UroCare Diagnostics',
      icon: '🧪',
      tags: ['Kidney Health', 'Quick Results']
    }
  ];

  const filteredTests = labTests.filter(test => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookTest = (test) => {
    setSelectedTest(test);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-2">
                <TestTube className="w-6 h-6 text-teal-600" />
                <h1 className="text-2xl font-bold text-gray-800">Lab Tests</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search lab tests..."
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
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">NABL</div>
              <div className="text-sm opacity-90">Accredited Labs</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Home</div>
              <div className="text-sm opacity-90">Sample Collection</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24hrs</div>
              <div className="text-sm opacity-90">Quick Reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Safe</div>
              <div className="text-sm opacity-90">& Hygienic</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Test Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-teal-100 text-teal-700 border-l-4 border-teal-500'
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

          {/* Tests Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredTests.length} tests available
              </h2>
              <select className="px-4 py-2 border rounded-lg">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Report Time</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-center">
                          <div className="text-4xl mb-2">{test.icon}</div>
                          <h3 className="text-white font-bold text-lg">{test.name}</h3>
                          {test.originalPrice > test.price && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {Math.round(((test.originalPrice - test.price) / test.originalPrice) * 100)}% OFF
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-gray-600 mb-3 text-sm">{test.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {test.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-gray-500">Report Time</div>
                              <div className="font-semibold">{test.reportTime}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-gray-500">Collection</div>
                              <div className="font-semibold">{test.homeCollection ? 'Home' : 'Lab Only'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="text-sm font-semibold mb-2">Includes:</div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {test.includes.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <div className="w-1 h-1 bg-teal-500 rounded-full mr-2"></div>
                                {item}
                              </li>
                            ))}
                            {test.includes.length > 3 && (
                              <li className="text-teal-600">+{test.includes.length - 3} more</li>
                            )}
                          </ul>
                        </div>

                        {test.fasting && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
                            <div className="text-xs text-orange-700 font-semibold">
                              ⚠️ Fasting Required: {test.preparation}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold ml-1">{test.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({test.reviews})</span>
                          </div>
                          <span className="text-xs text-gray-500">{test.booked}+ booked</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-teal-600">${test.price}</span>
                            {test.originalPrice > test.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${test.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">by {test.labName}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600"
                            onClick={() => handleBookTest(test)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Test
                          </Button>
                          <Button variant="outline" size="sm" className="px-3">
                            <Download className="w-4 h-4" />
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

      {/* Lab Test Booking Modal */}
      {selectedTest && (
        <LabTestBookingModal
          test={selectedTest}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedTest(null);
          }}
        />
      )}
    </div>
  );
};

export default LabTestPage;
