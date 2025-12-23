import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, Heart, Pill, Shield, Star, Truck } from 'lucide-react';

const MedicinesOverview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const categories = [
    {
      icon: Heart,
      name: 'Heart Care',
      description: 'Cardiac medications and supplements',
      products: 45,
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Shield,
      name: 'Immunity',
      description: 'Boost your immune system',
      products: 32,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Pill,
      name: 'Pain Relief',
      description: 'Over-the-counter pain medications',
      products: 28,
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const featuredProducts = [
    {
      name: 'Paracetamol 500mg',
      description: 'Pain relief and fever reducer',
      price: '$5.99',
      originalPrice: '$7.99',
      rating: 4.8,
      reviews: 234,
      inStock: true,
      prescription: false
    },
    {
      name: 'Vitamin D3',
      description: 'Daily vitamin supplement',
      price: '$12.99',
      originalPrice: '$15.99',
      rating: 4.9,
      reviews: 189,
      inStock: true,
      prescription: false
    },
    {
      name: 'Omega-3 Fish Oil',
      description: 'Heart health supplement',
      price: '$18.99',
      originalPrice: '$22.99',
      rating: 4.7,
      reviews: 156,
      inStock: false,
      prescription: false
    }
  ];

  const benefits = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders above $25'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Round the clock support'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Genuine medications only'
    }
  ];

  const benefitVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold mb-4"
          >
            Online Pharmacy
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Your trusted source for genuine medications and health products
          </motion.p>
        </motion.div>

        {/* Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-br ${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="text-sm text-gray-500 mb-4">{category.products} products</div>
                  <a href="/store"><Button className={`w-full bg-gradient-to-r ${category.color}`}>
                    Shop Now
                  </Button></a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Products */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8"
          >
            Featured Products
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Pill className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <div className={`text-sm font-semibold ${
                        product.inStock ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      disabled={!product.inStock}
                      variant={product.inStock ? "default" : "secondary"}
                    >
                      {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <a href="/store"><Button variant="outline" size="lg">
                    Shop More
                  </Button></a>
                </motion.div>
        {/* Benefits
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={benefitVariants}>
              <Card>
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};

export default MedicinesOverview;
