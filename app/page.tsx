"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const propertiesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProperties(propertiesData);
    };

    fetchProperties();
  }, []);

  const handleCardClick = (propertyId: string) => {
    router.push(`/viewproperties?id=${propertyId}`);
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <aside className="w-full lg:w-1/4 p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Budget</h3>
          <input type="range" min="0" max="100000000" className="w-full" />
          <div className="flex justify-between text-sm mt-2">
            <span>₹0</span>
            <span>₹100+ Crores</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Type of Property</h3>
          <div className="flex flex-col">
            <label className="mb-2">
              <input type="checkbox" className="mr-2" /> Residential Apartment
            </label>
            <label className="mb-2">
              <input type="checkbox" className="mr-2" /> Independent House/Villa
            </label>
            <label className="mb-2">
              <input type="checkbox" className="mr-2" /> Residential Land
            </label>
            <label className="mb-2">
              <input type="checkbox" className="mr-2" /> Independent/Builder Floor
            </label>
            <label className="mb-2">
              <input type="checkbox" className="mr-2" /> Farm House
            </label>
          </div>
        </div>
      </aside>
      <section className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div 
              key={property.id} 
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105" 
              onClick={() => handleCardClick(property.id)}
            >
              <img 
                src={property.images[0]} 
                alt={property.title} 
                className="w-full h-48 object-cover rounded-md mb-4" 
                loading="lazy"
              />
              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-700 mb-2">{property.area}</p>
              <p className="text-gray-600">{property.city}</p>
              <p className="text-lg font-bold mt-2">₹{property.price}</p>
              <p className="text-sm text-gray-500">{property.size} sqft | {property.bhk} BHK</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
