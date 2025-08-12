import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export const getProperties = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return properties;
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const propertyRef = doc(db, 'properties', id);
    const propertySnapshot = await getDoc(propertyRef);
    
    if (!propertySnapshot.exists()) {
      throw new Error('Property not found');
    }
    
    return {
      id: propertySnapshot.id,
      ...propertySnapshot.data()
    };
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

export const getFeaturedProperties = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, where('featured', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return properties;
  } catch (error) {
    console.error('Error getting featured properties:', error);
    throw error;
  }
};

export const createProperty = async (propertyData: Record<string, unknown>) => {
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

export const updateProperty = async (id: string, propertyData: Record<string, unknown>) => {
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

export const deleteProperty = async (id: string) => {
  try {
    const propertyRef = doc(db, 'properties', id);
    await deleteDoc(propertyRef);
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

export const submitContactForm = async (formData: Record<string, unknown>) => {
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
