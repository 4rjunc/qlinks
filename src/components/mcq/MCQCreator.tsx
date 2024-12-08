// @ts-nocheck

// TODO
// Recheck the use of availableBalance attribute. its added by AI
// Minor improvements for UI use toast screen warnings and sucess

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Predefined list of tokens with their details
const TOKEN_OPTIONS = [
  {
    symbol: "SOL",
    name: "Solana",
    address: "So11111111111111111111111111111111111111112",
    decimals: 9,
    availableBalance: 1000000,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    availableBalance: 50000,
  },
  {
    symbol: "BONK",
    name: "Bonk Inu",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
    availableBalance: 100000000,
  },
  {
    symbol: "SAMO",
    name: "Samoyield",
    address: "SAMo3ixzK4WHR3gWr1TxgzGMeKh5iero8ht3UjDgDno",
    decimals: 9,
    availableBalance: 250000,
  },
];

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
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Question</label>
          <Input
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
              <Input
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

  const [selectedToken, setSelectedToken] = useState(null);
  const [rewardAmount, setRewardAmount] = useState("");

  const handleTokenSelect = (tokenSymbol) => {
    const token = TOKEN_OPTIONS.find((t) => t.symbol === tokenSymbol);
    setSelectedToken(token);
  };

  const handlePublish = () => {
    // Validate all questions
    const invalidQuestions = questions.filter(
      (q) =>
        !q.question ||
        q.options.some((opt) => opt.trim() === "") ||
        q.correctAnswer === null,
    );

    // Validate token and reward amount
    if (!selectedToken) {
      alert("Please select a token");
      return;
    }

    if (!rewardAmount || isNaN(parseFloat(rewardAmount))) {
      alert("Please enter a valid reward amount");
      return;
    }

    // Check if reward amount exceeds available balance
    const rewardAmountNumber = parseFloat(rewardAmount);
    if (
      rewardAmountNumber >
      selectedToken.availableBalance / 10 ** selectedToken.decimals
    ) {
      alert(`Insufficient ${selectedToken.symbol} balance`);
      return;
    }

    if (invalidQuestions.length > 0) {
      alert(
        "Please fill in all fields and select correct answers for all questions",
      );
      return;
    }

    // Generate unique identifiers
    const quizUid = uuidv4(); // Unique ID for the entire quiz

    // Data structure to be stored in table
    const mcqData = {
      quizUid: quizUid,
      token: {
        symbol: selectedToken.symbol,
        name: selectedToken.name,
        address: selectedToken.address,
        decimals: selectedToken.decimals,
      },
      rewardAmount: rewardAmountNumber,
      questions: questions.map((q, index) => ({
        questionId: `Q-${quizUid}-${index + 1}`,
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
          {/* Token Selection */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Token</label>
            <Select onValueChange={handleTokenSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {TOKEN_OPTIONS.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center">
                      <span className="mr-2">{token.symbol}</span>
                      <span className="text-xs text-gray-500">
                        {token.name} | Balance:{" "}
                        {token.availableBalance / 10 ** token.decimals}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Token Details */}
          {selectedToken && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p>
                <strong>Token Address:</strong> {selectedToken.address}
              </p>
              <p>
                <strong>Available Balance:</strong>{" "}
                {selectedToken.availableBalance / 10 ** selectedToken.decimals}{" "}
                {selectedToken.symbol}
              </p>
            </div>
          )}

          {/* Reward Amount Input */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Reward Amount</label>
            <Input
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder="Enter reward amount"
              className="w-full"
              min="0"
              step="0.01"
              disabled={!selectedToken}
            />
            {selectedToken && (
              <p className="text-xs text-gray-500 mt-1">
                Max:{" "}
                {selectedToken.availableBalance / 10 ** selectedToken.decimals}{" "}
                {selectedToken.symbol}
              </p>
            )}
          </div>

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
          <Button
            onClick={handlePublish}
            className="w-full mt-4"
            disabled={!selectedToken}
          >
            Publish Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCQCreator;
