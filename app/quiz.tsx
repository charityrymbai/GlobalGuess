import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { countriesList } from '../data/countriesList';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Questions {
  options: string[];
  correct_option: string;
  question_text: string;
  image_url: string;
}

const Quiz = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const NUM_QUESTIONS: number = parseInt(Array.isArray(params.data) ? params.data[0] : params.data);

  const [questions, setQuestions] = useState<Questions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [backGroundColor, setBackGroundColor] = useState<string>('white');
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (!NUM_QUESTIONS) {
      router.push('/');
    }
    const generateQuestions = () => {
      const countryCodes = Object.keys(countriesList);
      const questions: Questions[] = [];

      for (let i = 0; i < NUM_QUESTIONS; i++) {
        const options: string[] = [];
        while (options.length < 4) {
          const randomIndex = Math.floor(Math.random() * countryCodes.length);
          const countryCode = countryCodes[randomIndex];
          if (!options.includes(countryCode)) {
            options.push(countryCode);
          }
        }
        const correctOption = options[Math.floor(Math.random() * 4)];
        questions.push({
          options,
          correct_option: correctOption,
          question_text: `Which country does this flag belong to?`,
          image_url: `https://flagsapi.com/${correctOption}/flat/64.png`,
        });
      }
      setQuestions(questions);
    };
    generateQuestions();
  }, [NUM_QUESTIONS, ]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option,
    });
    if (option === currentQuestion.correct_option) {
      setBackGroundColor('green');
    } else {
      setBackGroundColor('red');
      setShowAnswer(true);
    }
    setDisableButtons(true);
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    } else {
      setQuizCompleted(true);
    }
    setBackGroundColor('white');
    setDisableButtons(false);
    setShowAnswer(false);
  };

  const evaluateQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_option) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: backGroundColor }]}>
      {!quizCompleted ? (
        currentQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
              <Image source={{ uri: currentQuestion.image_url }} style={styles.flagImage} />
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <Pressable
                  key={index}
                  disabled={disableButtons}
                  style={[
                    styles.optionButton,
                    showAnswer && option === currentQuestion.correct_option ? styles.correctOption : null,
                    selectedOption === option
                      ? option === currentQuestion.correct_option
                        ? styles.correctOption
                        : styles.wrongOption
                      : null,
                  ]}
                  onPress={() => handleOptionClick(option)}
                >
                  <Text style={styles.optionText}>{countriesList[option]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.resultText}>
            You answered {evaluateQuiz()} out of {questions.length} questions correctly.
          </Text>
          <Pressable
            className='p-5 bg-gray-500 rounded-3xl'
            onPress={() => router.push('/')}
          ><Text className='text-white text-xl'>Go Back</Text></Pressable>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  questionContainer: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  flagImage: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  correctOption: {
    backgroundColor: '#4ade80',
  },
  wrongOption: {
    backgroundColor: '#ef4444',
  },
  resultContainer: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Quiz;