import BlogDetailModal from '@/components/BlogDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, User } from 'lucide-react';
import { useState } from 'react';

const HealthBlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Articles', icon: '📚', count: 24 },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗', count: 8 },
    { id: 'fitness', name: 'Fitness', icon: '💪', count: 6 },
    { id: 'mental-health', name: 'Mental Health', icon: '🧠', count: 5 },
    { id: 'wellness', name: 'Wellness', icon: '🌿', count: 5 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Superfoods That Boost Your Immune System',
      excerpt: 'Discover the power of nutrient-rich foods that can help strengthen your immune system naturally.',
      content: 'The immune system is our body\'s natural defense mechanism against diseases and infections. By incorporating certain superfoods into our daily diet, we can significantly enhance our immune response and overall health.\n\nHere are 10 powerful superfoods that can boost your immune system:\n\n1. Citrus Fruits: Rich in vitamin C, citrus fruits like oranges, lemons, and grapefruits help increase the production of white blood cells.\n\n2. Garlic: Contains allicin, a compound known for its immune-boosting properties and ability to fight infections.\n\n3. Spinach: Packed with vitamin C, antioxidants, and beta carotene, spinach supports immune function when lightly cooked.\n\n4. Yogurt: Contains probiotics that support gut health, which is closely linked to immune function.\n\n5. Almonds: Rich in vitamin E, which acts as an antioxidant and helps maintain immune system function.\n\nIncorporating these foods into your daily meals can help you maintain a strong and healthy immune system year-round.',
      author: 'Dr. Sarah Wilson',
      authorImage: '👩‍⚕️',
      date: 'March 15, 2024',
      readTime: '5 min read',
      category: 'nutrition',
      image: '🥗',
      tags: ['nutrition', 'immunity', 'health'],
      featured: true,
      likes: 142,
      views: 1250
    },
    {
      id: 2,
      title: 'The Science Behind Better Sleep',
      excerpt: 'Understanding sleep cycles and how to optimize your rest for better health and productivity.',
      content: 'Sleep is one of the most critical aspects of our health, yet it\'s often overlooked in our busy lives. Understanding the science behind sleep can help us optimize our rest and improve our overall well-being.\n\nSleep occurs in cycles, each lasting about 90 minutes and consisting of different stages:\n\n1. Light Sleep (Stage 1): The transition between wakefulness and sleep\n2. Deeper Sleep (Stage 2): Body temperature drops, heart rate slows\n3. Deep Sleep (Stages 3-4): Physical restoration occurs\n4. REM Sleep: Mental restoration and memory consolidation\n\nTo improve your sleep quality:\n- Maintain a consistent sleep schedule\n- Create a relaxing bedtime routine\n- Keep your bedroom cool and dark\n- Avoid screens before bedtime\n- Limit caffeine intake in the afternoon\n\nQuality sleep is essential for immune function, mental health, and physical performance.',
      author: 'Dr. Michael Chen',
      authorImage: '👨‍⚕️',
      date: 'March 12, 2024',
      readTime: '7 min read',
      category: 'wellness',
      image: '😴',
      tags: ['sleep', 'wellness', 'health'],
      featured: true,
      likes: 98,
      views: 890
    },
    {
      id: 3,
      title: 'Mental Health in the Digital Age',
      excerpt: 'How technology affects our mental well-being and strategies for maintaining balance.',
      content: 'In our increasingly connected world, technology has become an integral part of our daily lives. While it offers numerous benefits, it also presents unique challenges to our mental health.\n\nThe impact of technology on mental health:\n\n1. Social Media and Comparison: Constant exposure to curated content can lead to feelings of inadequacy\n2. Digital Overwhelm: Information overload can cause anxiety and stress\n3. Sleep Disruption: Blue light exposure affects our natural sleep patterns\n4. Reduced Face-to-Face Interaction: Digital communication can\'t fully replace human connection\n\nStrategies for digital wellness:\n- Set boundaries with device usage\n- Practice digital detox regularly\n- Use technology mindfully\n- Prioritize real-world relationships\n- Create tech-free zones in your home\n\nBy being intentional about our technology use, we can harness its benefits while protecting our mental well-being.',
      author: 'Dr. Emily Rodriguez',
      authorImage: '👩‍⚕️',
      date: 'March 10, 2024',
      readTime: '6 min read',
      category: 'mental-health',
      image: '🧠',
      tags: ['mental health', 'technology', 'balance'],
      featured: false,
      likes: 76,
      views: 634
    },
    {
      id: 4,
      title: 'High-Intensity Interval Training Benefits',
      excerpt: 'Why HIIT workouts are effective for burning fat and improving cardiovascular health.',
      content: 'High-Intensity Interval Training (HIIT) is a type of exercise that involves short bursts of intense activity followed by periods of rest. This type of training has been shown to be effective for burning fat, improving cardiovascular health, and boosting metabolism.\n\nHIIT workouts can be done on a variety of equipment, including treadmills, stationary bikes, and resistance bands. They can also be done outdoors, such as in a park or on a trail.\n\nSome benefits of HIIT include:\n- Increased calorie burn\n- Improved cardiovascular fitness\n- Increased muscle mass\n- Improved insulin sensitivity\n- Reduced risk of chronic diseases\n\nHIIT workouts are a great way to get a full-body workout in a short amount of time, and they can be tailored to your fitness level and goals.',
      author: 'Dr. James Parker',
      authorImage: '👨‍⚕️',
      date: 'March 8, 2024',
      readTime: '4 min read',
      category: 'fitness',
      image: '🏃‍♂️',
      tags: ['fitness', 'cardio', 'exercise'],
      featured: false,
      likes: 54,
      views: 510
    },
    {
      id: 5,
      title: 'Understanding Stress and Its Impact on Health',
      excerpt: 'Learn about different types of stress and evidence-based techniques for management.',
      content: 'Stress is a natural response to challenging situations, but chronic stress can have negative effects on our health. Understanding the different types of stress and evidence-based techniques for management can help us manage stress more effectively and improve our overall well-being.\n\nTypes of stress:\n\n1. Acute Stress: Short-term stress that occurs in response to a specific event or situation\n2. Chronic Stress: Long-term stress that occurs over a period of time\n3. Psychological Stress: Stress caused by thoughts, emotions, and beliefs\n4. Physical Stress: Stress caused by physical factors such as pain or illness\n\nEvidence-based techniques for managing stress:\n\n1. Mindfulness Meditation: Focusing on the present moment and reducing stress\n2. Progressive Muscle Relaxation: Tensing and relaxing different muscle groups to reduce tension\n3. Deep Breathing: Taking slow, deep breaths to calm the mind and body\n4. Exercise: Regular physical activity can help reduce stress and improve mood\n5. Social Support: Connecting with others can provide emotional support and reduce stress\n\nBy managing stress effectively, we can improve our overall health and well-being.',
      author: 'Dr. Lisa Thompson',
      authorImage: '👩‍⚕️',
      date: 'March 5, 2024',
      readTime: '8 min read',
      category: 'mental-health',
      image: '😌',
      tags: ['stress', 'mental health', 'wellness'],
      featured: false,
      likes: 42,
      views: 400
    },
    {
      id: 6,
      title: 'The Mediterranean Diet: A Complete Guide',
      excerpt: 'Explore the health benefits and practical tips for adopting this heart-healthy eating pattern.',
      content: 'The Mediterranean diet is a traditional eating pattern that emphasizes whole foods, healthy fats, and plenty of fruits and vegetables. This diet has been shown to have numerous health benefits, including reduced risk of heart disease, improved brain function, and lower risk of chronic diseases.\n\nKey components of the Mediterranean diet:\n\n1. Whole Grains: Whole wheat bread, quinoa, and brown rice\n2. Fruits and Vegetables: A variety of colorful fruits and vegetables\n3. Legumes: Beans, lentils, and chickpeas\n4. Nuts and Seeds: Almonds, walnuts, and chia seeds\n5. Olive Oil: A healthy monounsaturated fat\n6. Fish and Poultry: Lean protein sources\n7. Dairy: Low-fat dairy products\n8. Limited Red Meat: Consumed in moderation\n9. Moderate Alcohol: Consumed in moderation\n10. Avoid Processed Foods: Avoiding foods that are high in sugar, salt, and unhealthy fats\n\nThe Mediterranean diet is a great way to improve your overall health and well-being, and it can be adapted to suit your individual needs and preferences.',
      author: 'Dr. Maria Santos',
      authorImage: '👩‍⚕️',
      date: 'March 3, 2024',
      readTime: '6 min read',
      category: 'nutrition',
      image: '🫒',
      tags: ['nutrition', 'diet', 'heart health'],
      featured: false,
      likes: 30,
      views: 350
    }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = regularPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Search and Categories */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Latest Health Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with expert advice, research-backed articles, and practical tips for a healthier lifestyle.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles Slider */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Top Featured Articles</h3>
            <Carousel className="w-full">
              <CarouselContent>
                {featuredPosts.map((post, index) => (
                  <CarouselItem key={post.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-0">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8">
                            <div className="text-6xl mb-4">{post.image}</div>
                            <div className="flex items-center gap-4 text-sm mb-4 opacity-90">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {post.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {post.readTime}
                              </span>
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {post.author}
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold mb-3">{post.title}</h4>
                            <p className="opacity-90 mb-4">{post.excerpt}</p>
                            <Button 
                              variant="secondary" 
                              className="bg-white text-indigo-600 hover:bg-gray-100"
                              onClick={() => handleReadMore(post)}
                            >
                              Read More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Regular Articles */}
        <div>
          <h3 className="text-2xl font-bold mb-6">All Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="text-4xl mb-4">{post.image}</div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.date}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReadMore(post)}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated with Health Tips</h3>
              <p className="mb-6 opacity-90">
                Get the latest health insights, tips, and expert advice delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white text-gray-900" 
                />
                <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Blog Detail Modal */}
      <BlogDetailModal
        post={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HealthBlogPage;
