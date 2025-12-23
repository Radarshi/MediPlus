import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, User } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const BlogPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Tips for a Healthy Heart',
      excerpt: 'Discover the key lifestyle changes and habits that can significantly improve your cardiovascular health and reduce the risk of heart disease.',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      category: 'Cardiology',
      readTime: '5 min read',
      image: '/placeholder.svg',
      tags: ['Heart Health', 'Prevention', 'Lifestyle'],
    },
    {
      id: 2,
      title: 'Understanding Diabetes: Prevention and Management',
      excerpt: 'Learn about the different types of diabetes, early warning signs, and effective strategies for prevention and management.',
      author: 'Dr. Michael Chen',
      date: '2024-01-12',
      category: 'Endocrinology',
      readTime: '7 min read',
      image: '/placeholder.svg',
      tags: ['Diabetes', 'Prevention', 'Management'],
    },
    {
      id: 3,
      title: 'Mental Health: Breaking the Stigma',
      excerpt: 'Exploring the importance of mental health awareness and practical steps to maintain psychological well-being in daily life.',
      author: 'Dr. Emily Davis',
      date: '2024-01-10',
      category: 'Mental Health',
      readTime: '6 min read',
      image: '/placeholder.svg',
      tags: ['Mental Health', 'Awareness', 'Well-being'],
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4"
          >
            Health Blog & Resources
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Stay informed with the latest health tips, medical insights, and wellness advice from our expert medical team
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Share Your Health Story
            </h3>
            <p className="text-gray-600 mb-6">
              Have a health tip or inspiring story to share? Join our community of health enthusiasts
              and contribute to our growing collection of wellness resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/health-blog">
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                  View All Articles
                </Button>
              </Link>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Submit Your Story
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;
