import { useState } from 'react';

interface Choice {
  choiceText: string;
  isCorrect: boolean;
}

interface QuizQuestionProps {
  choices: Choice[];
  explanation: string;
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({
  choices,
  explanation,
}: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = selectedIndex !== null;
  const isCorrect = answered && choices[selectedIndex]?.isCorrect;

  const handleSelectAnswer = (index: number) => {
    if (!answered) setSelectedIndex(index);
  };

  const handleReset = () => setSelectedIndex(null);

  const getChoiceClasses = (index: number) => {
    const isSelected = selectedIndex === index;
    const baseClasses = 'w-full card p-4 text-left transition-all border-2';

    if (!isSelected) {
      return `${baseClasses} border-gray-300 hover:border-black ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`;
    }

    return `${baseClasses} cursor-not-allowed`;
  };

  const getChoiceStyle = (index: number) => {
    const isSelected = selectedIndex === index;
    if (!isSelected) return {};

    return {
      borderColor: isCorrect ? '#adf296' : '#f29696',
      backgroundColor: isCorrect ? '#f0fde0' : '#fde0e0',
    };
  };

  const getBadgeClasses = (index: number) => {
    const isSelected = selectedIndex === index;
    const baseClasses =
      'flex h-8 w-8 flex-shrink-0 items-center justify-center font-bold';

    if (!isSelected) {
      return `${baseClasses} bg-gray-300 text-gray-700`;
    }

    return `${baseClasses} text-black`;
  };

  const getBadgeStyle = (index: number) => {
    const isSelected = selectedIndex === index;
    if (!isSelected) return {};

    return {
      backgroundColor: isCorrect ? '#adf296' : '#f29696',
    };
  };

  return (
    <div className="mb-8">
      {/* Answer Options */}
      <div className="mb-8 space-y-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            disabled={answered}
            className={getChoiceClasses(index)}
            style={getChoiceStyle(index)}
          >
            <div className="flex items-start gap-3">
              <span
                className={getBadgeClasses(index)}
                style={getBadgeStyle(index)}
              >
                {LABELS[index]}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{LABELS[index]}</p>
                <p className="text-sm text-gray-700">{choice.choiceText}</p>
              </div>
              {selectedIndex === index && (
                <span className="flex-shrink-0 text-2xl">
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback & Explanation */}
      {answered && (
        <>
          <div
            className="p-4 mb-8 border-l-4 card"
            style={{
              borderColor: isCorrect ? '#adf296' : '#f29696',
              backgroundColor: isCorrect ? '#f0fde0' : '#fde0e0',
            }}
          >
            <p
              className="font-semibold"
              style={{
                color: isCorrect ? '#166534' : '#a82f2f',
              }}
            >
              {isCorrect ? '✓ Korrekt!' : '✗ Leider falsch!'}
            </p>
          </div>

          <div
            className="p-4 mb-8 border-l-4 card"
            style={{
              borderColor: '#96c7f2',
              backgroundColor: '#e8f4fd',
            }}
          >
            <h3 className="mb-2 font-semibold" style={{ color: '#1e3a8a' }}>
              Erklärung:
            </h3>
            <p className="text-sm" style={{ color: '#1e3a8a' }}>
              {explanation}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
