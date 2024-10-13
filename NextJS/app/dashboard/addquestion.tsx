"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const AskQuestionButton = ({ submitQuestionFunc, data }: { submitQuestionFunc: any, data: any }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [question, setQuestion] = useState("");
  const [buttonPosition, setButtonPosition] = useState({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    if (!buttonRef.current) return;

    // Get the button's exact position
    const rect = buttonRef.current.getBoundingClientRect();
    const parentRect = buttonRef.current.parentElement?.getBoundingClientRect(); // For relative positioning

    setButtonPosition({
      top: `${rect.top - (parentRect?.top ?? 0)}px`,
      left: `${rect.left - (parentRect?.left ?? 0)}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    setIsClicked(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitQuestionFunc(question); // Run the function with the question as an argument
    setIsClicked(false); // Reset to button state after submission
    setQuestion(""); // Clear the input
  };

  return (
    <>
      {!isClicked ? (
        <Button
          ref={buttonRef} // Reference the button to capture its position
          onClick={handleButtonClick}
          style={{
            zIndex: 100,
            position: "absolute",
            top: `calc(50% + ${Math.sin((data.questions.length / (data.questions.length + 2)) * 2 * Math.PI) * 250 * 0.5}px)`,
            left: `calc(50% + ${Math.cos((data.questions.length / (data.questions.length + 2)) * 2 * Math.PI) * 250 * 1.25}px)`,
            transform: "translate(-50%, -50%)",
            width: '200px',
          }}
          variant="ghost"
          className="text-xs text-gray-800 bg-[#F9F6F0] min-w-[100px] hover:bg-[#F9F6F0] hover:border-2 hover:border-gray-800"
        >
          + Ask your own question
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            position: "absolute",
            ...buttonPosition, // Apply captured position to the form
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column', // Align elements in a column (input on top, button below)
            alignItems: 'flex-start', // Align both input and button to the left
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question"
            style={{
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "5px",
              width: "300px",
              marginBottom: '10px', // Add space between the input and submit button
              color: '#222',
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "#F9F6F0",
              border: "1px solid gray",
              borderRadius: "5px",
              width: '300px', // Ensure the button width matches the input width
              color: '#222',
            }}
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default AskQuestionButton;
