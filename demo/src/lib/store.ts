import { create } from 'zustand';
import { Template, Session, DocumentPreview, GeneratedDocument } from './types';

interface AppState {
  // Template discovery state
  selectedCategory: string | null;
  selectedJurisdictions: string[];
  selectedLanguage: string | null;
  searchQuery: string;
  filteredTemplates: Template[];

  // Session state
  currentSession: Session | null;
  sessionAnswers: Record<string, any>;
  validationErrors: Record<string, string>;

  // Document state
  documentPreview: DocumentPreview | null;
  generatedDocument: GeneratedDocument | null;

  // UI state
  showDisclaimer: boolean;
  disclaimerAccepted: boolean;
  currentStep: number;
  isLoading: boolean;

  // Actions
  setCategory: (category: string | null) => void;
  setJurisdictions: (jurisdictions: string[]) => void;
  setLanguage: (language: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilteredTemplates: (templates: Template[]) => void;

  setCurrentSession: (session: Session | null) => void;
  updateSessionAnswer: (field: string, value: any) => void;
  setValidationErrors: (errors: Record<string, string>) => void;

  setDocumentPreview: (preview: DocumentPreview | null) => void;
  setGeneratedDocument: (document: GeneratedDocument | null) => void;

  setShowDisclaimer: (show: boolean) => void;
  setDisclaimerAccepted: (accepted: boolean) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;

  // Computed actions
  resetFilters: () => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  selectedCategory: null,
  selectedJurisdictions: [],
  selectedLanguage: null,
  searchQuery: '',
  filteredTemplates: [],

  currentSession: null,
  sessionAnswers: {},
  validationErrors: {},

  documentPreview: null,
  generatedDocument: null,

  showDisclaimer: false,
  disclaimerAccepted: false,
  currentStep: 0,
  isLoading: false,

  // Filter actions
  setCategory: (category) => set({ selectedCategory: category }),
  setJurisdictions: (jurisdictions) => set({ selectedJurisdictions: jurisdictions }),
  setLanguage: (language) => set({ selectedLanguage: language }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilteredTemplates: (templates) => set({ filteredTemplates: templates }),

  // Session actions
  setCurrentSession: (session) => set({ currentSession: session }),
  updateSessionAnswer: (field, value) => set((state) => ({
    sessionAnswers: { ...state.sessionAnswers, [field]: value },
    validationErrors: { ...state.validationErrors, [field]: '' } // Clear error when user updates
  })),
  setValidationErrors: (errors) => set({ validationErrors: errors }),

  // Document actions
  setDocumentPreview: (preview) => set({ documentPreview: preview }),
  setGeneratedDocument: (document) => set({ generatedDocument: document }),

  // UI actions
  setShowDisclaimer: (show) => set({ showDisclaimer: show }),
  setDisclaimerAccepted: (accepted) => set({ disclaimerAccepted: accepted }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Reset actions
  resetFilters: () => set({
    selectedCategory: null,
    selectedJurisdictions: [],
    selectedLanguage: null,
    searchQuery: '',
    filteredTemplates: []
  }),

  resetSession: () => set({
    currentSession: null,
    sessionAnswers: {},
    validationErrors: {},
    documentPreview: null,
    generatedDocument: null,
    showDisclaimer: false,
    disclaimerAccepted: false,
    currentStep: 0
  })
}));