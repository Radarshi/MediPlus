import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Stethoscope } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const AppointmentTeaser = () => {
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

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 4.9,
      experience: '15 years',
      image: '/placeholder.svg',
      availability: 'Available Today',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      rating: 4.8,
      experience: '12 years',
      image: '/placeholder.svg',
      availability: 'Available Tomorrow',
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrician',
      rating: 4.9,
      experience: '10 years',
      image: '/placeholder.svg',
      availability: 'Available Today',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
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
            Book Your Appointment
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Connect with experienced doctors and specialists for personalized healthcare consultations
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{doctor.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">{doctor.availability}</span>
                  </div>
                </div>

                <a href="/consult"><Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button></a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Quick & Easy Booking
            </h3>
            <p className="text-gray-600 mb-6">
              Book your appointment in just a few clicks. Choose your preferred doctor, 
              select a convenient time slot, and get instant confirmation.
            </p>
            <a href="/consult"><Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
              Start Booking Process
            </Button></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentTeaser;
