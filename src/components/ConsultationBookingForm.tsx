import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ConsultationBookingForm = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const[doctors,setDoctors] = useState([]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ prevent page reload

    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData.entries());

    const res = await fetch('http://localhost:3000/api/consulting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) 
      alert(data.error || 'Something went error');
    else{
      localStorage.setItem('token', data.token);
      alert('Your session is booked.')
    }
  };

    return(
         <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Your Consultation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDoctor && (
                  <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{selectedDoctor.image}</div>
                      <div>
                        <div className="font-semibold">{selectedDoctor.name}</div>
                        <div className="text-sm text-gray-600">{selectedDoctor.specializations[0]}</div>
                        <div className="text-lg font-bold text-green-600">${selectedDoctor.videoPrice}</div>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="Enter your full name" required name='name'/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <Input placeholder="Your age" type="number" required name='age'/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="Enter your phone number" name='phone' />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input placeholder="Enter your email" type="email" name='email'/>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Symptoms / Concerns</label>
                  <Textarea placeholder="Describe your symptoms or health concerns..." className="h-24" name='symptoms' required/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date</label>
                    <Input type="date" name='preferred_date'/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <select className="w-full p-2 border rounded-lg" name='preferred_time'>
                      <option value={9}>9:00 AM</option>
                      <option value={10}>10:00 AM</option>
                      <option value={11}>11:00 AM</option>
                      <option value={12} >12:00 PM</option>
                      <option value={1} >1:00 PM</option>
                      <option value={2}>2:00 PM</option>
                      <option value={3}>3:00 PM</option>
                      <option value={4}>4:00 PM</option>
                    </select>
                  </div>
                </div>

                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-lg py-3" 
                  type="submit">Book Consultation {selectedDoctor?.videoPrice}</button>
              
                </form>
                {/* <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4 border-t">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    HIPAA Compliant
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    24/7 Support
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Board Certified
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
    )
}
export default ConsultationBookingForm