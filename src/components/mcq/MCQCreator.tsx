import React, { useState } from "react";
//import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const SingleMCQ = ({ questionData, onUpdate, onDelete, index }) => {
  const handleOptionChange = (optIndex, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[optIndex] = value;
    onUpdate({
      ...questionData,
      options: updatedOptions,
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Question {index + 1}</h3>
          {index > 0 && (
            <button //variant="destructive"
              // size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Question</label>
          <input
            value={questionData.question}
            onChange={(e) =>
              onUpdate({
                ...questionData,
                question: e.target.value,
              })
            }
            placeholder="Enter your question here"
            className="w-full"
          />
        </div>

        {/* Options Inputs */}
        <div className="space-y-2">
          <label className="block mb-2 font-medium">Options</label>
          {questionData.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center space-x-2 mb-2">
              <input
                value={option}
                onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                placeholder={`Option ${optIndex + 1}`}
                className="flex-grow"
              />
              <input
                type="radio"
                name={`correctAnswer-${index}`}
                checked={questionData.correctAnswer === optIndex}
                onChange={() =>
                  onUpdate({
                    ...questionData,
                    correctAnswer: optIndex,
                  })
                }
                className="h-5 w-5"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MCQCreator = () => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
    },
  ]);

  const handlePublish = () => {
    // Validate all questions
    const invalidQuestions = questions.filter(
      (q) =>
        !q.question ||
        q.options.some((opt) => opt.trim() === "") ||
        q.correctAnswer === null,
    );

    if (invalidQuestions.length > 0) {
      alert(
        "Please fill in all fields and select correct answers for all questions",
      );
      return;
    }

    // Data structure to be stored in table
    const mcqData = {
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
        metadata: {
          createdAt: new Date().toISOString(),
          status: "draft",
        },
      })),
    };

    console.log("MCQ Data to be stored:", mcqData);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
      },
    ]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Create Multiple Choice Questions</CardTitle>
          <Button variant="outline" size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <SingleMCQ
              key={index}
              questionData={question}
              index={index}
              onUpdate={(updatedQuestion) =>
                updateQuestion(index, updatedQuestion)
              }
              onDelete={() => deleteQuestion(index)}
            />
          ))}

          {/* Publish Button */}
          <Button onClick={handlePublish} className="w-full mt-4">
            Publish Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCQCreator;
