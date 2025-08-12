import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { propertyData, Property } from './data';

// Contact form data interface
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Function to seed the database with initial property data
export const seedDatabase = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    
    // Only seed if database is empty
    if (snapshot.empty) {
      console.log('Seeding database with initial properties...');      const seedPromises = propertyData.map(property => {        // Remove id from the property since Firestore will generate one
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...propertyWithoutId } = property;
        return addDoc(propertiesRef, {
          ...propertyWithoutId,
          createdAt: new Date()
        });
      });
      
      await Promise.all(seedPromises);
      console.log('Database seeded successfully');
      return true;
    }
    
    console.log('Database already has data, skipping seed operation');
    return false;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Function to get properties from Firebase
export const getPropertiesFromFirebase = async (): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    
    if (snapshot.empty) {
      console.warn('No properties found in Firebase');
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));
  } catch (error) {
    console.error('Error fetching properties from Firebase:', error);
    return [];
  }
};

// Function to get featured properties
export const getFeaturedPropertiesFromFirebase = async (): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, where('featured', '==', true));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn('No featured properties found in Firebase');
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));
  } catch (error) {
    console.error('Error fetching featured properties from Firebase:', error);
    return [];
  }
};

// Function to update property status
export const updatePropertyStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const propertyRef = doc(db, 'properties', id);
    await updateDoc(propertyRef, { 
      status,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating property status:', error);
    throw error;
  }
};

// Function to delete property
export const deletePropertyFromFirebase = async (id: string): Promise<boolean> => {
  try {
    const propertyRef = doc(db, 'properties', id);
    await deleteDoc(propertyRef);
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

// Function to submit contact form data to Firestore
export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const contactRef = collection(db, 'contacts');
    const newContact = {
      ...formData,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(contactRef, newContact);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Function to create a new property in Firestore
export const createProperty = async (propertyData: Partial<Property>) => {
  try {
    const propertiesRef = collection(db, 'properties');
    const newProperty = {
      ...propertyData,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(propertiesRef, newProperty);
    return docRef.id;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Function to get a single property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const propertyRef = doc(db, 'properties', id);
    const propertySnapshot = await getDoc(propertyRef);
    
    if (!propertySnapshot.exists()) {
      return null;
    }
    
    return {
      id: propertySnapshot.id,
      ...propertySnapshot.data()
    } as Property;
  } catch (error) {
    console.error('Error getting property by ID:', error);
    return null;
  }
};

// Function to update property data
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<boolean> => {
  try {
    const propertyRef = doc(db, 'properties', id);
    await updateDoc(propertyRef, {
      ...propertyData,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};
