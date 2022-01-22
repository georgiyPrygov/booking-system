import React, { useEffect } from 'react';
import { normalizeDates } from './dateUtils';

const useNormalizedDates = (
  events,
  set,
  startField = 'start',
  endField = 'end'
) =>
  useEffect(() => set(normalizeDates(events, startField, endField)), [
    events,
    startField,
    endField
  ]);

export default useNormalizedDates;
