import React, { useState } from 'react';
import RouletteWheel from './RouletteWheel';
import { db } from '../firebase-config.js'; // Adjust the import path to your Firestore setup
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import '../styles/popup.css';

const SelectedNumber = ({ option, questions, userId }) => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleNumberSelected = (number) => {
    setSelectedNumber(number);
  };

  const handleClosePopup = () => {
    setSelectedNumber(null);
    setFeedback(''); // Clear feedback when closing the popup
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value); // Set selected option by value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(''); // Clear feedback before submission

    // Ensure a valid option is selected
    if (!selectedOption) {
      setFeedback('Please select an option.');
      return;
    }

    // Find the selected option object
    const selectedOptionObj = questions[selectedNumber - 1].options.find(opt => opt.text === selectedOption);
    const isCorrect = selectedOptionObj?.isCorrect || false;
    const score = isCorrect ? 10 : 0; // Set score based on correctness

    try {
      // Get the user's score document
      const userRef = doc(db, 'scores', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, {
          score: (userDoc.data().score || 0) + score
        });
      } else {
        // Create a new document
        await setDoc(userRef, { score });
      }

      setFeedback(isCorrect ? '¡Correcto!' : 'Incorrecto, intenta de nuevo.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating score:', error);
      setFeedback('An error occurred while updating the score.');
    }
  };

  let selectedQuestion = {};
  if (selectedNumber) {
    selectedQuestion = questions[selectedNumber - 1] || {};
  }

  return (
    <div>
      <RouletteWheel options={option} onNumberSelected={handleNumberSelected} />
      {selectedNumber && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="popup-close text-red-600"
              onClick={handleClosePopup}
              aria-label="Close popup"
            >
              &times;
            </button>
            <h2 className='text-black'>{selectedQuestion.question}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ul className='text-black'>
                {selectedQuestion.options?.map((opt, index) => (
                  <li className='flex justify-center items-center' key={index}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="selectedOption" // Match name to form parameter
                        value={opt.text} // Use option text as value
                        checked={selectedOption === opt.text} // Set checked state
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      <label htmlFor={`option-${index}`} className="text-black">
                        {opt.text}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
              {feedback && <p className="mt-4 text-lg text-black">{feedback}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedNumber;
