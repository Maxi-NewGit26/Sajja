import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialVows, initialCheckIns } from '../lib/mockData';
import { calculateSajjaScore, calculateStreak, evaluateUnlockedSeals } from '../lib/scoreCalculator';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SajjaContext = createContext();

export const SajjaProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [vows, setVows] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured() && user) {
      fetchSupabaseData();
    } else {
      setVows([]);
      setCheckIns([]);
    }
  }, [user]);

  const fetchSupabaseData = async () => {
    try {
      setLoading(true);
      
      // Fetch vows
      const { data: vowData } = await supabase
        .from('vows')
        .select(`*, milestones(*), witnesses(*)`)
        .eq('user_id', user.id);

      if (vowData) {
        setVows(vowData);
      } else {
        setVows([]);
      }

      // Fetch check-ins
      const { data: checkInData } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id);

      if (checkInData) {
        setCheckIns(checkInData);
      } else {
        setCheckIns([]);
      }
    } catch (err) {
      console.error('Supabase fetch error:', err);
      setVows([]);
      setCheckIns([]);
    } finally {
      setLoading(false);
    }
  };

  // Derived metrics
  const sajjaScore = calculateSajjaScore(vows, checkIns);
  const currentStreak = calculateStreak(checkIns);

  // Collect all witnesses from vows
  const allWitnesses = vows.reduce((acc, vow) => {
    return acc.concat(vow.witnesses || []);
  }, []);

  const seals = evaluateUnlockedSeals(vows, checkIns, allWitnesses);

  // Actions
  const addVow = async (newVowData) => {
    const vowId = 'vow-' + Date.now();
    const newVow = {
      id: vowId,
      user_id: user?.id || 'user-demo',
      title: newVowData.title,
      oath_quote: newVowData.oath_quote,
      category: newVowData.category || 'ทั่วไป',
      frequency: newVowData.frequency || 'daily',
      start_date: newVowData.start_date || new Date().toISOString().split('T')[0],
      end_date: newVowData.end_date,
      status: 'active',
      seal_color: newVowData.seal_color || 'crimson',
      created_at: new Date().toISOString(),
      milestones: (newVowData.milestones || []).map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        vow_id: vowId,
        title: m.title,
        target_date: m.target_date,
        is_completed: false
      })),
      witnesses: (newVowData.witnesses || []).map((w, idx) => ({
        id: `w-${Date.now()}-${idx}`,
        vow_id: vowId,
        witness_email: w.email,
        witness_name: w.name || w.email.split('@')[0],
        status: 'pending'
      }))
    };

    setVows((prev) => [newVow, ...prev]);

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('vows').insert([{
          id: vowId,
          user_id: user.id,
          title: newVow.title,
          oath_quote: newVow.oath_quote,
          category: newVow.category,
          frequency: newVow.frequency,
          start_date: newVow.start_date,
          end_date: newVow.end_date,
          status: newVow.status,
          seal_color: newVow.seal_color
        }]);

        if (newVow.milestones.length > 0) {
          await supabase.from('milestones').insert(newVow.milestones);
        }
        if (newVow.witnesses.length > 0) {
          await supabase.from('witnesses').insert(newVow.witnesses);
        }
      } catch (e) {
        console.error('Failed to save vow to Supabase:', e);
      }
    }

    return newVow;
  };

  const recordCheckIn = async (vowId, dateStr, status, note = '') => {
    const existingIndex = checkIns.findIndex(c => c.vow_id === vowId && c.check_date === dateStr);
    
    let updatedCheckIns = [...checkIns];
    const newCheckIn = {
      id: existingIndex >= 0 ? checkIns[existingIndex].id : `c-${Date.now()}`,
      vow_id: vowId,
      user_id: user?.id,
      check_date: dateStr,
      status: status, // 'completed', 'adjusted', 'missed'
      note: note,
      created_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      updatedCheckIns[existingIndex] = newCheckIn;
    } else {
      updatedCheckIns.push(newCheckIn);
    }

    setCheckIns(updatedCheckIns);

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('check_ins').upsert(newCheckIn, { onConflict: 'vow_id,check_date' });
      } catch (e) {
        console.error('Failed to sync check-in to Supabase:', e);
      }
    }
  };

  const toggleMilestone = (vowId, milestoneId) => {
    setVows(prevVows => prevVows.map(vow => {
      if (vow.id !== vowId) return vow;
      return {
        ...vow,
        milestones: vow.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, is_completed: !m.is_completed, completed_at: !m.is_completed ? new Date().toISOString().split('T')[0] : null };
        })
      };
    }));
  };

  const updateVowDetails = (vowId, updatedFields) => {
    setVows(prev => prev.map(v => v.id === vowId ? { ...v, ...updatedFields } : v));
  };

  return (
    <SajjaContext.Provider value={{
      vows,
      checkIns,
      sajjaScore,
      currentStreak,
      seals,
      loading,
      addVow,
      recordCheckIn,
      toggleMilestone,
      updateVowDetails
    }}>
      {children}
    </SajjaContext.Provider>
  );
};

export const useSajja = () => useContext(SajjaContext);
