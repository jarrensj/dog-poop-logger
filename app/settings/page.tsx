'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Save, Plus, Trash2, ArrowLeft, Edit3, X } from 'lucide-react';
import Link from 'next/link';
import { useDogs, Dog } from '@/hooks/useDogs';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function SettingsPage() {
  const { dogs, isLoading, error: dogsError, addDog, updateDog, deleteDog } = useDogs();
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', picture_url: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const resetForm = () => {
    setFormData({ name: '', picture_url: '' });
    setEditingDog(null);
    setShowAddForm(false);
  };

  const handleAddDog = async () => {
    if (!formData.name.trim()) {
      setError('Dog name is required');
      return;
    }

    setIsSaving(true);
    clearMessages();

    const result = await addDog(formData.name.trim(), formData.picture_url.trim() || undefined);
    
    if (result) {
      showSuccess('Dog added successfully!');
      resetForm();
    } else {
      setError(dogsError || 'Failed to add dog');
    }

    setIsSaving(false);
  };

  const handleUpdateDog = async () => {
    if (!editingDog || !formData.name.trim()) {
      setError('Dog name is required');
      return;
    }

    setIsSaving(true);
    clearMessages();

    const result = await updateDog(editingDog.id, formData.name.trim(), formData.picture_url.trim() || undefined);
    
    if (result) {
      showSuccess('Dog updated successfully!');
      resetForm();
    } else {
      setError(dogsError || 'Failed to update dog');
    }

    setIsSaving(false);
  };

  const handleDeleteDog = async (dogId: string) => {
    if (!confirm('Are you sure you want to delete this dog? This action cannot be undone.')) {
      return;
    }

    clearMessages();
    const success = await deleteDog(dogId);
    
    if (success) {
      showSuccess('Dog deleted successfully!');
    } else {
      setError(dogsError || 'Failed to delete dog');
    }
  };

  const startEditing = (dog: Dog) => {
    setEditingDog(dog);
    setFormData({ name: dog.name, picture_url: dog.picture_url || '' });
    setShowAddForm(false);
    clearMessages();
  };

  const startAdding = () => {
    setShowAddForm(true);
    setEditingDog(null);
    setFormData({ name: '', picture_url: '' });
    clearMessages();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-0 pb-4 sm:pb-6 flex flex-col items-center justify-start textured-bg">
      <div className="w-full max-w-4xl">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors duration-300 font-noto font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-zen font-light mb-6 sm:mb-8 text-[var(--foreground)] text-center tracking-wide">
          Manage Your Dog
        </h1>
      </div>

      {/* Error Message */}
      {(error || dogsError) && <ErrorMessage message={error || dogsError || ''} />}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 max-w-4xl w-full mx-4 sm:mx-0">
          <p className="font-noto font-light">{successMessage}</p>
        </div>
      )}

      <SignedIn>
        <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-0 fade-in">
          <div className="space-y-8">
            {/* Dogs List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-zen font-light text-[var(--foreground)] tracking-wide">
                  Your Dog
                </h2>
                {dogs.length === 0 && (
                  <button
                    onClick={startAdding}
                    className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-[var(--background)] font-noto font-light py-2 px-4 text-sm transition-all duration-300 ease-out rounded-xl relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[var(--accent-green)]/20 flex items-center gap-2 border-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Dog
                  </button>
                )}
              </div>

              {/* Dogs Grid */}
              {dogs.length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {dogs.map((dog) => (
                    <div key={dog.id} className="bg-[var(--accent-light)] border-[1.5px] border-[var(--border-soft)] rounded-sketch p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        {/* Dog Picture */}
                        <div className="flex-shrink-0">
                          {dog.picture_url ? (
                            <img
                              src={dog.picture_url}
                              alt={dog.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[var(--border-soft)]"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--foreground-lighter)] border-2 border-[var(--border-soft)] flex items-center justify-center">
                              <span className="text-2xl">🐕</span>
                            </div>
                          )}
                        </div>

                        {/* Dog Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-zen font-light text-[var(--foreground)] mb-1">
                            {dog.name}
                          </h3>
                          <p className="text-sm text-lighter font-noto font-light">
                            Added {new Date(dog.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(dog)}
                            className="text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] p-2 rounded-sketch hover:bg-[var(--background)] transition-colors duration-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDog(dog.id)}
                            className="text-red-500 hover:text-red-600 p-2 rounded-sketch hover:bg-[var(--background)] transition-colors duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--accent-light)] border-[1.5px] border-[var(--border-soft)] rounded-sketch">
                  <div className="text-6xl mb-4">🐕</div>
                  <p className="text-lg text-lighter font-noto font-light mb-4">No dog added yet</p>
                  <p className="text-sm text-lightest font-noto font-light">Add your dog to start logging poops!</p>
                </div>
              )}
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingDog) && (
              <div className="bg-[var(--accent-light)] border-[1.5px] border-[var(--border-soft)] rounded-sketch p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-zen font-light text-[var(--foreground)] tracking-wide">
                    {editingDog ? 'Edit Dog' : 'Add New Dog'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-lighter hover:text-[var(--foreground)] p-1 rounded-sketch hover:bg-[var(--background)] transition-colors duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-noto font-light text-[var(--foreground)] mb-2">
                      Dog Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] text-base font-light transition-colors duration-300"
                      placeholder="Enter your dog's name"
                      maxLength={50}
                    />
                  </div>

                  {/* Picture URL field hidden for now */}
                  {/* <div>
                    <label className="block text-sm font-noto font-light text-[var(--foreground)] mb-2">
                      Picture URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.picture_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, picture_url: e.target.value }))}
                      className="w-full px-4 py-3 border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] text-base font-light transition-colors duration-300"
                      placeholder="https://example.com/dog-photo.jpg"
                      maxLength={500}
                    />
                    <p className="text-xs text-lighter mt-2 font-noto font-light">
                      Add a photo URL to display your dog's picture
                    </p>
                  </div> */}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={editingDog ? handleUpdateDog : handleAddDog}
                      disabled={isSaving || !formData.name.trim()}
                      className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] disabled:bg-[var(--foreground-lighter)] text-[var(--background)] font-noto font-light py-3 px-6 text-base transition-all duration-300 ease-out rounded-xl relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[var(--accent-green)]/20 flex items-center justify-center gap-2 border-0 min-w-[120px]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : (editingDog ? 'Update Dog' : 'Add Dog')}
                    </button>

                    <button
                      onClick={resetForm}
                      className="text-lighter hover:text-[var(--foreground)] font-light transition-all duration-300 ease-out border-[1.5px] border-[var(--border-soft)] rounded-sketch py-3 px-6 bg-[var(--background)] hover:bg-[var(--accent-lighter)] relative hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)] min-w-[120px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-[var(--accent-light)] border-[1.5px] border-[var(--border-soft)] rounded-sketch p-4 sm:p-6">
              <h3 className="text-lg font-zen font-light text-[var(--foreground)] mb-3 tracking-wide">
                About Your Dog
              </h3>
              <ul className="space-y-2 text-sm text-lighter font-noto font-light list-disc list-inside">
                <li>Your dog profile is saved to your account and synced across devices</li>
                <li>Currently limited to one dog per account</li>
                <li>You can edit or delete your dog profile at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-0 fade-in">
          <div className="text-center py-16">
            <p className="text-xl sm:text-2xl text-lighter font-noto font-light mb-6">
              Sign in to manage your dogs
            </p>
            <p className="text-base text-lighter font-noto font-light mb-8 leading-relaxed">
              You need to be signed in to add and manage your dogs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <p className="text-sm text-lightest font-noto font-light">
                Ready to get started? Sign in or create an account using the buttons in the top right corner.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </main>
  );
}