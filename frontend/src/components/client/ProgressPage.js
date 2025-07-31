import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Upload, TrendingUp, Smile, Meh, Frown, Plus, Activity, Heart, Camera, Scale, X as XIcon, ArrowDown, ArrowUp, Minus as MinusIcon } from 'lucide-react';
import ApiClient from '../../utils/ApiClient';
import EmptyState from '../common/EmptyState';

const LogProgressModal = ({ isOpen, onClose, clientId, onProgressLogged, showNotification }) => {
  const [weight, setWeight] = useState('');
  const [mood, setMood] = useState('Smile');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let logged = false;
      if (weight) {
        await ApiClient.logBodyStats(clientId, { weight: parseFloat(weight), mood });
        logged = true;
      }
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        await ApiClient.uploadProgressPhoto(clientId, formData);
        logged = true;
      }
      if(logged) {
        showNotification('Progress Logged!', 'Your new data has been saved.', 'success');
        onProgressLogged();
        onClose();
        setWeight(''); setMood('Smile'); setPhoto(null); setPhotoPreview(null);
      } else {
        showNotification('Nothing to Log', 'Please enter weight or upload a photo.', 'info');
      }
    } catch (error) {
      showNotification('Log Failed', 'Could not save your progress. Please try again.', 'error');
    }
  };

  const moodOptions = [{ name: 'Smile', icon: Smile }, { name: 'Meh', icon: Meh }, { name: 'Frown', icon: Frown }];
  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card-premium w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-display">Log Your Progress</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-border-light transition-colors"><XIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Current Weight (kg)" className="input-premium pl-12" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-3 text-center">How are you feeling today?</p>
            <div className="flex justify-center gap-4">
              {moodOptions.map(({ name, icon: Icon }) => (
                <button key={name} type="button" onClick={() => setMood(name)} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${mood === name ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/30' : 'bg-primary-bg hover:bg-border-light'}`}>
                  <Icon className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>
          <label className="relative block w-full h-48 border-2 border-dashed border-border-light rounded-2xl cursor-pointer flex items-center justify-center text-center text-text-secondary hover:border-brand-primary transition-colors bg-primary-bg overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2" />
                <span>Upload Progress Photo</span>
                <span className="text-xs mt-1">(Optional)</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
          <button type="submit" className="btn-primary w-full !mt-8">Log Progress</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProgressPage = ({ client, sharedData, onDataUpdate, showNotification }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { analytics, bodyStats, progressPhotos } = sharedData;  
  const isCompletelyEmpty = (!bodyStats || bodyStats.length === 0) && (!progressPhotos || progressPhotos.length === 0);

  const sortedBodyStats = useMemo(() => bodyStats.sort((a, b) => new Date(a.date) - new Date(b.date)), [bodyStats]);
  const sortedPhotos = useMemo(() => progressPhotos.sort((a, b) => new Date(b.date) - new Date(a.date)), [progressPhotos]);

  const weightChange = useMemo(() => {
    if (sortedBodyStats.length < 2) return null;
    const latest = sortedBodyStats[sortedBodyStats.length - 1].weight;
    const previous = sortedBodyStats[sortedBodyStats.length - 2].weight;
    return latest - previous;
  }, [sortedBodyStats]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-2">
          <p className="text-sm text-text-secondary">{new Date(label).toLocaleDateString()}</p>
          <p className="font-bold text-lg text-heading">{`${payload[0].value.toFixed(1)} kg`}</p>
        </div>
      );
    }
    return null;
  };

  const MetricCard = ({ icon, label, value, change }) => {
    const ChangeIcon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : MinusIcon;
    const changeColor = change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-text-secondary';
    return (
      <div className="card p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-text-secondary"><div className="w-8 h-8 flex items-center justify-center bg-primary-bg rounded-lg">{icon}</div><span>{label}</span></div>
        <p className="text-3xl font-bold text-display mt-2">{value}</p>
        {change !== null && <p className={`text-sm flex items-center gap-1 ${changeColor}`}><ChangeIcon className="w-4 h-4" /> {Math.abs(change).toFixed(1)} kg vs last</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="p-6 pb-24 space-y-6">
        <h1 className="text-3xl font-bold text-display">Your Progress</h1>

        {isCompletelyEmpty ? (
          <div className="pt-16">
            <EmptyState
              icon={TrendingUp}
              title="Your Progress Journey Begins"
              message="This is your space to track your transformation. Log your weight, mood, and photos to see your progress come to life."
            >
              <motion.button
                onClick={() => setIsLogging(true)}
                className="btn-primary mt-6 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Make Your First Log
              </motion.button>
            </EmptyState>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard icon={<Scale size={20}/>} label="Current Weight" value={`${sortedBodyStats.length > 0 ? sortedBodyStats[sortedBodyStats.length - 1].weight.toFixed(1) : '--'} kg`} change={weightChange} />
                <MetricCard icon={<Activity size={20}/>} label="Workout Streak" value={`${analytics?.workout_streak || 0} days`} />
                <MetricCard icon={<Heart size={20}/>} label="Diet Adherence" value={`${Math.round((analytics?.diet_adherence || 0) * 100)}%`} />
            </div>

            <div className="card-premium p-4 md:p-6">
              <h2 className="text-lg font-bold text-heading mb-4">Weight Journey</h2>
              <div className="h-72 -ml-4">
                {sortedBodyStats.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sortedBodyStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} fontSize={12} tick={{ fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} fontSize={12} tick={{ fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(var(--color-brand-primary-rgb), 0.1)' }} />
                      <Area type="monotone" dataKey="weight" stroke="var(--color-brand-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={TrendingUp} title="Track Your Journey" message="Log your weight at least twice to see your progress chart build over time." />
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-heading mb-4">Photo Log</h2>
              {sortedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {sortedPhotos.map((p, i) => (
                    <motion.div key={p.id} layoutId={`photo-${p.id}`} onClick={() => setSelectedPhoto(p)} className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-border-light group relative"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                      <img src={p.url} alt={`Progress on ${p.date}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-4">
                        <p className="text-white text-xs font-bold">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Camera} title="Create a Visual Diary" message="Upload progress photos to visually track your transformation." />
              )}
            </div>
          </div>
        )}
      </div>

      {!isCompletelyEmpty && (
        <motion.button onClick={() => setIsLogging(true)} className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-2xl shadow-brand-primary/30" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
          <Plus size={32} />
        </motion.button>
      )}

      <AnimatePresence><LogProgressModal isOpen={isLogging} onClose={() => setIsLogging(false)} clientId={client.id} onProgressLogged={onDataUpdate} showNotification={showNotification} /></AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div onClick={() => setSelectedPhoto(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.img layoutId={`photo-${selectedPhoto.id}`} src={selectedPhoto.url} alt="" className="max-w-full max-h-full rounded-lg shadow-2xl" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-6 text-center bg-black/50 text-white px-4 py-2 rounded-full">
              {new Date(selectedPhoto.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.div>
            <motion.button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
              <XIcon/>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressPage;
