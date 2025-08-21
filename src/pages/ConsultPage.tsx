import ConsultationBooking from '@/components/ConsultationBookingForm';
import ConsultationPricingModal from '@/components/ConsultationPricingModal';
import DoctorDetailModal from '@/components/DoctorDetailModal';
import PaymentModal from '@/components/PaymentModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Star, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type ConsultationType = 'video' | 'phone' | 'chat';

const ConsultPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('general');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDetail, setShowDoctorDetail] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const[doctors,setDoctors] = useState([]);
  const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType>('video');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const specialties = [
    { id: 'general', name: 'General Medicine', doctors: 15, icon: '🩺' },
    { id: 'cardiology', name: 'Cardiology', doctors: 8, icon: '❤️' },
    { id: 'dermatology', name: 'Dermatology', doctors: 6, icon: '🧴' },
    { id: 'pediatrics', name: 'Pediatrics', doctors: 10, icon: '👶' },
    { id: 'orthopedics', name: 'Orthopedics', doctors: 7, icon: '🦴' },
    { id: 'psychiatry', name: 'Psychiatry', doctors: 5, icon: '🧠' }
  ];


  useEffect(()=>{
    const fetchData = async ()=>{
      const {data: doctors, error: docError} = await supabase
      .from('consult')
      .select('*')

      if(docError)
          console.error('Failed to fetch data',docError.message);
      else
        setDoctors(doctors);
    }
    fetchData();

  },[])
  const consultationTypes = [
    {
      type: 'video' as ConsultationType,
      name: 'Video Consultation',
      description: 'Face-to-face consultation with high-quality video',
      icon: Video,
      duration: '30 minutes',
      features: ['HD Video Call', 'Screen Sharing', 'Digital Prescription', 'Follow-up Notes']
    },
    {
      type: 'chat' as ConsultationType,
      name: 'Chat Consultation', 
      description: 'Text-based consultation with instant responses',
      icon: MessageCircle,
      duration: 'Unlimited',
      features: ['Instant Messaging', 'Photo Sharing', 'Voice Messages', '24/7 Support']
    },
    {
      type: 'phone' as ConsultationType,
      name: 'Phone Consultation',
      description: 'Voice call consultation with medical experts',
      icon: Phone,
      duration: '20 minutes',
      features: ['Clear Audio', 'Call Recording', 'Follow-up SMS', 'Emergency Support']
    }
  ];

  const filteredDoctors = doctors.filter(doctor => 
    selectedSpecialty === 'all' || doctor.specialty.toLowerCase().includes(selectedSpecialty)
  );

  const handleConsultationTypeClick = (type: ConsultationType) => {
    setSelectedConsultationType(type);
    setShowPricingModal(true);
  };

  const handleKnowMoreClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetail(true);
  };

  const handlePlanSelect = (plan, type) => {
    setSelectedPlan({ ...plan, type });
    setShowPricingModal(false);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Video className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Online Consultation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Consultation Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Consultation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {consultationTypes.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{type.name}</h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <div className="text-sm text-indigo-600 font-semibold mb-4">
                      Duration: {type.duration}
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-6">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                      onClick={() => handleConsultationTypeClick(type.type)}
                    >
                      View Pricing
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Specialty Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Select Medical Specialty</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {specialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSpecialty === specialty.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{specialty.icon}</div>
                <div className="font-semibold text-sm">{specialty.name}</div>
                <div className="text-xs text-gray-500">{specialty.doctors} doctors</div>
              </button>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">Available Doctors</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className={`cursor-pointer transition-all duration-300 ${
                      selectedDoctor?.id === doctor.id 
                        ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{doctor.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-lg">{doctor.name}</h4>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-semibold ml-1">{doctor.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({doctor.reviews})</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                              <p className="font-medium">{doctor.education}</p>
                              <p>{doctor.experience} experience</p>
                              <p>{doctor.consultations}+ consultations completed</p>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {doctor.specializations.map((spec, idx) => (
                                <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                  {spec}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-green-600 font-medium">
                                  {doctor.availability}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                {doctor.languages.map((lang, idx) => (
                                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleKnowMoreClick(doctor);
                              }}
                              className="w-full"
                            >
                              Know More
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Booking Form */}
          <ConsultationBooking></ConsultationBooking>
        </div>
      </div>

      {/* Modals */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={showDoctorDetail}
        onClose={() => setShowDoctorDetail(false)}
      />

      <ConsultationPricingModal
        type={selectedConsultationType}
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onPlanSelect={handlePlanSelect}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
      />
    </div>
  );
};

export default ConsultPage;
