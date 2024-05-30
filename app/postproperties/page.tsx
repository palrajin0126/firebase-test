"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/app/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export default function PostProperties() {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as string[],
    city: '',
    area: '',
    locality: '',
    floor: 0,
    propertyType: 'house',
    transactionType: 'leaseHold',
    option: 'sell',
    price: 0,
    areaSqft: 0,
    ownerName: '',
    contactNumber: '',
    facingDirection: 'north',
    status: 'readyToMove',
  });

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
        router.push('/Signin'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && user) {
      const imageUrls: string[] = [];
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
  
        // Add userId to the metadata
        const metadata = {
          customMetadata: {
            userId: user.id,
          },
        };
        await updateMetadata(storageRef, metadata);
  
        imageUrls.push(imageUrl);
      }
      setFormData({ ...formData, images: imageUrls });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You need to be logged in to post a property');
      return;
    }
    try {
      const propertyData = { ...formData, userId: user.id };
      await addDoc(collection(db, 'properties'), propertyData);
      alert('Property posted successfully!');
      router.push('/');
    } catch (err) {
      console.error('Error posting property:', err);
      alert('Error posting property');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Post Property</h1>
        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea 
            name="content" 
            placeholder="Content" 
            value={formData.content} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Images</label>
          <input 
            type="file" 
            name="images" 
            onChange={handleImageUpload} 
            multiple 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {/* Other Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={formData.city} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Area</label>
          <input 
            type="text" 
            name="area" 
            placeholder="Area" 
            value={formData.area} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Locality</label>
          <input 
            type="text" 
            name="locality" 
            placeholder="Locality" 
            value={formData.locality} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Floor</label>
          <input 
            type="number" 
            name="floor" 
            placeholder="Floor" 
            value={formData.floor} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Property Type</label>
          <select 
            name="propertyType" 
            value={formData.propertyType} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="builderFloor">Builder Floor</option>
            <option value="cooperativeSociety">Cooperative Society</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Transaction Type</label>
          <select 
            name="transactionType" 
            value={formData.transactionType} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="leaseHold">Lease Hold</option>
            <option value="freeHold">Free Hold</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Option</label>
          <select 
            name="option" 
            value={formData.option} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
            <option value="pg">PG</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input 
            type="number" 
            name="price" 
            placeholder="Price" 
            value={formData.price} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Area (sq ft)</label>
          <input 
            type="number" 
            name="areaSqft" 
            placeholder="Area (sq ft)" 
            value={formData.areaSqft} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Owner Name</label>
          <input 
            type="text" 
            name="ownerName" 
            placeholder="Owner Name" 
            value={formData.ownerName} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input 
            type="text" 
            name="contactNumber" 
            placeholder="Contact Number" 
            value={formData.contactNumber} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Facing Direction</label>
          <select 
            name="facingDirection" 
            value={formData.facingDirection} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="readyToMove">Ready to Move</option>
            <option value="underConstruction">Under Construction</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Post Property</button>
      </form>
    </main>
  );
}
