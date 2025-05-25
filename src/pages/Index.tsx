
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  answer: string;
  hint: string;
  code: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quantes dovelles podeu comptar a la façana principal?",
    answer: "17",
    hint: "Busqueu què és una \"dovella\".",
    code: "A la casella 1, el codi és la sisena nota musical."
  },
  {
    id: 2,
    question: "Com es diu el tipus de campanar d'aquesta ermita? Campanar d'... (9 lletres)",
    answer: "ESPADANYA",
    hint: "Escriviu en majúscules una paraula de 9 lletres que comença per \"E\" i acaba en \"A\"",
    code: "A la casella 2, el codi és la vocal que es repeteix més en la resposta que acabeu d'introduir."
  },
  {
    id: 3,
    question: "Quantes estàtues es poden veure a l'exterior de l'ermita? (escriviu el número)",
    answer: "0",
    hint: "En veieu alguna?",
    code: "Les caselles 3, 6 i 15 han de quedar en blanc."
  },
  {
    id: 4,
    question: "Quantes persones haurien de seure a cada banc perquè n'hi càpiguen 20? (escriviu el número)",
    answer: "4",
    hint: "Compteu el nombre de bancs que hi ha a l'interior, enfront de l'altar.",
    code: "A la casella 4 hi escriureu una paraula de 3 lletres: quan hi ha tempesta, el que sentirem després de veure un llamp."
  },
  {
    id: 5,
    question: "De quin segle data la primera documentació d'aquesta ermita? (escriviu el número)",
    answer: "11",
    hint: "No feu servir números romans.",
    code: "A les caselles 5 i 12 hi escriureu la segona nota musical."
  },
  {
    id: 6,
    question: "Quina lletra majúscula representa millor la forma de l'església?",
    answer: "T",
    hint: "Podeu llegir el panell informatiu que hi ha a l'entrada de l'ermita.",
    code: "A la casella 7 hi escriureu \"LAL\" i a la casella que fa el doble de 7 hi escriureu \"BRE\""
  },
  {
    id: 7,
    question: "Quantes portes permeten l'accés a l'interior de l'ermita?",
    answer: "2",
    hint: "Mireu que no n'hi hagi cap altre…",
    code: "A la casella 8 hi escriureu \"BA\""
  },
  {
    id: 8,
    question: "Entre la nau principal i el presbiteri hi ha un \"arc triomfal\". Si te'l mires mentre fas el pi, quina lletra dibuixa?",
    answer: "U",
    hint: "Es tracta d'una de les vocals, escrita en majúscules.",
    code: "A la casella 16 hi escriureu la resposta d'aquesta pregunta."
  },
  {
    id: 9,
    question: "Quantes finestres il·luminen l'interior de l'església? (escriviu el número)",
    answer: "2",
    hint: "Des de l'interior ho veureu millor.",
    code: "A la casella 9 hi escriureu el pronom feble català que fa la funció de complement indirecte en singular."
  },
  {
    id: 10,
    question: "Busqueu una brúixola i escriviu de manera abreujada l'orientació de la porta més nova (E = Est, N = Nord, S = Sud, O = Oest)",
    answer: "O",
    hint: "Recordeu què són i quina forma tenen els contraforts.",
    code: "A la casella 10 hi escriureu l'abreviatura de l'orientació de la porta vella i de la porta nova (en aquest ordre). També és el que se li diu a un cavall perquè s'aturi."
  },
  {
    id: 11,
    question: "Quants contraforts aguanten els murs de l'ermita? (escriviu el número)",
    answer: "0",
    hint: "Recordeu què són i quina forma tenen els contraforts.",
    code: "A la casella 11 hi escriureu \"TAR\". Sí, així de fàcil!"
  },
  {
    id: 12,
    question: "Si totes les campanes de l'ermita es posen a tocar a les 12 del migdia, quants tocs de campana sentirem en total? (escriviu el número)",
    answer: "12",
    hint: "També podeu cantar una nadala que diu \"Les … van tocant\"",
    code: "\"QUI\" escriurà el codi a la casella que té un número més que la vostra resposta?"
  }
];

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Cronòmetre
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && correctAnswers < 12) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, correctAnswers]);

  // Barrejar preguntes al començar
  const startGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setGameStarted(true);
    setGameTime(0);
    setCorrectAnswers(0);
    setErrors(0);
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setShowHint(false);
    setShowCode(false);
    setUserAnswer('');
    console.log('Joc iniciat amb preguntes barrejades:', shuffled.map(q => q.id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = () => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentQuestion.answer.toLowerCase();

    console.log('Comprovant resposta:', {
      userAnswer: normalizedUserAnswer,
      correctAnswer: normalizedCorrectAnswer,
      questionId: currentQuestion.id
    });

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Resposta correcta
      setCorrectAnswers(prev => prev + 1);
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
      setShowCode(true);
      setShowHint(false);
      
      toast({
        title: "Resposta correcta! 🎉",
        description: "Anota el codi al teu paper i continua amb la següent pregunta.",
      });

      console.log('Resposta correcta! Pregunta completada:', currentQuestion.id);
    } else {
      // Resposta incorrecta
      setErrors(prev => prev + 1);
      setShowHint(true);
      setShowCode(false);
      
      toast({
        title: "Resposta incorrecta ❌",
        description: "Mira la pista que ha aparegut per ajudar-te.",
        variant: "destructive"
      });

      console.log('Resposta incorrecta. Errors totals:', errors + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowHint(false);
      setShowCode(false);
      console.log('Passant a la següent pregunta. Índex:', currentQuestionIndex + 1);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setCorrectAnswers(0);
    setErrors(0);
    setShowHint(false);
    setShowCode(false);
    setGameTime(0);
    setAnsweredQuestions(new Set());
    console.log('Joc reiniciat');
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="shadow-2xl border-amber-200 bg-gradient-to-b from-amber-50 to-orange-50">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-amber-700 mr-2" />
                <CardTitle className="text-3xl font-bold text-amber-900">
                  Troba la relíquia de l'ermita
                </CardTitle>
              </div>
              <div className="text-lg text-amber-800 font-medium">
                Ermita romànica de Ca n'Anglada - Terrassa
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/70 rounded-lg p-6 border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">
                  🎮 Com funciona el joc?
                </h3>
                <ul className="space-y-3 text-amber-800">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Respondreu 12 preguntes sobre l'ermita en ordre aleatori</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Cada resposta correcta us donarà un codi per anotar al paper</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Si us equivoqueu, rebreu una pista per ajudar-vos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tots els codis junts us indicaran on trobar la relíquia!</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-amber-100 rounded-lg p-4 border border-amber-300">
                <p className="text-amber-900 text-center font-medium">
                  🕵️ Prepareu-vos per explorar l'ermita i descobrir els seus secrets!
                </p>
              </div>

              <Button 
                onClick={startGame}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
              >
                🚀 Començar l'aventura
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Joc completat
  if (correctAnswers === 12) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="shadow-2xl border-green-200 bg-gradient-to-b from-green-50 to-emerald-50">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-green-800 mb-4">
                🎉 Felicitats! 🎉
              </CardTitle>
              <div className="text-xl text-green-700">
                Heu completat l'Escape Room!
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-white/70 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  📊 Resultats finals
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-800">{formatTime(gameTime)}</div>
                    <div className="text-green-700">Temps total</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-800">{errors}</div>
                    <div className="text-red-700">Errors totals</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300">
                <p className="text-yellow-900 font-medium">
                  🗝️ Ara podeu utilitzar tots els codis que heu anotat per trobar la relíquia de l'ermita!
                </p>
              </div>

              <Button 
                onClick={restartGame}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                🔄 Jugar de nou
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = (correctAnswers / 12) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto pt-4">
        {/* Capçalera amb estadístiques */}
        <Card className="mb-4 shadow-lg border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(gameTime)}
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors} errors
                </Badge>
              </div>
              <Badge className="bg-amber-600 text-white">
                {correctAnswers}/12 preguntes
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Pregunta actual */}
        <Card className="shadow-2xl border-amber-200 bg-gradient-to-b from-white to-amber-50">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">
              Pregunta {correctAnswers + 1} de 12
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-lg text-amber-900 font-medium leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Input de resposta */}
            <div className="space-y-3">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escriu la teva resposta aquí..."
                className="h-12 text-lg border-amber-300 focus:border-amber-500"
                onKeyPress={(e) => e.key === 'Enter' && !showCode && checkAnswer()}
                disabled={showCode}
              />
              
              {!showCode && (
                <Button 
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  Comprovar resposta
                </Button>
              )}
            </div>

            {/* Pista */}
            {showHint && (
              <Alert className="border-yellow-300 bg-yellow-50">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Pista:</strong> {currentQuestion.hint}
                </AlertDescription>
              </Alert>
            )}

            {/* Codi */}
            {showCode && (
              <div className="space-y-4">
                <Alert className="border-green-300 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Codi per anotar:</strong> {currentQuestion.code}
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={nextQuestion}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Següent pregunta →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
