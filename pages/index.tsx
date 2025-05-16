import Head from 'next/head';
import { useEffect, useState, FormEvent } from 'react';
import { Cat, CatCreatePayload, ApiErrorResponse } from '../types';
import {
  getAllCats,
  createCat,
  updateCatSalary,
  deleteCat,
} from '../services/catService';
import axios, { AxiosError } from 'axios'; // For error handling

const initialFormData: CatCreatePayload = {
  name: '',
  years_of_experience: 0,
  breed: '',
  salary: 0,
};

export default function SpyCatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CatCreatePayload>(initialFormData);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [editSalary, setEditSalary] = useState<number>(0);

  const fetchCats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllCats();
      setCats(data);
    } catch (err) {
      console.error("Failed to fetch cats:", err);
      setError("Failed to load cats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'years_of_experience' || name === 'salary' ? Number(value) : value,
    }));
  };
  
  const handleEditSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSalary(Number(e.target.value));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await createCat(formData);
      setFormData(initialFormData); // Reset form
      fetchCats(); // Refresh list
    } catch (err) {
      console.error("Failed to create cat:", err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.detail) {
          // Handle array of error details from Pydantic v2
          if (Array.isArray(axiosError.response.data.detail)) {
            const messages = axiosError.response.data.detail.map(d => `${d.type}: ${d.msg}`).join(", ");
            setError(`Failed to create cat: ${messages}`);
          } else {
            setError(`Failed to create cat: ${axiosError.response.data.detail}`);
          }
        } else {
          setError("Failed to create cat. An unknown error occurred.");
        }
      } else {
        setError("Failed to create cat. Please check your input and try again.");
      }
    }
  };

  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setEditSalary(cat.salary);
    setError(null);
  };

  const handleSaveSalary = async (catId: number) => {
    setError(null);
    if (editSalary <= 0) {
        setError("Salary must be a positive number.");
        return;
    }
    try {
      await updateCatSalary(catId, { salary: editSalary });
      setEditingCat(null);
      fetchCats();
    } catch (err) {
      console.error("Failed to update salary:", err);
       if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.detail) {
           if (Array.isArray(axiosError.response.data.detail)) {
            const messages = axiosError.response.data.detail.map(d => `${d.type}: ${d.msg}`).join(", ");
            setError(`Failed to update salary: ${messages}`);
          } else {
            setError(`Failed to update salary: ${axiosError.response.data.detail}`);
          }
        } else {
          setError("Failed to update salary. An unknown error occurred.");
        }
      } else {
        setError("Failed to update salary. Please try again.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    if (window.confirm("Are you sure you want to delete this spy cat?")) {
      try {
        await deleteCat(id);
        fetchCats();
      } catch (err) {
        console.error("Failed to delete cat:", err);
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ApiErrorResponse>;
          if (axiosError.response && axiosError.response.data && axiosError.response.data.detail) {
             if (Array.isArray(axiosError.response.data.detail)) {
                const messages = axiosError.response.data.detail.map(d => `${d.type}: ${d.msg}`).join(", ");
                setError(`Failed to delete cat: ${messages}`);
            } else {
                setError(`Failed to delete cat: ${axiosError.response.data.detail}`);
            }
          } else {
            setError("Failed to delete cat. The cat might be on an active mission or another error occurred.");
          }
        } else {
          setError("Failed to delete cat. Please try again.");
        }
      }
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Spy Cat Agency - Cat Management</title>
        <meta name="description" content="Manage your spy cats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Spy Cat Roster</h1>

        {error && <p className="error-message">{error}</p>}

        <h2>Add New Spy Cat</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="years_of_experience">Years of Experience:</label>
            <input type="number" id="years_of_experience" name="years_of_experience" value={formData.years_of_experience} onChange={handleInputChange} min="0" required />
          </div>
          <div>
            <label htmlFor="breed">Breed:</label>
            <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="salary">Salary:</label>
            <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleInputChange} min="0.01" step="0.01" required />
          </div>
          <button type="submit">Add Cat</button>
        </form>

        <h2>Current Spy Cats</h2>
        {isLoading ? (
          <p>Loading cats...</p>
        ) : cats.length === 0 && !error ? (
          <p>No spy cats found. Add one above!</p>
        ) : (
          <ul>
            {cats.map((cat) => (
              <li key={cat.id}>
                {editingCat?.id === cat.id ? (
                  <div style={{width: '100%'}}>
                    <span>{cat.name} ({cat.breed}) - Exp: {cat.years_of_experience}</span>
                    <div>
                      <label htmlFor={`salary-${cat.id}`}>New Salary: </label>
                      <input 
                        type="number" 
                        id={`salary-${cat.id}`}
                        value={editSalary} 
                        onChange={handleEditSalaryChange} 
                        min="0.01" 
                        step="0.01"
                        style={{width: '100px', marginRight: '10px'}}
                        />
                      <button onClick={() => handleSaveSalary(cat.id)}>Save</button>
                      <button onClick={() => setEditingCat(null)} style={{marginLeft: '5px'}}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>
                      {cat.name} ({cat.breed}) - Exp: {cat.years_of_experience} - Salary: ${cat.salary.toFixed(2)}
                      {cat.mission_id && <span> (On Mission: {cat.mission_id})</span>}
                    </span>
                    <div>
                      <button onClick={() => handleEdit(cat)}>Edit Salary</button>
                      <button onClick={() => handleDelete(cat.id)} style={{backgroundColor: '#ff4d4d', color: 'white'}}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 