import { use, useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

//카드 이미지( public 폴데이 있음 )
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

// 리액트 컴포넌트
function App() {
  //useState를 사용하여 카드 상태를 관리
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0); // 턴 수
  const [choiceOne, setchoiceOne] = useState(null); // 첫번째 선택한 카드
  const [choiceTwo, setchoiceTwo] = useState(null); // 두번째 선택한 카드
  const [disabled, setDisabled] = useState(false); // 카드 선택 비활성화

  // 새 게임 시작(카드 섞기)
  const shuffleCards = () => {
    // ...은 카드이미지배열의 모든 요소를 새 배열에 복사한다(총 2번 12개 카드)
    const shuffleCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5) // sort(정렬)는 섞는거 섞기 랜덤으로 섞음
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffleCards);
    setTurns(0);
  };
  // console.log(cards, turns); // 카드 섞기 확인

  function handleChoice(card) {
    // 카드 선택 (이미 첫번째 선택했으면 두번째에 저장)
    choiceOne ? setchoiceTwo(card) : setchoiceOne(card);
  }
  // 카드 선택 후 비교하기(두 카드가 같은지 확인), [카드 선택이 변경시]
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true); // 카드 선택 비활성화
      if (choiceOne.src === choiceTwo.src && choiceOne.id !== choiceTwo.id) {
        // 값을 바로 , () => 화살표 함수사용
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 500); // 0.5초(1000이 1초) 후에 카드 뒤집기
      }
    }
  }, [choiceOne, choiceTwo]);
  // useEffect(()=>[])   << 처음 시작시 한번 실행
  useEffect(() => {
    shuffleCards();
  }, []);

  // 선택한 카드 초기화
  const resetTurn = () => {
    setchoiceOne(null);
    setchoiceTwo(null);
    setTurns(turns + 1); // 턴 수 증가
    setDisabled(false); // 카드 선택 활성화
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            disabled={disabled}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            handleChoice={handleChoice}
            key={card.id}
            card={card}
          />
        ))}
      </div>
      <p>턴수 : {turns}</p>
    </div>
  );
}

export default App;
