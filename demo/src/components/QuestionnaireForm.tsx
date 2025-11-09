'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { QuestionGroup, Variable } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface QuestionnaireFormProps {
  groups: QuestionGroup[];
  onComplete: (answers: Record<string, any>) => void;
}

export default function QuestionnaireForm({ groups, onComplete }: QuestionnaireFormProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const { sessionAnswers, updateSessionAnswer, validationErrors } = useAppStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: sessionAnswers
  });

  const currentGroup = groups[currentGroupIndex];
  const watchedValues = watch();

  // Auto-save answers as user types
  const handleFieldChange = (fieldName: string, value: any) => {
    updateSessionAnswer(fieldName, value);
  };

  const validateCurrentGroup = () => {
    const currentGroupFields = currentGroup.variables.map(v => v.var_code);
    const requiredFields = currentGroup.variables
      .filter(v => v.validation.required)
      .map(v => v.var_code);

    for (const field of requiredFields) {
      if (!watchedValues[field] || watchedValues[field] === '') {
        return false;
      }
    }
    return true;
  };

  const canProceed = validateCurrentGroup();

  const handleNext = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    } else {
      // Final submission
      onComplete(watchedValues);
    }
  };

  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const renderField = (variable: Variable) => {
    const fieldName = variable.var_code;
    const error = errors[fieldName] || validationErrors[fieldName];

    switch (variable.ui_hint) {
      case 'select':
        return (
          <select
            {...register(fieldName, {
              required: variable.validation.required,
              onChange: (e) => handleFieldChange(fieldName, e.target.value)
            })}
            className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
          >
            <option value="">Select an option...</option>
            {variable.validation.enum_values?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {variable.validation.enum_values?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  {...register(fieldName, {
                    required: variable.validation.required,
                    onChange: (e) => handleFieldChange(fieldName, e.target.value)
                  })}
                  value={option.value}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {variable.validation.enum_values?.map((option) => (
              <label key={option.value} className="flex items-start">
                <input
                  type="checkbox"
                  {...register(fieldName, {
                    onChange: (e) => {
                      const currentValues = watchedValues[fieldName] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: string) => v !== option.value);
                      handleFieldChange(fieldName, newValues);
                    }
                  })}
                  value={option.value}
                  checked={(watchedValues[fieldName] || []).includes(option.value)}
                  className="mt-0.5 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date_picker':
        return (
          <input
            type="date"
            {...register(fieldName, {
              required: variable.validation.required,
              onChange: (e) => handleFieldChange(fieldName, e.target.value)
            })}
            className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            defaultValue={variable.default_value === 'today' ? new Date().toISOString().split('T')[0] : variable.default_value}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...register(fieldName, {
              required: variable.validation.required,
              minLength: variable.validation.min_length,
              maxLength: variable.validation.max_length,
              onChange: (e) => handleFieldChange(fieldName, e.target.value)
            })}
            rows={3}
            className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder={variable.placeholder}
          />
        );

      default: // input
        return (
          <input
            type={variable.type === 'email' ? 'email' : variable.type === 'integer' ? 'number' : 'text'}
            {...register(fieldName, {
              required: variable.validation.required,
              minLength: variable.validation.min_length,
              maxLength: variable.validation.max_length,
              min: variable.validation.minimum,
              max: variable.validation.maximum,
              pattern: variable.validation.pattern ? new RegExp(variable.validation.pattern) : undefined,
              onChange: (e) => handleFieldChange(fieldName, e.target.value)
            })}
            className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder={variable.placeholder}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentGroupIndex + 1} of {groups.length}</span>
          <span>{Math.round(((currentGroupIndex + 1) / groups.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentGroupIndex + 1) / groups.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Group Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentGroup.name}</h2>
        <p className="text-gray-600">{currentGroup.description}</p>
      </div>

      {/* Questions */}
      <form className="space-y-6">
        {currentGroup.variables.map((variable) => (
          <div key={variable.var_code}>
            <label className="label flex items-center">
              {variable.display_name}
              {variable.validation.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
              {variable.help_text && (
                <div className="group relative ml-2">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-900 rounded-lg shadow-lg">
                    {variable.help_text}
                  </div>
                </div>
              )}
            </label>

            {renderField(variable)}

            {(errors[variable.var_code] || validationErrors[variable.var_code]) && (
              <p className="text-sm text-red-600 mt-1">
                {(errors[variable.var_code]?.message as string) || validationErrors[variable.var_code]}
              </p>
            )}

            {variable.help_text && (
              <p className="help-text">{variable.help_text}</p>
            )}
          </div>
        ))}
      </form>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentGroupIndex === 0}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentGroupIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {groups.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index < currentGroupIndex
                  ? 'bg-green-500'
                  : index === currentGroupIndex
                  ? 'bg-primary-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            canProceed
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentGroupIndex === groups.length - 1 ? (
            <>
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>

      {/* Completion status */}
      {!canProceed && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Please complete all required fields to continue
          </p>
        </div>
      )}
    </div>
  );
}