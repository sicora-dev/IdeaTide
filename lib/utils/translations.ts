// Convertir de UI (español) a BD (inglés)
export function statusToDatabase(status: string): "new" | "in_progress" | "under_review" | "completed" | undefined {
  const statusMap: Record<string, string> = {
    'nueva': 'new',
    'en_progreso': 'in_progress',
    'en_revision': 'under_review',
    'completada': 'completed'
  };
  return statusMap[status] as "new" | "in_progress" | "under_review" | "completed" | undefined;
}

export function priorityToDatabase(priority: string) {
  const priorityMap: Record<string, string> = {
    'baja': 'low',
    'media': 'medium',
    'alta': 'high'
  };
  return priorityMap[priority] || priority as "low" | "medium" | "high" | undefined;
}

export function effortToDatabase(effort: string) {
  const effortMap: Record<string, string> = {
    'Baja': 'low',
    'Media': 'medium',
    'Alta': 'high'
  };
  return effortMap[effort] || effort;
}

export function impactToDatabase(impact: string) {
  const impactMap: Record<string, string> = {
    'Bajo': 'low',
    'Medio': 'medium',
    'Alto': 'high'
  };
  return impactMap[impact] || impact;
}

// Convertir de BD (inglés) a UI (español)
export function statusToUI(status: string) {
  const statusMap: Record<string, string> = {
    'new': 'nueva',
    'in_progress': 'en_progreso',
    'under_review': 'en_revision',
    'completed': 'completada'
  };
  return statusMap[status] || status;
}

export function priorityToUI(priority: string) {
  const priorityMap: Record<string, string> = {
    'low': 'baja',
    'medium': 'media',
    'high': 'alta'
  };
  return priorityMap[priority] || priority;
}

export function effortToUI(effort: string) {
  const effortMap: Record<string, string> = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta'
  };
  return effortMap[effort] || effort;
}

export function impactToUI(impact: string) {
  const impactMap: Record<string, string> = {
    'low': 'Bajo',
    'medium': 'Medio',
    'high': 'Alto'
  };
  return impactMap[impact] || impact;
}